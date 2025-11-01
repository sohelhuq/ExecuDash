'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, FileText, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const complianceStatus = [
  { id: 'dac7', name: "DAC7 Compliance", status: "Compliant", icon: CheckCircle, color: "text-green-500" },
  { id: 'psd3', name: "PSD3 Readiness", status: "In Progress", icon: Clock, color: "text-yellow-500" },
  { id: 'finCEN', name: "FinCEN Reporting", status: "Compliant", icon: CheckCircle, color: "text-green-500" },
  { id: 'irs', name: "IRS Filing (2023)", status: "Filed", icon: CheckCircle, color: "text-green-500" },
];

const aiInsights = [
  { id: 1, title: "Maximize Retirement Contributions", description: "You have room to contribute an additional ৳150,000 to your retirement fund, potentially saving you ৳37,500 in taxes.", estimatedSavings: 37500 },
  { id: 2, title: "Declare Home Office Expenses", description: "Based on your utility and rent expenses, you could deduct up to ৳50,000 as home office expenses.", estimatedSavings: 50000 },
  { id: 3, title: "Review Investment Portfolio for Tax-Loss Harvesting", description: "Consider selling underperforming assets to offset gains, which could reduce your capital gains tax.", estimatedSavings: 25000 },
];

const formatCurrency = (value: number) => `৳${new Intl.NumberFormat('en-IN').format(value)}`;


export default function TaxCenterPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tax Center</h1>
          <p className="text-muted-foreground">AI-powered insights and compliance monitoring.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>AI Tax Insights</CardTitle>
                    <CardDescription>Personalized suggestions to optimize your tax position.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {aiInsights.map(insight => (
                         <Alert key={insight.id}>
                            <Lightbulb className="h-4 w-4" />
                            <AlertTitle>{insight.title}</AlertTitle>
                            <AlertDescription>
                                {insight.description}
                                <div className="mt-2 font-semibold">
                                    Estimated Savings: <span className="text-green-600">{formatCurrency(insight.estimatedSavings)}</span>
                                </div>
                            </AlertDescription>
                        </Alert>
                    ))}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Compliance Status</CardTitle>
                    <CardDescription>Overview of your status with various tax regulations.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {complianceStatus.map(item => {
                        const Icon = item.icon;
                        return (
                            <div key={item.id} className="flex items-center justify-between rounded-lg border bg-card p-4">
                                <div className="flex items-center gap-3">
                                    <Icon className={`h-6 w-6 ${item.color}`} />
                                    <p className="font-medium">{item.name}</p>
                                </div>
                                <Badge variant={item.status === 'Compliant' || item.status === 'Filed' ? 'default' : 'secondary'} className={item.status === 'Compliant' || item.status === 'Filed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                    {item.status}
                                </Badge>
                            </div>
                        )
                    })}
                    <div className="pt-4">
                        <Button className="w-full"><FileText className="mr-2 h-4 w-4" /> Generate Tax Report</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </AppShell>
  );
}
