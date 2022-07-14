import React from "react";
import { useChromeStorageLocal, useChromeStorageSync } from "../hooks";
import { KoinlySession, KoinlyTransaction } from "../koinly.types";
import { CSVSelections } from "./types";

interface IAppContextSetters {
  setCacheTime: (t: string | null) => void;
  setTransactions: (t: KoinlyTransaction[]) => void;
  setSession: (t: KoinlySession | null) => void;
  setCSVSelections: (t: CSVSelections) => void;
}

export interface IAppContextValues {
  cacheTime: string | null;
  transactions: KoinlyTransaction[];
  session: KoinlySession | null;
  csvSelections: CSVSelections;
}

type IAppContext = IAppContextSetters & IAppContextValues;

const AppContext = React.createContext<IAppContext>({
  cacheTime: null,
  setCacheTime: () => {},
  transactions: [],
  setTransactions: () => {},
  session: null,
  setSession: () => {},
  csvSelections: {},
  setCSVSelections: () => {},
});

const AppContextProvider: React.FC<React.PropsWithChildren> = (props) => {
  // Local Storage
  const [cacheTime, setCacheTime] = useChromeStorageLocal<string | null>(
    "cacheTime",
    null
  );
  const [transactions, setTransactions] = useChromeStorageLocal<
    KoinlyTransaction[]
  >("transactions", []);

  const [session, setSession] = useChromeStorageLocal<KoinlySession | null>(
    "session",
    null
  );

  // Sync Storage
  const [csvSelections, setCSVSelections] = useChromeStorageSync<CSVSelections>(
    "csvSelections",
    {}
  );

  return (
    <AppContext.Provider
      value={{
        cacheTime,
        setCacheTime,
        transactions,
        setTransactions,
        session,
        setSession,
        csvSelections,
        setCSVSelections,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };
