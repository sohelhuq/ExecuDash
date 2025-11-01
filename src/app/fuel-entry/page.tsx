'use client';

import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const entryFormSchema = z.object({
    date: z.date({ required_error: "A date is required." }),
    shift: z.enum(['morning', 'day', 'night']),
    nozzleNumber: z.string().min(1, 'Nozzle number is required'),
    petrolOpening: z.coerce.number().nonnegative(),
    petrolClosing: z.coerce.number().nonnegative(),
    dieselOpening: z.coerce.number().nonnegative(),
    dieselClosing: z.coerce.number().nonnegative(),
    octaneSales: z.coerce.number().nonnegative(),
    lubricantSales: z.coerce.number().nonnegative(),
    cashSales: z.coerce.number().nonnegative(),
    cardSales: z.coerce.number().nonnegative(),
    creditCollection: z.coerce.number().nonnegative(),
    fuelPurchase: z.coerce.number().nonnegative(),
    staffSalary: z.coerce.number().nonnegative(),
    utilityBills: z.coerce.number().nonnegative(),
    maintenanceCost: z.coerce.number().nonnegative(),
}).refine(data => data.petrolClosing >= data.petrolOpening, {
    message: "Petrol closing reading must be greater than or equal to opening.",
    path: ["petrolClosing"],
}).refine(data => data.dieselClosing >= data.dieselOpening, {
    message: "Diesel closing reading must be greater than or equal to opening.",
    path: ["dieselClosing"],
});

type FuelEntryFormValues = z.infer<typeof entryFormSchema>;

export default function FuelStationEntryPage() {
    const { toast } = useToast();
    const form = useForm<FuelEntryFormValues>({
        resolver: zodResolver(entryFormSchema),
        defaultValues: {
            date: new Date(),
            shift: 'morning',
            nozzleNumber: '',
            petrolOpening: 0,
            petrolClosing: 0,
            dieselOpening: 0,
            dieselClosing: 0,
            octaneSales: 0,
            lubricantSales: 0,
            cashSales: 0,
            cardSales: 0,
            creditCollection: 0,
            fuelPurchase: 0,
            staffSalary: 0,
            utilityBills: 0,
            maintenanceCost: 0,
        },
    });

    function onSubmit(data: FuelEntryFormValues) {
        console.log(data);
        toast({
            title: "Entry Submitted",
            description: "The daily entry has been successfully recorded.",
        });
        // Here you would typically send the data to your backend/Firestore
    }

    return (
        <AppShell>
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight">Fuel Station Daily Entry / দৈনিক ডেটা এন্ট্রি</h1>
                    <p className="text-muted-foreground">Enter daily operational data for the fuel station.</p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Daily Entry Form</CardTitle>
                        <CardDescription>Fill out all fields for the current shift.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <FormField control={form.control} name="date" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Date / তারিখ</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}><>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}</><CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name="shift" render={({ field }) => (<FormItem><FormLabel>Shift / শিফট</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select shift" /></SelectTrigger></FormControl><SelectContent><SelectItem value="morning">Morning</SelectItem><SelectItem value="day">Day</SelectItem><SelectItem value="night">Night</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name="nozzleNumber" render={({ field }) => (<FormItem><FormLabel>Nozzle Number / নজেল নম্বর</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                </div>
                                
                                <Separator />
                                <h3 className="text-lg font-medium">Meter Readings / মিটার রিডিং</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                     <FormField control={form.control} name="petrolOpening" render={({ field }) => (<FormItem><FormLabel>Petrol Opening / পেট্রোল ওপেনিং</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                     <FormField control={form.control} name="petrolClosing" render={({ field }) => (<FormItem><FormLabel>Petrol Closing / পেট্রোল ক্লোজিং</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                     <FormField control={form.control} name="dieselOpening" render={({ field }) => (<FormItem><FormLabel>Diesel Opening / ডিজেল ওপেনিং</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                     <FormField control={form.control} name="dieselClosing" render={({ field }) => (<FormItem><FormLabel>Diesel Closing / ডিজেল ক্লোজিং</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                </div>

                                <Separator />
                                <h3 className="text-lg font-medium">Sales / বিক্রয়</h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <FormField control={form.control} name="octaneSales" render={({ field }) => (<FormItem><FormLabel>Octane Sales / অকটেন বিক্রয় (টাকা)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name="lubricantSales" render={({ field }) => (<FormItem><FormLabel>Lubricant Sales / লুব্রিকেন্ট বিক্রয় (টাকা)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name="cashSales" render={({ field }) => (<FormItem><FormLabel>Cash Sales / ক্যাশ বিক্রয় (টাকা)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name="cardSales" render={({ field }) => (<FormItem><FormLabel>Card Sales / কার্ডে বিক্রয় (টাকা)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField control={form.control} name="creditCollection" render={({ field }) => (<FormItem><FormLabel>Credit Collection / বাকি আদায় (টাকা)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                </div>

                                <Separator />
                                <h3 className="text-lg font-medium">Expenses & Purchases / খরচ ও ক্রয়</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                     <FormField control={form.control} name="fuelPurchase" render={({ field }) => (<FormItem><FormLabel>Fuel Purchase / তেল ক্রয় (টাকা)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                     <FormField control={form.control} name="staffSalary" render={({ field }) => (<FormItem><FormLabel>Staff Salary / স্টাফ বেতন (টাকা)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                     <FormField control={form.control} name="utilityBills" render={({ field }) => (<FormItem><FormLabel>Utility Bills / ইউটিলিটি বিল (টাকা)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                     <FormField control={form.control} name="maintenanceCost" render={({ field }) => (<FormItem><FormLabel>Maintenance / মেরামত খরচ (টাকা)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button type="submit">Save Entry</Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    )
}
