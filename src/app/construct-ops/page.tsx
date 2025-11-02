'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader2 } from 'lucide-react';
import { estimateConstructionProject, type ConstructOpsOutput } from '@/ai/flows/construct-ops-flow';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function ConstructOpsPage() {
  const { toast } = useToast();
  const [projectDescription, setProjectDescription] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<ConstructOpsOutput | null>(null);

  const handleSubmit = async () => {
    if (!projectDescription) {
      toast({
        variant: 'destructive',
        title: 'Input Required',
        description: 'Please provide a project description.',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const response = await estimateConstructionProject({ projectDescription });
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'AI Error',
        description: 'Failed to generate the estimation. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const RiskIndicator = ({ level, analysis }: { level: 'Green' | 'Yellow' | 'Red', analysis: string }) => {
    return (
        <div className={cn('p-4 rounded-lg flex items-start gap-4', {
            'bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800': level === 'Green',
            'bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700': level === 'Yellow',
            'bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800': level === 'Red',
        })}>
            <div className={cn('w-4 h-4 rounded-full mt-1 flex-shrink-0', {
                'bg-green-500': level === 'Green',
                'bg-yellow-500': level === 'Yellow',
                'bg-red-500': level === 'Red',
            })}></div>
            <div>
                <p className={cn('font-bold', {
                    'text-green-800 dark:text-green-200': level === 'Green',
                    'text-yellow-800 dark:text-yellow-200': level === 'Yellow',
                    'text-red-800 dark:text-red-200': level === 'Red',
                })}>Risk Level: {level}</p>
                <p className="text-sm text-muted-foreground mt-1">{analysis}</p>
            </div>
        </div>
    )
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">ConstructOps GPT</h1>
          <p className="text-muted-foreground">AI-Powered Assistant for Construction Estimation</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Project Description
            </CardTitle>
            <CardDescription>
              Describe your project in detail (e.g., "5-story residential building in Dhaka, 10,000 sq ft, with standard finishes").
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter your project details here in English or Bengali..."
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="min-h-[120px]"
            />
            <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Generate Estimate'}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>AI Estimation Result for: {result.projectName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                
                <div className="space-y-2">
                    <h3 className="font-semibold">Project Summary</h3>
                    <p className="text-sm p-3 bg-muted rounded-md">{result.summaryBilingual.en}</p>
                    <p className="text-sm p-3 bg-muted rounded-md">{result.summaryBilingual.bn}</p>
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold">Preliminary Cost Estimate</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item (English)</TableHead>
                                <TableHead>Item (Bengali)</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead className="text-right">Rate (BDT)</TableHead>
                                <TableHead className="text-right">Total (BDT)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {result.costEstimate.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{item.item}</TableCell>
                                    <TableCell>{item.itemBn}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell className="text-right">{item.rate}</TableCell>
                                    <TableCell className="text-right font-medium">{item.total}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold">Risk Assessment</h3>
                    <RiskIndicator level={result.riskAssessment.level} analysis={result.riskAssessment.analysis} />
                </div>
                 <p className="text-xs text-center text-muted-foreground pt-4">Disclaimer: This is a preliminary, AI-generated estimate and should be used for reference purposes only.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
