'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, serverTimestamp, Timestamp, addDoc } from 'firebase/firestore';
import { UploadCloud, File as FileIcon, Download, PlusCircle, CalendarIcon, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type BusinessDocument = {
  id: string;
  unit: string;
  docType: string;
  issueDate: Timestamp;
  expiryDate: Timestamp;
  fileUrl: string;
  fileName: string;
  status: 'Valid' | 'Expired' | 'Renewal Due';
};

const documentSchema = z.object({
    unit: z.string().min(1, "Unit is required."),
    docType: z.string().min(1, "Document type is required."),
    issueDate: z.date({ required_error: "Issue date is required."}),
    expiryDate: z.date({ required_error: "Expiry date is required."}),
    file: z.instanceof(File, { message: "A file is required." }),
});

type DocumentFormData = z.infer<typeof documentSchema>;

export default function DigitalVaultPage() {
    const { toast } = useToast();
    const { user } = useUser();
    const firestore = useFirestore();
    const storage = user ? getStorage() : null;

    const [isDialogOpen, setDialogOpen] = React.useState(false);
    const [uploadProgress, setUploadProgress] = React.useState(0);
    const [isUploading, setIsUploading] = React.useState(false);

    const form = useForm<DocumentFormData>({
        resolver: zodResolver(documentSchema)
    });

    const documentsRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/businessDocuments`) : null, [firestore, user]);
    const { data: documents, isLoading } = useCollection<BusinessDocument>(documentsRef);

    const getStatus = (expiryDate: Timestamp): BusinessDocument['status'] => {
        const now = new Date();
        const expiry = expiryDate.toDate();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(now.getDate() + 30);

        if (expiry < now) return 'Expired';
        if (expiry <= thirtyDaysFromNow) return 'Renewal Due';
        return 'Valid';
    };

    const onSubmit = async (values: DocumentFormData) => {
        if (!storage || !user || !documentsRef) return;

        setIsUploading(true);
        setUploadProgress(0);
        
        const selectedFile = values.file;
        const storageRef = ref(storage, `businessDocuments/${user.uid}/${Date.now()}-${selectedFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, selectedFile);

        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            },
            (error) => {
                console.error("Upload error:", error);
                toast({ variant: "destructive", title: "Upload Error", description: error.message });
                setIsUploading(false);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                const expiryTimestamp = Timestamp.fromDate(values.expiryDate);
                const docData = {
                    unit: values.unit,
                    docType: values.docType,
                    issueDate: Timestamp.fromDate(values.issueDate),
                    expiryDate: expiryTimestamp,
                    fileUrl: downloadURL,
                    fileName: selectedFile.name,
                    status: getStatus(expiryTimestamp),
                    notes: '',
                    issuer: '',
                    reminderDate: Timestamp.fromDate(new Date(values.expiryDate.getTime() - 30 * 24 * 60 * 60 * 1000)), // 30 days before expiry
                    uploadedBy: user.uid,
                    createdAt: serverTimestamp(),
                };

                try {
                    await addDoc(documentsRef, docData);
                    toast({ title: "Upload Complete", description: `${selectedFile.name} has been uploaded and recorded.`});
                    form.reset();
                    setDialogOpen(false);
                } catch (error) {
                    console.error("Firestore error:", error);
                    toast({ variant: "destructive", title: "Database Error", description: "Could not save document metadata."});
                } finally {
                    setIsUploading(false);
                }
            }
        );
    }

    return (
        <AppShell>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Digital Business Vault</h1>
                        <p className="text-muted-foreground">Manage all your business licenses, notices, and compliance files.</p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button><PlusCircle className="mr-2 h-4 w-4"/> Upload Document</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Upload New Business Document</DialogTitle>
                                <DialogDescription>Fill in the details and upload the document file.</DialogDescription>
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                     <FormField control={form.control} name="unit" render={({ field }) => (<FormItem><FormLabel>Business Unit</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a unit"/></SelectTrigger></FormControl><SelectContent><SelectItem value="Corporate">Corporate</SelectItem><SelectItem value="Pharmacy">Pharmacy</SelectItem><SelectItem value="CNG">CNG</SelectItem><SelectItem value="ISP">ISP</SelectItem><SelectItem value="Feed">Feed</SelectItem><SelectItem value="Bricks">Bricks</SelectItem><SelectItem value="Rentals">Rentals</SelectItem></SelectContent></Select><FormMessage/></FormItem>)}/>
                                     <FormField control={form.control} name="docType" render={({ field }) => (<FormItem><FormLabel>Document Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select document type"/></SelectTrigger></FormControl><SelectContent><SelectItem value="Trade Licence">Trade Licence</SelectItem><SelectItem value="BIN">BIN</SelectItem><SelectItem value="TIN">TIN</SelectItem><SelectItem value="VAT">VAT</SelectItem><SelectItem value="NID">NID</SelectItem><SelectItem value="Fire Licence">Fire Licence</SelectItem><SelectItem value="Explosives Licence">Explosives Licence</SelectItem><SelectItem value="Pharmacy Licence">Pharmacy Licence</SelectItem><SelectItem value="Feed Licence">Feed Licence</SelectItem><SelectItem value="Import/Export Licence">Import/Export Licence</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select><FormMessage/></FormItem>)}/>
                                     <FormField control={form.control} name="issueDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Issue Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}><>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}</><CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                                     <FormField control={form.control} name="expiryDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Expiry Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}><>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}</><CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                                     <FormField control={form.control} name="file" render={({ field: { onChange, ...fieldProps } }) => (<FormItem><FormLabel>File</FormLabel><FormControl><Input type="file" {...fieldProps} onChange={(e) => onChange(e.target.files?.[0])} /></FormControl><FormMessage /></FormItem>)} />

                                     {isUploading && <Progress value={uploadProgress} />}

                                    <DialogFooter>
                                        <Button type="submit" disabled={isUploading}>{isUploading ? 'Uploading...' : 'Save Document'}</Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Document Registry</CardTitle>
                        <CardDescription>All your uploaded business documents.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Document Type</TableHead>
                                    <TableHead>Unit</TableHead>
                                    <TableHead>Expiry Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading && <TableRow><TableCell colSpan={5} className="text-center">Loading documents...</TableCell></TableRow>}
                                {documents?.map((doc) => {
                                    const status = getStatus(doc.expiryDate);
                                    return (
                                        <TableRow key={doc.id}>
                                            <TableCell className="font-medium">{doc.docType}</TableCell>
                                            <TableCell>{doc.unit}</TableCell>
                                            <TableCell>{format(doc.expiryDate.toDate(), 'PPP')}</TableCell>
                                            <TableCell>
                                                <Badge className={cn({
                                                    'bg-green-100 text-green-800': status === 'Valid',
                                                    'bg-yellow-100 text-yellow-800': status === 'Renewal Due',
                                                    'bg-red-100 text-red-800': status === 'Expired',
                                                })}>{status}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4"/></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem asChild>
                                                            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                                                <Download className="mr-2 h-4 w-4"/> Download
                                                            </a>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>Mark for Renewal</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                                {!isLoading && documents?.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No documents found. Upload one to get started.</TableCell></TableRow>}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
