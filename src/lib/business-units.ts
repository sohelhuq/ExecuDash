import { DollarSign, Banknote, Landmark, TrendingUp, Archive, Package, UserPlus, Fuel, Pill, PackageCheck, FileText, ShoppingCart, Factory } from 'lucide-react';
import { type BusinessUnit } from './business-units-types';


export const businessUnits: BusinessUnit[] = [
  {
    id: 'setu-filling-station',
    name: 'Setu Filling Station',
    description: 'Retail fuel and convenience store.',
    kpis: [
      { title: 'Total Sales', value: '৳1,850,000', change: '+15.2%', icon: 'Fuel' },
      { title: 'Net Profit', value: '৳450,000', change: '+12.8%', icon: 'Banknote' },
      { title: 'Transactions', value: '5,800', change: '+18.1%', icon: 'Landmark' },
      { title: 'Avg. Transaction', value: '৳319', change: '-1.5%', icon: 'TrendingUp' },
    ],
    timeSeriesData: [
      { month: 'Jan', revenue: 1600000, profit: 400000 },
      { month: 'Feb', revenue: 1650000, profit: 420000 },
      { month: 'Mar', revenue: 1700000, profit: 440000 },
      { month: 'Apr', revenue: 1720000, profit: 430000 },
      { month: 'May', revenue: 1850000, profit: 450000 },
      { month: 'Jun', revenue: 1880000, profit: 460000 },
    ],
    transactions: [
      { id: 'txn1', date: '2024-06-28', description: 'Fuel Sale (HSD)', amount: 5000, type: 'income' },
      { id: 'txn2', date: '2024-06-28', description: 'CNG Sale', amount: 1500, type: 'income' },
      { id: 'txn3', date: '2024-06-28', description: 'Inventory Restock', amount: -250000, type: 'expense' },
      { id: 'txn4', date: '2024-06-27', description: 'LPG Cylinder Sale', amount: 2200, type: 'income' },
    ],
    fuelSector: {
      products: [
        { name: 'HSD', purchase: 15000000, sale: 5330520, stockPercentage: 55 },
        { name: 'MS', purchase: 45000000, sale: 8325250, stockPercentage: 15 },
        { name: 'KML', purchase: 1200000, sale: 545300, stockPercentage: 70 },
      ]
    },
    cngSector: {
      products: [
        { name: 'CNG', purchase: 5000000, sale: 1250000, stockPercentage: 80 },
      ]
    },
    lpgSector: {
      products: [
        { name: '12kg Cylinder', purchase: 2500000, sale: 800000, stockPercentage: 60 },
        { name: '35kg Cylinder', purchase: 1500000, sale: 450000, stockPercentage: 45 },
      ]
    }
  },
  {
    id: 'setu-feed-mills',
    name: 'Setu Feed Mills',
    description: 'Animal feed production and sales.',
    kpis: [
      { title: 'Feed Sales', value: '৳850,000', change: '+12.1%', icon: 'Archive' },
      { title: 'Net Profit', value: '৳210,000', change: '+5.5%', icon: 'Banknote' },
      { title: 'Production Volume', value: '500 tons', change: '+10%', icon: 'Landmark' },
      { title: 'Avg. Order Size', value: '5 tons', change: '+2.0%', icon: 'TrendingUp' },
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
        { title: 'Brick Sales', value: '৳2,500,000', change: '+25.0%', icon: 'Package' },
        { title: 'Net Profit', value: '৳750,000', change: '+30.2%', icon: 'Banknote' },
        { title: 'Production Volume (Bricks)', value: '500,000', change: '+10.0%', icon: 'Landmark' },
        { title: 'Orders Fulfilled', value: '150', change: '+20.0%', icon: 'TrendingUp' },
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
        { title: 'Service Sales Invoice', value: '৳2,62,000', change: '+12%', icon: 'FileText' },
        { title: 'Credited Amount', value: '৳1,50,000', change: '+8%', icon: 'PackageCheck' },
        { title: 'POP Fund', value: '৳5,00,000', change: '', icon: 'ShoppingCart' },
        { title: 'Cash On Hand', value: '৳1,12,000', change: '-5%', icon: 'Banknote' },
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
  {
    id: 'hotel-midway',
    name: 'Hotel Midway',
    description: 'Boutique hotel and restaurant.',
    kpis: [
      { title: 'Total Revenue', value: '৳850,000', change: '+8.1%', icon: 'DollarSign' },
      { title: 'Net Profit', value: '৳210,000', change: '+5.5%', icon: 'Banknote' },
      { title: 'Occupancy Rate', value: '85%', change: '+4.0%', icon: 'Landmark' },
      { title: 'Avg. Daily Rate', value: '৳4,500', change: '+1.2%', icon: 'TrendingUp' },
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
    {
    id: 'hridoy-tara-pharmacy',
    name: 'Hridoy Tara Pharmacy',
    description: 'Retail pharmacy providing prescription and over-the-counter medications.',
    kpis: [
      { title: 'Total Sales', value: '৳950,000', change: '+11.5%', icon: 'DollarSign' },
      { title: 'Gross Profit', value: '৳380,000', change: '+9.8%', icon: 'Banknote' },
      { title: 'Inventory Value', value: '৳1,500,000', change: '-2.1%', icon: 'Archive' },
      { title: 'Prescriptions Filled', value: '1,800', change: '+20%', icon: 'FileText' },
    ],
    timeSeriesData: [
      { month: 'Jan', revenue: 880000, profit: 340000 },
      { month: 'Feb', revenue: 900000, profit: 350000 },
      { month: 'Mar', revenue: 920000, profit: 360000 },
      { month: 'Apr', revenue: 910000, profit: 355000 },
      { month: 'May', revenue: 950000, profit: 380000 },
      { month: 'Jun', revenue: 980000, profit: 390000 },
    ],
    transactions: [
      { id: 'txn1', date: '2024-06-28', description: 'Prescription Sale', amount: 1200, type: 'income' },
      { id: 'txn2', date: '2024-06-28', description: 'Supplier Payment: Beximco', amount: -200000, type: 'expense' },
      { id: 'txn3', date: '2024-06-27', description: 'OTC Sale', amount: 550, type: 'income' },
      { id: 'txn4', date: '2024-06-27', description: 'Utility Bill: Electricity', amount: -15000, type: 'expense' },
    ],
  },
];

export const allBusinessUnits = businessUnits.map(unit => ({ id: unit.id, name: unit.name }));
