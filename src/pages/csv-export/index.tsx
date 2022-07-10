import React, { useContext } from "react";
import { AppContext, IAppContextValues } from "../../app-context/app-context";
import { CSVSelections } from "../../app-context/types";
import { toCSVFile as downloadCSVFile } from "../../export/csv/csv";

function CSVExport() {
  const { transactions, session, setCSVSelections, csvSelections } =
    useContext(AppContext);

  const handleDownloadCSV = async () => {
    if (!transactions || !session) {
      alert("You need to populate the cache first!");
      return;
    }

    downloadCSVFile(transactions, csvSelections);
  };

  return (
    <div className="column">
      <div className="row">
        <button
          className="btn default fill"
          onClick={handleDownloadCSV}
          disabled={transactions === undefined}
        >
          Export to CSV
        </button>
      </div>
      {csvSelections && (
        <CSVColumns
          selections={csvSelections}
          setCSVSelections={setCSVSelections}
        />
      )}
    </div>
  );
}

const CSVColumns: React.FC<{
  selections: IAppContextValues["csvSelections"];
  setCSVSelections: (c: CSVSelections) => void;
}> = ({ selections, setCSVSelections }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    selections[event.target.value] = event.target.checked;
    setCSVSelections({ ...selections });
  };

  return (
    <div className="column">
      {Object.keys(selections).map((path) => (
        <div className="row" key={path}>
          <div>{path}</div>
          <div>
            <input
              type="checkbox"
              value={path}
              checked={selections[path]}
              onChange={handleChange}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CSVExport;
