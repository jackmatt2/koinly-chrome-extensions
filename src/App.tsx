import { useEffect, useState } from 'react';
import './App.css';
import { injectScripts, queryIsKoinlyWebsite } from './browser/operations';
import CSVExport from './pages/csv-export';

function App() {
  const [isKoinlyWebsite, setKoinlyWebsite] = useState(false)

  useEffect(() => {
    const run = async () => {
      if (await queryIsKoinlyWebsite()) {
        await injectScripts();
        setKoinlyWebsite(true)
      }
    }
    run();
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <h2>Koinly Extensions</h2>

        {!isKoinlyWebsite && (
          <div>
            Please login to <a href='https://app.koinly.io' target="_blank">Koinly</a>
          </div>
        )}

        {isKoinlyWebsite && (
          <CSVExport />
        )}

      </header>
    </div>
  );
}

export default App;
