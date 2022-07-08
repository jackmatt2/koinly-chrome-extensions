export interface KoinlySession {
    portfolios: Array<{
        base_currency: {
            symbol: string
        }
    }>
}

export interface KoinlyTransactions {
    meta: {
        page: {
            total_pages: number;
        }
    }
    transactions: KoinlyTransaction[]
}

export interface KoinlyTransaction {
    date: string,
    from?: {
        amount: number;
        currency: {
            symbol: string;
        }
    }
    to?: {
        amount: number;
        currency: {
            symbol: string;
        }
    }
    fee?: {
        amount: number;
        currency: {
            symbol: string;
        }
    }
    net_value: number;
    baseCurrency: string;
    type: string;
    description: string;
    txhash: string;
}