'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

type AttendancePoint = {
    id: string;
    employeeName: string;
    inTime: string;
    points: number;
    date: string;
};

export default function AttendancePointsPage() {
  const firestore = useFirestore();
  const attendanceCollection = useMemoFirebase(() => {
    return firestore ? collection(firestore, 'attendance_points') : null;
  }, [firestore]);
  const { data: attendanceData, isLoading } = useCollection<AttendancePoint>(attendanceCollection);

  return (
    <AppShell>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Attendance points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span>Show</span>
                    <Select defaultValue="10">
                        <SelectTrigger className="w-20">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                    </Select>
                    <span>entries</span>
                </div>
                <div className="flex items-center gap-2">
                    <span>Search:</span>
                    <Input className="max-w-sm" />
                </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>In time</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                     <TableRow>
                        <TableCell colSpan={4} className="text-center h-24">
                            <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                        </TableCell>
                    </TableRow>
                ) : (
                    attendanceData?.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.employeeName}</TableCell>
                        <TableCell>{row.inTime}</TableCell>
                        <TableCell>{row.points}</TableCell>
                        <TableCell>{row.date}</TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
