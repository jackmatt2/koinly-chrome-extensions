export interface KoinlySession {
  portfolios: Array<{
    base_currency: unknown;
  }>;
}

export interface KoinlyPage {
  meta: {
    page: {
      total_pages: number;
    };
  };
}

export interface KoinlyTransactionsPage extends KoinlyPage {
  transactions: KoinlyTransaction[];
}

export interface KoinlyTransaction {
  [key: string]: object | string | number;
}
