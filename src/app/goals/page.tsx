'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const goals = [
  { id: 1, name: "Emergency Fund", targetAmount: 500000, currentAmount: 325000, targetDate: "2025-12-31" },
  { id: 2, name: "Downpayment for Apartment", targetAmount: 2000000, currentAmount: 750000, targetDate: "2026-06-30" },
  { id: 3, name: "Vacation to Europe", targetAmount: 300000, currentAmount: 300000, targetDate: "2024-09-01" },
  { id: 4, name: "New Car", targetAmount: 1500000, currentAmount: 450000, targetDate: "2025-08-31" },
];

const formatCurrency = (value: number) => `৳${new Intl.NumberFormat('en-IN').format(value)}`;

export default function GoalsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Financial Goals</h1>
            <p className="text-muted-foreground">Set, track, and achieve your financial aspirations.</p>
          </div>
          <Button><PlusCircle className="mr-2 h-4 w-4" /> New Goal</Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
            {goals.map(goal => {
                const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                return (
                    <Card key={goal.id}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>{goal.name}</CardTitle>
                                <Target className={`h-6 w-6 ${progress >= 100 ? 'text-green-500' : 'text-primary'}`} />
                            </div>
                            <CardDescription>Target Date: {goal.targetDate}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Progress value={progress} />
                            <div className="flex justify-between text-sm font-medium">
                                <span className="text-muted-foreground">{formatCurrency(goal.currentAmount)}</span>
                                <span className="text-foreground">{formatCurrency(goal.targetAmount)}</span>
                            </div>
                            {progress >= 100 ? (
                                <p className="text-center text-sm font-semibold text-green-600 pt-2">Goal Achieved! 🎉</p>
                            ) : (
                                <p className="text-center text-sm text-muted-foreground pt-2">{progress.toFixed(0)}% complete</p>
                            )}
                        </CardContent>
                    </Card>
                )
            })}
        </div>
      </div>
    </AppShell>
  );
}
