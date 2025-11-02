'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, serverTimestamp, Timestamp } from 'firebase/firestore';
import { UploadCloud, File as FileIcon, Download } from 'lucide-react';
import { format } from 'date-fns';

type StoredFile = {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  createdAt: Timestamp;
};

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export default function StoragePage() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const storage = user ? getStorage() : null;

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [isUploading, setIsUploading] = React.useState(false);

  const filesCollectionRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/files`) : null, [firestore, user]);
  const { data: files, isLoading } = useCollection<StoredFile>(filesCollectionRef);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile || !user || !storage || !filesCollectionRef) {
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: 'Please select a file and ensure you are logged in.',
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    const storageRef = ref(storage, `uploads/${user.uid}/${Date.now()}-${selectedFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Upload error:', error);
        toast({ variant: 'destructive', title: 'Upload Error', description: error.message });
        setIsUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const fileData = {
            name: selectedFile.name,
            url: downloadURL,
            size: selectedFile.size,
            type: selectedFile.type,
            createdAt: serverTimestamp(),
          };
          addDocumentNonBlocking(filesCollectionRef, fileData);
          toast({ title: 'Upload Complete', description: `${selectedFile.name} has been uploaded.` });
          setIsUploading(false);
          setSelectedFile(null);
        });
      }
    );
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">File Storage</h1>
          <p className="text-muted-foreground">Upload, manage, and access your files.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload New File</CardTitle>
            <CardDescription>Select a file from your device to upload to secure storage.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Input id="file-upload" type="file" onChange={handleFileChange} className="flex-1" disabled={isUploading}/>
              <Button onClick={handleUpload} disabled={!selectedFile || isUploading}>
                <UploadCloud className="mr-2 h-4 w-4" />
                {isUploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
            {isUploading && (
                <div className="space-y-2">
                    <Progress value={uploadProgress} />
                    <p className="text-sm text-center text-muted-foreground">{Math.round(uploadProgress)}% complete</p>
                </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
            <CardDescription>A list of all your stored files.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Uploaded On</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && <TableRow><TableCell colSpan={5} className="text-center">Loading files...</TableCell></TableRow>}
                {files?.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                        <FileIcon className="h-4 w-4 text-muted-foreground" />
                        {file.name}
                    </TableCell>
                    <TableCell>{file.type}</TableCell>
                    <TableCell>{formatBytes(file.size)}</TableCell>
                    <TableCell>{file.createdAt ? format(file.createdAt.toDate(), 'PPP') : 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                        <a href={file.url} target="_blank" rel="noopener noreferrer">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {!isLoading && files?.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No files found. Upload one to get started.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
