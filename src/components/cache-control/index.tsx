import React, { useContext, useState } from "react";
import { AppContext } from "../../app-context/app-context";
import { getTabID, injectScripts } from "../../browser/operations";
import { updateToLatest } from "../../storage/operations";

function CacheControl() {
  const [loading, setLoading] = useState(false);
  const {
    setCacheTime,
    cacheTime,
    setTransactions,
    transactions,
    setSession,
    setCSVSelections,
    csvSelections,
  } = useContext(AppContext);

  const handleRefreshCache = async () => {
    chrome.permissions.request(
      {
        permissions: ["scripting"],
      },
      async (granted) => {
        if (granted) {
          try {
            setLoading(true);
            await injectScripts();
            const tabId = await getTabID();
            if (tabId) {
              const data = await updateToLatest(tabId, csvSelections);
              setCacheTime(data?.cacheTime);
              setCSVSelections(data?.csvSelections);
              setSession(data?.session);
              setTransactions(data?.transactions);
            }
          } finally {
            chrome.permissions.remove({
              permissions: ["scripting"],
            });
            setLoading(false);
          }
        } else {
          alert(
            "We require scripting permission to dowload your transaction history"
          );
          setLoading(false);
        }
      }
    );
  };

  const handleClearCache = async () => {
    await setCacheTime(null);
    await setTransactions([]);
    await setSession(null);
  };

  return (
    <div className="column">
      <div className="row">
        <button
          className="btn default"
          style={{ width: "100%" }}
          onClick={handleRefreshCache}
          disabled={loading}
        >
          {loading ? "Loading..." : "Populate"}
        </button>
        <button
          className="btn danger"
          style={{ width: "100%" }}
          onClick={handleClearCache}
        >
          Clear
        </button>
      </div>
      <div>
        <small>
          Last Refreshed:{" "}
          {cacheTime
            ? `${new Date(cacheTime).toLocaleString()} (${
                transactions.length
              } transactions)`
            : "Never"}
        </small>
      </div>
      <div>
        <hr className="fill" />
      </div>
    </div>
  );
}

export default CacheControl;
