import { useEffect, useState } from "react";
import "./App.css";
import { queryIsKoinlyWebsite } from "./browser/operations";
import { Tab, Tabs } from "./components/tabs/tabs";
import CSVExport from "./pages/csv-export";
import CacheControl from "./components/cache-control";

function App() {
  const [isKoinlyWebsite, setKoinlyWebsite] = useState(false);

  useEffect(() => {
    const run = async () => {
      if (await queryIsKoinlyWebsite()) {
        setKoinlyWebsite(true);
      }
    };
    run();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h2>Koinly Extensions</h2>

        {!isKoinlyWebsite && (
          <div>
            Please login to{" "}
            <a href="https://app.koinly.io" target="_blank" rel="noreferrer">
              Koinly
            </a>
          </div>
        )}

        {isKoinlyWebsite && (
          <>
            <CacheControl />
            <Tabs>
              <Tab title="CSV Export">
                <CSVExport />
              </Tab>
              <Tab title="Wallet Aliases">Coming Soon!</Tab>
            </Tabs>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
