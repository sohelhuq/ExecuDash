'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lightbulb, FileText, Bot, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateTaxInsight, type TaxInsightOutput } from '@/ai/insight-flow';

export default function TaxCenterPage() {
    const { toast } = useToast();
    const [insight, setInsight] = React.useState<TaxInsightOutput | null>(null);
    const [isLoadingInsight, setIsLoadingInsight] = React.useState(true);
    const [question, setQuestion] = React.useState('');
    const [isAsking, setIsAsking] = React.useState(false);

    React.useEffect(() => {
        const fetchInsight = async () => {
            setIsLoadingInsight(true);
            try {
                // In a real app, this data would come from your state management or API
                const financialData = {
                    totalIncome: 1250000,
                    totalExpenses: 750000,
                    expenseCategories: {
                        'Salaries': 250000,
                        'Office Rent': 120000,
                        'Marketing': 80000,
                    }
                };
                const result = await generateTaxInsight(financialData);
                setInsight(result);
            } catch (error) {
                console.error(error);
                toast({
                    variant: 'destructive',
                    title: 'Failed to generate insight',
                    description: 'The AI insight service is currently unavailable.',
                });
            } finally {
                setIsLoadingInsight(false);
            }
        };
        fetchInsight();
    }, [toast]);

    const handleAskAI = () => {
        if (!question) return;
        setIsAsking(true);
        toast({
            title: 'Coming Soon!',
            description: 'This interactive AI chat feature is under development.'
        });
        setTimeout(() => setIsAsking(false), 1000);
    }

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
                AI-Generated Tax Insight
              </CardTitle>
              <CardDescription>A personalized suggestion to optimize your tax strategy.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {isLoadingInsight && (
                    <div className="flex items-center gap-4 p-3 bg-accent/50 rounded-lg">
                        <Loader2 className="h-6 w-6 text-accent-foreground animate-spin" />
                        <p className="text-sm text-foreground">Generating your personalized financial insight...</p>
                    </div>
                )}
                {insight && (
                    <div className="flex items-start gap-4 p-3 bg-accent/50 rounded-lg">
                        <Lightbulb className="h-6 w-6 text-accent-foreground mt-1 flex-shrink-0" />
                        <p className="text-sm text-foreground">{insight.insight}</p>
                    </div>
                )}
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
                <Textarea 
                    placeholder="e.g., 'What are the deadlines for VAT returns in Bangladesh?'" 
                    className="min-h-[120px]"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />
                <Button onClick={handleAskAI} disabled={isAsking}>
                    {isAsking && <Loader2 className="h-4 w-4 mr-2 animate-spin"/>}
                    Ask AI
                </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Compliance & Reports</CardTitle>
            <CardDescription>Generate and download your necessary financial documents.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-around gap-4">
             <Button variant="outline" size="lg" className="flex-1 min-w-[200px]" onClick={() => toast({title: 'Coming Soon!'})}>
                <FileText className="mr-2"/>
                Generate Tax Return
             </Button>
             <Button variant="outline" size="lg" className="flex-1 min-w-[200px]" onClick={() => toast({title: 'Coming Soon!'})}>
                <FileText className="mr-2"/>
                Download P&L Statement
             </Button>
             <Button variant="outline" size="lg" className="flex-1 min-w-[200px]" onClick={() => toast({title: 'Coming Soon!'})}>
                <FileText className="mr-2"/>
                Export Compliance Log
             </Button>
          </CardContent>
        </Card>

      </div>
    </AppShell>
  );
}
