export type Balance = {
  current: number;
  income: number;
  expenses: number;
};

export type Pot = {
  name: string;
  target: number;
  total: number;
  theme: string;
};

export type Transaction = {
  avatar: string;
  name: string;
  category: string;
  date: string;
  amount: number;
  recurring: boolean;
};

export type Budget = {
  category: string;
  maximum: number;
  spent: number;
  theme: string;
};

export type RecurringBill = Transaction & { recurring: true };

export type FinanceData = {
  balance: Balance;
  pots: Pot[];
  transactions: Transaction[];
  budgets: Budget[];
  recurringBills: {
    paid: RecurringBill[];
    upcoming: RecurringBill[];
    dueSoon: RecurringBill[];
  };
};
