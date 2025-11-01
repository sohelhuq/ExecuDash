'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lightbulb, FileText, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const taxInsights = [
    { id: 'insight1', text: "Consider increasing contributions to a provident fund to maximize tax deductions under Section 25.", icon: Lightbulb },
    { id: 'insight2', text: "Your recent software purchases may be eligible for accelerated depreciation. We can help you claim this.", icon: Lightbulb },
    { id: 'insight3', text: "Based on your income pattern, setting up a tax-saving investment plan (e.g., Sanchayapatra) could be beneficial.", icon: Lightbulb },
];

export default function TaxCenterPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Tax Center</h1>
          <p className="text-muted-foreground">Smart insights and compliance for your business.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                AI-Generated Tax Insights
              </CardTitle>
              <CardDescription>Personalized suggestions to optimize your tax strategy.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {taxInsights.map((insight) => {
                const Icon = insight.icon;
                return (
                  <div key={insight.id} className="flex items-start gap-4 p-3 bg-accent/50 rounded-lg">
                    <Icon className="h-6 w-6 text-accent-foreground mt-1" />
                    <p className="text-sm text-foreground">{insight.text}</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                Ask FinanSage AI
              </CardTitle>
              <CardDescription>Get instant answers to your tax and finance questions.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
                <Textarea placeholder="e.g., 'What are the deadlines for VAT returns in Bangladesh?'" className="min-h-[120px]"/>
                <Button>Ask AI</Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Compliance & Reports</CardTitle>
            <CardDescription>Generate and download your necessary financial documents.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-around gap-4">
             <Button variant="outline" size="lg" className="flex-1">
                <FileText className="mr-2"/>
                Generate Tax Return
             </Button>
             <Button variant="outline" size="lg" className="flex-1">
                <FileText className="mr-2"/>
                Download P&L Statement
             </Button>
             <Button variant="outline" size="lg" className="flex-1">
                <FileText className="mr-2"/>
                Export Compliance Log
             </Button>
          </CardContent>
        </Card>

      </div>
    </AppShell>
  );
}
