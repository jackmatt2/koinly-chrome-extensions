import { CSVSelections } from "../app-context/types";
import { getKoinlySession, getKoinlyTransactions } from "../browser/operations";
import { toCSVSelections } from "../export/csv/csv-selections";

export const updateToLatest = async (
  tabId: number,
  existingCsvSelections: CSVSelections
) => {
  const session = await getKoinlySession(tabId);
  let transactions = await getKoinlyTransactions(tabId);

  // Include the base currency as part of the Koinly Account
  transactions = transactions.map((it) => ({
    ...it,
    portfolio: {
      base_currency: session.portfolios[0].base_currency,
    },
  }));

  const possibleCsvSelections = toCSVSelections(transactions);
  const csvSelections: CSVSelections = {};
  Object.keys(possibleCsvSelections).forEach((key) => {
    csvSelections[key] = existingCsvSelections[key] ?? false;
  });

  return {
    cacheTime: new Date().toISOString(),
    session,
    transactions,
    csvSelections,
  };
};
