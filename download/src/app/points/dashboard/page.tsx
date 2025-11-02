'use client';
import * as React from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, Timestamp, writeBatch, doc } from 'firebase/firestore';
import { format } from 'date-fns';

type AttendancePoint = {
    id: string;
    employeeName: string;
    inTime: string;
    points: number;
    date: Timestamp;
};

const seedData: Omit<AttendancePoint, 'id' | 'date'>[] = [
    { employeeName: 'Mr. Rahim', inTime: '08:55', points: 10 },
    { employeeName: 'Ms. Fatima', inTime: '09:05', points: 5 },
    { employeeName: 'Mr. Karim', inTime: '08:45', points: 10 },
    { employeeName: 'Ms. Anika', inTime: '09:10', points: 0 },
    { employeeName: 'Mr. Zaman', inTime: '09:00', points: 10 },
];

export default function AttendancePointDashboard() {
    const { user } = useUser();
    const firestore = useFirestore();

    const attendancePointsRef = useMemoFirebase(() => user ? collection(firestore, `users/${user.uid}/attendance_points`) : null, [user, firestore]);
    const { data: attendancePoints, isLoading } = useCollection<Omit<AttendancePoint, 'id'>>(attendancePointsRef);
    
    React.useEffect(() => {
        if (user && firestore && attendancePoints?.length === 0) {
            const batch = writeBatch(firestore);
            seedData.forEach(item => {
                const newDocRef = doc(attendancePointsRef!);
                batch.set(newDocRef, { ...item, date: Timestamp.now() });
            });
            batch.commit().catch(console.error);
        }
    }, [user, firestore, attendancePoints, attendancePointsRef]);

    return (
        <AppShell>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Attendance Point Dashboard</h1>
                    <p className="text-muted-foreground">Review and manage points awarded for employee attendance.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Attendance Records</CardTitle>
                        <CardDescription>A log of points awarded based on arrival time.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search by employee name..." className="pl-9" />
                            </div>
                            <Button variant="outline">Filter</Button>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee Name</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>In Time</TableHead>
                                    <TableHead className="text-right">Points</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading && <TableRow><TableCell colSpan={4} className="text-center">Loading data...</TableCell></TableRow>}
                                {attendancePoints?.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.employeeName}</TableCell>
                                        <TableCell>{format(item.date.toDate(), 'PPP')}</TableCell>
                                        <TableCell>{item.inTime}</TableCell>
                                        <TableCell className="text-right font-bold">{item.points}</TableCell>
                                    </TableRow>
                                ))}
                                {!isLoading && attendancePoints?.length === 0 && <TableRow><TableCell colSpan={4} className="text-center">No attendance data found.</TableCell></TableRow>}
                            </TableBody>
                        </Table>
                        <div className="flex items-center justify-between mt-4">
                            <span className="text-sm text-muted-foreground">Showing 1 to {attendancePoints?.length || 0} of {attendancePoints?.length || 0} entries</span>
                            <div className="flex items-center gap-2">
                                <Select defaultValue="10">
                                    <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10">10 / page</SelectItem>
                                        <SelectItem value="20">20 / page</SelectItem>
                                        <SelectItem value="50">50 / page</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
                                <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
