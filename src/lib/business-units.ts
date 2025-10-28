import { DollarSign, Banknote, Landmark, TrendingUp, Archive, Package, UserPlus, Fuel } from 'lucide-react';

export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
};

export type TimeSeriesDataPoint = {
  month: string;
  revenue: number;
  profit: number;
};

export type BusinessUnit = {
  id: string;
  name: string;
  description: string;
  kpis: {
    title: string;
    value: string;
    change: string;
    icon: React.ElementType;
  }[];
  timeSeriesData: TimeSeriesDataPoint[];
  transactions: Transaction[];
};

export const businessUnits: BusinessUnit[] = [
  {
    id: 'setu-filling-station',
    name: 'Setu Filling Station',
    description: 'Retail fuel and convenience store.',
    kpis: [
      { title: 'Fuel Sales', value: '৳1,250,000', change: '+15.2%', icon: Fuel },
      { title: 'Net Profit', value: '৳350,000', change: '+12.8%', icon: Banknote },
      { title: 'Transactions', value: '4,200', change: '+18.1%', icon: Landmark },
      { title: 'Avg. Transaction', value: '৳297', change: '-2.5%', icon: TrendingUp },
    ],
    timeSeriesData: [
      { month: 'Jan', revenue: 1100000, profit: 300000 },
      { month: 'Feb', revenue: 1150000, profit: 320000 },
      { month: 'Mar', revenue: 1200000, profit: 340000 },
      { month: 'Apr', revenue: 1220000, profit: 330000 },
      { month: 'May', revenue: 1250000, profit: 350000 },
      { month: 'Jun', revenue: 1280000, profit: 360000 },
    ],
    transactions: [
      { id: 'txn1', date: '2024-06-28', description: 'Fuel Sale', amount: 5000, type: 'income' },
      { id: 'txn2', date: '2024-06-28', description: 'Inventory Restock', amount: -150000, type: 'expense' },
      { id: 'txn3', date: '2024-06-27', description: 'Fuel Sale', amount: 7500, type: 'income' },
    ],
  },
  {
    id: 'setu-feed-mills',
    name: 'Setu Feed Mills',
    description: 'Animal feed production and sales.',
    kpis: [
      { title: 'Feed Sales', value: '৳850,000', change: '+12.1%', icon: Archive },
      { title: 'Net Profit', value: '৳210,000', change: '+5.5%', icon: Banknote },
      { title: 'Production Volume', value: '500 tons', change: '+10%', icon: Landmark },
      { title: 'Avg. Order Size', value: '5 tons', change: '+2.0%', icon: TrendingUp },
    ],
    timeSeriesData: [
        { month: 'Jan', revenue: 780000, profit: 190000 },
        { month: 'Feb', revenue: 800000, profit: 200000 },
        { month: 'Mar', revenue: 820000, profit: 205000 },
        { month: 'Apr', revenue: 830000, profit: 208000 },
        { month: 'May', revenue: 850000, profit: 210000 },
        { month: 'Jun', revenue: 870000, profit: 215000 },
    ],
    transactions: [
      { id: 'txn1', date: '2024-06-28', description: 'Bulk Feed Order', amount: 42500, type: 'income' },
      { id: 'txn2', date: '2024-06-28', description: 'Raw Material Purchase', amount: -250000, type: 'expense' },
      { id: 'txn3', date: '2024-06-27', description: 'Retail Sale', amount: 12000, type: 'income' },
    ],
  },
    {
    id: 'huq-bricks',
    name: 'Huq Bricks',
    description: 'Brick manufacturing and supply.',
    kpis: [
        { title: 'Brick Sales', value: '৳2,500,000', change: '+25.0%', icon: Package },
        { title: 'Net Profit', value: '৳750,000', change: '+30.2%', icon: Banknote },
        { title: 'Production Volume (Bricks)', value: '500,000', change: '+10.0%', icon: Landmark },
        { title: 'Orders Fulfilled', value: '150', change: '+20.0%', icon: TrendingUp },
    ],
    timeSeriesData: [
        { month: 'Jan', revenue: 1800000, profit: 500000 },
        { month: 'Feb', revenue: 2000000, profit: 600000 },
        { month: 'Mar', revenue: 2200000, profit: 650000 },
        { month: 'Apr', revenue: 2100000, profit: 620000 },
        { month: 'May', revenue: 2500000, profit: 750000 },
        { month: 'Jun', revenue: 2600000, profit: 780000 },
    ],
    transactions: [
        { id: 'txn1', date: '2024-06-28', description: 'Bulk Order', amount: 250000, type: 'income' },
        { id: 'txn2', date: '2024-06-26', description: 'Raw Material Purchase', amount: -500000, type: 'expense' },
        { id: 'txn3', date: '2024-06-25', description: 'Transport Logistics', amount: -75000, type: 'expense' },
    ],
  },
  {
    id: 'setu-tech',
    name: 'Setu Tech',
    description: 'IT services and consulting.',
    kpis: [
        { title: 'Tech Subscribers', value: '1,200', change: '+50', icon: UserPlus },
        { title: 'Net Profit', value: '৳150,000', change: '-1.5%', icon: Banknote },
        { title: 'Active Projects', value: '12', change: '+1', icon: Landmark },
        { title: 'Client Satisfaction', value: '4.8/5', change: '+0.1', icon: TrendingUp },
    ],
    timeSeriesData: [
        { month: 'Jan', revenue: 480000, profit: 140000 },
        { month: 'Feb', revenue: 490000, profit: 145000 },
        { month: 'Mar', revenue: 495000, profit: 155000 },
        { month: 'Apr', revenue: 500000, profit: 152000 },
        { month: 'May', revenue: 500000, profit: 150000 },
        { month: 'Jun', revenue: 510000, profit: 155000 },
    ],
    transactions: [
        { id: 'txn1', date: '2024-06-25', description: 'Project Milestone Payment', amount: 75000, type: 'income' },
        { id: 'txn2', date: '2024-06-20', description: 'Software Licensing', amount: -50000, type: 'expense' },
        { id: 'txn3', date: '2024-06-15', description: 'New Retainer Signed', amount: 150000, type: 'income' },
    ],
  },
  // Add other business units here...
  {
    id: 'hotel-midway',
    name: 'Hotel Midway',
    description: 'Boutique hotel and restaurant.',
    kpis: [
      { title: 'Total Revenue', value: '৳850,000', change: '+8.1%', icon: DollarSign },
      { title: 'Net Profit', value: '৳210,000', change: '+5.5%', icon: Banknote },
      { title: 'Occupancy Rate', value: '85%', change: '+4.0%', icon: Landmark },
      { title: 'Avg. Daily Rate', value: '৳4,500', change: '+1.2%', icon: TrendingUp },
    ],
    timeSeriesData: [
        { month: 'Jan', revenue: 780000, profit: 190000 },
        { month: 'Feb', revenue: 800000, profit: 200000 },
        { month: 'Mar', revenue: 820000, profit: 205000 },
        { month: 'Apr', revenue: 830000, profit: 208000 },
        { month: 'May', revenue: 850000, profit: 210000 },
        { month: 'Jun', revenue: 870000, profit: 215000 },
    ],
    transactions: [
      { id: 'txn1', date: '2024-06-28', description: 'Room Booking', amount: 9000, type: 'income' },
      { id: 'txn2', date: '2024-06-28', description: 'Food Supplies', amount: -25000, type: 'expense' },
      { id: 'txn3', date: '2024-06-27', description: 'Restaurant Sales', amount: 12000, type: 'income' },
    ],
  },
];

export const allBusinessUnits = businessUnits.map(unit => ({ id: unit.id, name: unit.name }));
