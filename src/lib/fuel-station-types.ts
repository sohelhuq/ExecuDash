export type DailyEntry = {
  id: string;
  date: string; // ISO string
  shift: 'morning' | 'day' | 'night';
  
  petrolOpening: number;
  petrolClosing: number;
  dieselOpening: number;
  dieselClosing: number;
  octaneSalesLiters?: number;
  lubricantSalesAmount?: number;
  
  cashSales: number;
  cardSales: number;
  creditSales?: number;
  creditCollection?: number;
  totalSales: number; // Auto-calculated
  
  fuelPurchase: number;
  staffSalary?: number;
  utilityBills?: number;
  maintenance?: number;
};
