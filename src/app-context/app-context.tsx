import React from "react";
import useChromeLocalState from "../hooks/useChromeLocalState";
import useChromeSyncState from "../hooks/useChromeSyncState";
import { KoinlySession, KoinlyTransaction } from "../koinly.types";
import { CSVSelections } from "./types";

interface IAppContextSetters {
  setCacheTime: (t?: string) => void;
  setTransactions: (t: KoinlyTransaction[]) => void;
  setSession: (t?: KoinlySession) => void;
  setCSVSelections: (t: CSVSelections) => void;
}

export interface IAppContextValues {
  cacheTime?: string;
  transactions: KoinlyTransaction[];
  session?: KoinlySession;
  csvSelections: CSVSelections;
}

type IAppContext = IAppContextSetters & IAppContextValues;

const AppContext = React.createContext<IAppContext>({
  cacheTime: undefined,
  setCacheTime: () => {},
  transactions: [],
  setTransactions: () => {},
  session: undefined,
  setSession: () => {},
  csvSelections: {},
  setCSVSelections: () => {},
});

const AppContextProvider: React.FC<React.PropsWithChildren> = (props) => {
  // Local Storage
  const [cacheTime, setCacheTime] = useChromeLocalState<string | undefined>(
    "cacheTime",
    undefined
  );
  const [transactions, setTransactions] = useChromeLocalState<
    KoinlyTransaction[]
  >("transactions", []);
  const [session, setSession] = useChromeLocalState<KoinlySession | undefined>(
    "session",
    undefined
  );

  // Sync Storage
  const [csvSelections, setCSVSelections] = useChromeSyncState<CSVSelections>(
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
