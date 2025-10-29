'use client';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import React, { useState } from 'react';
import { analyzeTrendsAndForecast, type TrendAnalysisAndForecastingOutput } from '@/ai/flows/trend-analysis-and-forecasting';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

const businessUnits = [
  'Setu Filling Station',
  'Setu CNG Refilling Station',
  'Setu LPG Station',
  'Huq Bricks',
  'Setu Feed Mills',
  'Setu Tech',
  'Hotel Midway',
  'Video Tara Pharmacy',
  'Hridoy Tara Pharmacy',
];

const metricsByUnit: Record<string, string[]> = {
  "Setu Filling Station": ["fuel_stock", "total_sales", "customer_traffic"],
  "Hotel Midway": ["guest_rating", "occupancy_rate", "revenue_per_room"],
  "Setu Tech": ["uptime", "new_tickets", "resolved_tickets"],
  "Huq Bricks": ["defect_rate", "production_volume", "orders_filled"],
};

export default function TrendsPage() {
    const [selectedUnit, setSelectedUnit] = useState<string>('');
    const [selectedMetric, setSelectedMetric] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<TrendAnalysisAndForecastingOutput | null>(null);
    const { toast } = useToast();
    
    const handleAnalysis = async () => {
        if (!selectedUnit || !selectedMetric) {
            toast({
                variant: 'destructive',
                title: 'Selection required',
                description: 'Please select both a business unit and a metric.',
            });
            return;
        }
        setIsLoading(true);
        setAnalysisResult(null);
        try {
            const result = await analyzeTrendsAndForecast({
                businessUnit: selectedUnit,
                metric: selectedMetric,
            });
            setAnalysisResult(result);
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Analysis Failed',
                description: 'There was an error generating the trend analysis.',
            });
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <AppShell>
      <div className="space-y-4">
         <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Trend Analysis & Forecasting</h1>
            <p className="text-muted-foreground">
              Leverage AI to understand trends and forecast future performance.
            </p>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Analyze a Metric</CardTitle>
            <CardDescription>Select a business unit and metric to generate an AI-powered analysis.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor="business-unit">Business Unit</Label>
                <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                  <SelectTrigger id="business-unit">
                    <SelectValue placeholder="Select a unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessUnits.map(unit => (
                      <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="metric">Metric</Label>
                <Select value={selectedMetric} onValueChange={setSelectedMetric} disabled={!selectedUnit}>
                  <SelectTrigger id="metric">
                    <SelectValue placeholder="Select a metric" />
                  </SelectTrigger>
                  <SelectContent>
                    {(metricsByUnit[selectedUnit] || []).map(metric => (
                      <SelectItem key={metric} value={metric}>{metric.replace(/_/g, ' ')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleAnalysis} disabled={isLoading || !selectedUnit || !selectedMetric} className="w-full md:w-auto">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Analyze Trend
                </Button>
              </div>
            </div>

            {analysisResult && (
              <div className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>AI Analysis Results</CardTitle>
                    <CardDescription>For {selectedMetric.replace(/_/g, ' ')} at {selectedUnit}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <div className="space-y-2">
                          <Label>Trend Analysis</Label>
                          <Textarea readOnly value={analysisResult.trendAnalysis} className="h-24"/>
                      </div>
                      <div className="space-y-2">
                          <Label>Forecast</Label>
                          <Textarea readOnly value={analysisResult.forecast} className="h-24"/>
                      </div>
                      {analysisResult.suggestedActions && (
                          <div className="space-y-2">
                              <Label>Suggested Actions</Label>
                              <Textarea readOnly value={analysisResult.suggestedActions} className="h-24"/>
                          </div>
                      )}
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
