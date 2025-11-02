
'use client';
import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
    Coins, 
    Boxes, 
    Users, 
    PackagePlus, 
    ClipboardList, 
    HandCoins,
    FileText,
    Settings,
    UserCog,
    LogOut,
    type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/icons/logo';

type PosAction = {
    title: string;
    icon: LucideIcon;
    href: string;
    variant: 'primary' | 'secondary';
};

const mainActions: PosAction[] = [
    { title: 'Cash Register', icon: Coins, href: '#', variant: 'primary' },
    { title: 'Product File', icon: Boxes, href: '/pharmacy/products', variant: 'primary' },
    { title: 'Customer File', icon: Users, href: '#', variant: 'primary' },
    { title: 'Receive Products', icon: PackagePlus, href: '#', variant: 'primary' },
    { title: 'Order Products', icon: ClipboardList, href: '#', variant: 'primary' },
    { title: 'Cash Out', icon: HandCoins, href: '#', variant: 'primary' },
];

const secondaryActions: PosAction[] = [
    { title: 'Reports', icon: FileText, href: '/reports', variant: 'secondary' },
    { title: 'Employees', icon: UserCog, href: '/employee', variant: 'secondary' },
    { title: 'Settings', icon: Settings, href: '/settings', variant: 'secondary' },
];

const ActionButton = ({ action }: { action: PosAction }) => {
    const Icon = action.icon;
    return (
        <Button 
            asChild
            variant={action.variant === 'primary' ? 'default' : 'ghost'} 
            className={cn(
                'flex flex-col items-center justify-center h-full w-full aspect-square p-4 rounded-lg shadow-md transition-transform transform hover:scale-105',
                action.variant === 'primary' && 'bg-blue-600 hover:bg-blue-700 text-white',
                action.variant === 'secondary' && 'text-gray-300 hover:bg-gray-700'
            )}
        >
            <Link href={action.href}>
                <Icon className={cn('h-10 w-10 mb-2', action.variant === 'secondary' && 'h-6 w-6')} />
                <span className={cn('text-lg font-semibold text-center', action.variant === 'secondary' && 'text-sm')}>
                    {action.title}
                </span>
            </Link>
        </Button>
    )
}

export default function PharmacyPosPage() {
    return (
        <div className="bg-gray-800 text-white min-h-screen flex flex-col p-4">
            <header className="flex justify-between items-center pb-4 border-b border-gray-700">
                <div className="flex items-center gap-4">
                    <Logo className="h-10 w-10" />
                    <div>
                        <h1 className="text-2xl font-bold text-white">Finestra Health Centre</h1>
                        <p className="text-sm text-gray-400">Powered by ExecuDash POS</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon"><LogOut className="h-5 w-5" /></Button>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center py-6">
                <div className="w-full max-w-4xl">
                     <div className="grid grid-cols-3 gap-4">
                        {mainActions.map(action => (
                            <ActionButton key={action.title} action={action} />
                        ))}
                    </div>
                    <div className="grid grid-cols-6 gap-2 mt-4 pt-4 border-t border-gray-700">
                        {secondaryActions.map(action => (
                            <ActionButton key={action.title} action={action} />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

    