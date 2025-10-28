
type CcAccount = {
  bank: string;
  name: string;
  no: string;
  opening: number;
  cr: number;
  dr: number;
  balance: number;
  interest?: number;
}

type SavingsAccount = {
  bank: string;
  name: string;
  no: string;
  opening: number;
  cr: number;
  dr: number;
  balance: number;
}

export const initialCcAccounts: CcAccount[] = [
  {
    bank: 'United Commercial Bank PLC',
    name: 'M/S SETU FILLING STATION',
    no: '0192710000000513',
    opening: -19874469.97,
    cr: 118986574.00,
    dr: 119748193.44,
    balance: -20636089.41
  }
];

export const initialSavingsAccounts: SavingsAccount[] = [
  // Add initial savings accounts here if needed
];
