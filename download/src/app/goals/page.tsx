'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const goals = [
  { id: 'goal1', name: "Office Renovation Fund", targetAmount: 500000, currentAmount: 250000, category: "Savings", targetDate: "2024-12-31" },
  { id: 'goal2', name: "New Market Expansion", targetAmount: 1500000, currentAmount: 600000, category: "Investment", targetDate: "2025-06-30" },
  { id: 'goal3', name: "Clear Business Loan", targetAmount: 800000, currentAmount: 750000, category: "Debt Repayment", targetDate: "2024-10-31" },
];

const formatCurrency = (value: number) => `৳${new Intl.NumberFormat('en-IN').format(value)}`;

export default function GoalsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Financial Goals</h1>
            <p className="text-muted-foreground">Set, track, and manage your financial goals.</p>
          </div>
          <Button><PlusCircle className="mr-2 h-4 w-4" /> New Goal</Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => {
            const progress = Math.round((goal.currentAmount / goal.targetAmount) * 100);
            return (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{goal.name}</CardTitle>
                    <div className="text-xs py-1 px-2.5 rounded-full bg-primary/10 text-primary font-medium">{goal.category}</div>
                  </div>
                  <CardDescription>Target Date: {goal.targetDate}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-green-600">{formatCurrency(goal.currentAmount)}</span>
                      <span className="text-sm text-muted-foreground"> of {formatCurrency(goal.targetAmount)}</span>
                    </div>
                    <Progress value={progress} />
                    <div className="text-right text-sm font-bold mt-1">{progress}%</div>
                  </div>
                  <Button variant="outline" className="w-full">Manage Goal</Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
