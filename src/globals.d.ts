import { KoinlySession, KoinlyTransaction } from "./koinly.types"

global {
    interface Window {
        KoinlyExtensions: {
            getAllTransactions: () => KoinlyTransaction[];
            fetchSession: () => KoinlySession;
        }
    }
}