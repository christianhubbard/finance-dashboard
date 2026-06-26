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

export type RecurringBillStatus = "paid" | "upcoming" | "dueSoon";

export type RecurringBillWithStatus = RecurringBill & {
  status: RecurringBillStatus;
};

export type RecurringBillsSummary = {
  totalCount: number;
  paidCount: number;
  upcomingCount: number;
  dueSoonCount: number;
  paidTotal: number;
  upcomingTotal: number;
  dueSoonTotal: number;
};

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
