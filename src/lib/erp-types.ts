export type RawMaterial = {
  id: string;
  name: string;
  name_bn: string;
  stockLevel: number;
  unit: string;
  reorderLevel: number;
  unitPrice: number;
};

export type ProductionBatch = {
  id: string;
  date: string;
  totalBricks: number;
  wastage: number; // ঝামা
  status: 'In Kiln' | 'Completed';
};

export type FinishedGood = {
  id: string;
  grade: 'No. 1 Brick' | 'Picket' | 'Jhama';
  grade_bn: 'নং ১ ইট' | 'পিকেট' | 'ঝামা';
  stock: number;
  price: number;
};
