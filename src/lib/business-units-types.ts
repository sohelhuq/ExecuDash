
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

export type FuelProduct = {
    name: string;
    purchase: number;
    sale: number;
    stockPercentage: number;
};

export type CngProduct = {
    name: string;
    purchase: number;
    sale: number;
    stockPercentage: number;
};

export type LpgProduct = {
    name: string;
    purchase: number;
    sale: number;
    stockPercentage: number;
};

export type FuelSector = {
    products: FuelProduct[];
};

export type CngSector = {
    products: CngProduct[];
};

export type LpgSector = {
    products: LpgProduct[];
};

export type BusinessUnit = {
  id: string;
  name: string;
  description: string;
  kpis: Kpi[];
  timeSeriesData: TimeSeriesDataPoint[];
  transactions: Transaction[];
  fuelSector?: FuelSector;
  cngSector?: CngSector;
  lpgSector?: LpgSector;
};

export type MeterReading = {
    id: string;
    product: string;
    nozzle: string;
    reading: number;
    timestamp: any; // Firestore Timestamp
};

    