import React, { useContext, useState } from 'react';
import { AppContext, IAppContextValues } from '../../app-context/app-context';
import { CSVSelections } from '../../app-context/types';
import { getTabID, injectScripts } from '../../browser/operations';
import { toCSVFile as downloadCSVFile } from '../../export/csv/csv';
import { updateToLatest } from '../../storage/operations';

function CSVExport() {
  const [loading, setLoading] = useState(false)
  const {
    setCacheTime,
    cacheTime,
    setTransactions,
    transactions,
    setSession,
    session,
    setCSVSelections,
    csvSelections,
  } = useContext(AppContext)

  const handleDownloadCSV = async () => {
    if (!transactions || !session) {
      alert('You need to populate the cache first!')
      return;
    }

    downloadCSVFile(transactions, csvSelections)
  };

  const handleRefreshCache = async () => {
    chrome.permissions.request({
      permissions: ['scripting']
    }, async (granted) => {
      if (granted) {
        try {
          setLoading(true);
          await injectScripts();
          const tabId = await getTabID()
          if (tabId) {
            const data = await updateToLatest(tabId, csvSelections);
            setCacheTime(data?.cacheTime)
            setCSVSelections(data?.csvSelections)
            setSession(data?.session)
            setTransactions(data?.transactions)
          }
        } finally {
          chrome.permissions.remove({
            permissions: ['scripting'],
          })
          setLoading(false);
        }
      } else {
        alert('We require scripting permission to dowload your transaction history');
        setLoading(false);
      }
    });
  }

  const handleClearCache = async () => {
    await setCacheTime(undefined);
    await setTransactions([]);
    await setSession(undefined);
  }

  return (
    <div className='column'>
        <div className='row'>
            <button className='btn default' style={{width: '100%'}} onClick={handleRefreshCache} disabled={loading}>{loading ? 'Loading...' : 'Populate'}</button>
            <button className='btn danger' style={{width: '100%'}} onClick={handleClearCache}>Clear</button>
        </div>
        <div>
            <small>Last Refreshed: {cacheTime ? new Date(cacheTime).toLocaleString() : 'Never'}</small>
        </div>
        <div>
            <hr className='fill' />
        </div>
        <div className='row'>
            <button className='btn default fill' onClick={handleDownloadCSV} disabled={transactions === undefined}>Export to CSV</button>
        </div>
        {csvSelections && <CSVColumns selections={csvSelections} setCSVSelections={setCSVSelections} />}
    </div>
  );
}

const CSVColumns: React.FC<{ selections: IAppContextValues["csvSelections"], setCSVSelections: (c: CSVSelections) => void }> 
  = ({ selections, setCSVSelections }) => {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    selections[event.target.value] = event.target.checked
    setCSVSelections({...selections})
  }

  return (
    <div className='column'>
      {Object.keys(selections).map(path => (
        <div className='row' key={path}>
          <div>{path}</div>
          <div>
            <input type="checkbox" value={path} checked={selections[path]} onChange={handleChange} />
          </div>
        </div>)
      )}
    </div>
  )
}

export default CSVExport;
