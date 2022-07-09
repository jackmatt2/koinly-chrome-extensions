export interface KoinlySession {
  portfolios: Array<object>;
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

export interface KoinlyTransaction {}
