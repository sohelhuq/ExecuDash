
export type CcAccount = {
  id?: string;
  bank: string;
  name: string;
  no: string;
  opening: number;
  cr: number;
  dr: number;
  balance: number;
  interest?: number;
};

export type SavingsAccount = {
  id?: string;
  bank: string;
  name: string;
  no: string;
  opening: number;
  cr: number;
  dr: number;
  balance: number;
};

export type BankDeposit = {
  id?: string;
  amount: number;
  date: string;
  reference: string;
};

export const initialCcAccounts: Omit<CcAccount, 'id' | 'balance'>[] = [
  {
    bank: 'United Commercial Bank PLC',
    name: 'M/S SETU FILLING STATION',
    no: '0192710000000513',
    opening: -19874469.97,
    cr: 118986574.00,
    dr: 119748193.44,
    interest: 9.5
  }
];

export const initialSavingsAccounts: Omit<SavingsAccount, 'id' | 'balance'>[] = [
    { bank: "EBL", name: "Operational Savings", no: "S-54321", opening: 150000, cr: 400000, dr: 350000 },
    { bank: "Standard Chartered", name: "Emergency Fund", no: "S-09876", opening: 250000, cr: 100000, dr: 50000 },
];
