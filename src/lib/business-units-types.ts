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

export type Kpi = {
    title: string;
    value: string;
    change: string;
    icon: string;
};

export type BusinessUnit = {
  id: string;
  name: string;
  description: string;
  kpis: Kpi[];
  timeSeriesData: TimeSeriesDataPoint[];
  transactions: Transaction[];
};
