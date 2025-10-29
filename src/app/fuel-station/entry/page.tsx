'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Save } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const dailyEntrySchema = z.object({
  date: z.date({ required_error: 'Date is required.'}),
  shift: z.enum(['morning', 'day', 'night']),
  nozzleNumber: z.string().min(1, 'Nozzle number is required.'),
  
  petrolOpening: z.coerce.number().min(0, "Value must not be negative."),
  petrolClosing: z.coerce.number().min(0, "Value must not be negative."),
  dieselOpening: z.coerce.number().min(0, "Value must not be negative."),
  dieselClosing: z.coerce.number().min(0, "Value must not be negative."),
  octaneSalesLiters: z.coerce.number().min(0, "Value must not be negative.").optional(),
  lubricantSalesAmount: z.coerce.number().min(0, "Value must not be negative.").optional(),

  cashSales: z.coerce.number().min(0, "Value must not be negative."),
  cardSales: z.coerce.number().min(0, "Value must not be negative."),
  creditSales: z.coerce.number().min(0, "Value must not be negative.").optional(),
  creditCollection: z.coerce.number().min(0, "Value must not be negative.").optional(),

  fuelPurchase: z.coerce.number().min(0, "Value must not be negative."),
  staffSalary: z.coerce.number().min(0, "Value must not be negative.").optional(),
  utilityBills: z.coerce.number().min(0, "Value must not be negative.").optional(),
  maintenance: z.coerce.number().min(0, "Value must not be negative.").optional(),
}).refine(data => data.petrolClosing >= data.petrolOpening, {
    message: "Petrol closing reading must be greater than or equal to opening.",
    path: ["petrolClosing"],
}).refine(data => data.dieselClosing >= data.dieselOpening, {
    message: "Diesel closing reading must be greater than or equal to opening.",
    path: ["dieselClosing"],
});


export default function FuelStationEntryPage() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof dailyEntrySchema>>({
    resolver: zodResolver(dailyEntrySchema),
    defaultValues: {
      date: new Date(),
      shift: 'morning',
      nozzleNumber: '',
      petrolOpening: 0,
      petrolClosing: 0,
      dieselOpening: 0,
      dieselClosing: 0,
      cashSales: 0,
      cardSales: 0,
      fuelPurchase: 0,
    },
  });
  
  function onSubmit(values: z.infer<typeof dailyEntrySchema>) {
    console.log(values);
    toast({
      title: "Entry Submitted",
      description: "Daily fuel station data has been recorded.",
    });
    // Here you would typically save the data to Firestore
  }
  
  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fuel Station Daily Entry / দৈনিক ডেটা এন্ট্রি</h1>
          <p className="text-muted-foreground">Enter daily operational data for the fuel station.</p>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Daily Report</CardTitle>
                <CardDescription>Fill out all the required fields for the selected shift.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <FormField control={form.control} name="date" render={({ field }) => (
                                <FormItem className="flex flex-col"><FormLabel>Date / তারিখ</FormLabel>
                                  <Popover><PopoverTrigger asChild>
                                    <FormControl>
                                      <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                  </PopoverContent></Popover>
                                <FormMessage /></FormItem>
                            )} />
                            
                             <FormField control={form.control} name="shift" render={({ field }) => (
                                <FormItem><FormLabel>Shift / শিফট</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a shift" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                      <SelectItem value="morning">Morning / সকাল</SelectItem>
                                      <SelectItem value="day">Day / দিন</SelectItem>
                                      <SelectItem value="night">Night / রাত</SelectItem>
                                    </SelectContent>
                                  </Select>
                                <FormMessage /></FormItem>
                            )} />

                             <FormField control={form.control} name="nozzleNumber" render={({ field }) => (
                                <FormItem><FormLabel>Nozzle Number / নজেল নম্বর</FormLabel>
                                <FormControl><Input placeholder="e.g. N-01" {...field} /></FormControl>
                                <FormMessage /></FormItem>
                            )} />
                        </div>
                        
                        <Separator />
                        <h3 className="text-lg font-medium">Fuel Sales (Meter Readings) / জ্বালানি বিক্রয় (মিটার রিডিং)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="petrolOpening" render={({ field }) => (<FormItem><FormLabel>Petrol Opening</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="petrolClosing" render={({ field }) => (<FormItem><FormLabel>Petrol Closing</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="dieselOpening" render={({ field }) => (<FormItem><FormLabel>Diesel Opening</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="dieselClosing" render={({ field }) => (<FormItem><FormLabel>Diesel Closing</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="octaneSalesLiters" render={({ field }) => (<FormItem><FormLabel>Octane Sales (Liters)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="lubricantSalesAmount" render={({ field }) => (<FormItem><FormLabel>Lubricant Sales (Amount)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>

                        <Separator />
                        <h3 className="text-lg font-medium">Financial Information / আর্থিক তথ্য</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="cashSales" render={({ field }) => (<FormItem><FormLabel>Cash Sales / নগদ বিক্রয়</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="cardSales" render={({ field }) => (<FormItem><FormLabel>Credit Card Sales / কার্ড বিক্রয়</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="creditSales" render={({ field }) => (<FormItem><FormLabel>Credit Sales / বাকি বিক্রয়</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="creditCollection" render={({ field }) => (<FormItem><FormLabel>Credit Collection / বাকি আদায়</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                        
                        <Separator />
                        <h3 className="text-lg font-medium">Expenses / খরচ</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="fuelPurchase" render={({ field }) => (<FormItem><FormLabel>Fuel Purchase / জ্বালানি ক্রয়</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="staffSalary" render={({ field }) => (<FormItem><FormLabel>Staff Salary / কর্মচারী বেতন</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="utilityBills" render={({ field }) => (<FormItem><FormLabel>Utility Bills / ইউটিলিটি বিল</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="maintenance" render={({ field }) => (<FormItem><FormLabel>Maintenance / রক্ষণাবেক্ষণ</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                        
                        <div className="flex justify-end pt-4">
                            <Button type="submit"><Save className="mr-2 h-4 w-4" /> Save Entry</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
