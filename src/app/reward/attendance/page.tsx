'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const attendanceData = [
  { si: 1, employee: 'Honorato Imogene Curry Terry', inTime: '16:04', points: 0, date: '2025-10-28' },
  { si: 2, employee: 'Maisha Lucy Zamora Gonzales', inTime: '17:29', points: 0, date: '2025-10-28' },
  { si: 3, employee: 'Amy Aphrodite Zamora Peck', inTime: '16:12', points: 0, date: '2025-10-28' },
  { si: 4, employee: 'Maisha Lucy Zamora Gonzales', inTime: '00:52', points: 5, date: '2025-10-27' },
  { si: 5, employee: 'Honorato Imogene Curry Terry', inTime: '15:20', points: 0, date: '2025-10-27' },
  { si: 6, employee: 'Maisha Lucy Zamora Gonzales', inTime: '17:28', points: 0, date: '2025-10-27' },
  { si: 7, employee: 'Amy Aphrodite Zamora Peck', inTime: '01:05', points: 0, date: '2025-10-27' },
  { si: 8, employee: 'Scarlet Melvin Reese Rogers', inTime: '17:36', points: 0, date: '2025-10-25' },
  { si: 9, employee: 'Maisha Lucy Zamora Gonzales', inTime: '17:28', points: 0, date: '2025-10-25' },
];

export default function AttendancePointsPage() {
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
                  <TableHead>SI</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>In time</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceData.map((row) => (
                  <TableRow key={row.si}>
                    <TableCell>{row.si}</TableCell>
                    <TableCell>{row.employee}</TableCell>
                    <TableCell>{row.inTime}</TableCell>
                    <TableCell>{row.points}</TableCell>
                    <TableCell>{row.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
