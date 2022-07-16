import {
  Button,
  ButtonGroup,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { AppContext, IAppContextValues } from "../../app-context/app-context";
import { CSVSelections } from "../../app-context/types";
import {
  getHeaderFromPath,
  getValueFromPath,
  toCSVFile as downloadCSVFile,
} from "./csv";
import DownloadIcon from "@mui/icons-material/Download";
import SummarizeIcon from "@mui/icons-material/Summarize";
import { KoinlyTransaction } from "../../koinly.types";

const koinlyImportFormatSelections: CSVSelections = {
  date: true,
  "from.amount": true,
  "from.currency.symbol": true,
  "to.amount": true,
  "to.currency.symbol": true,
  "fee.amount": true,
  "fee.currency.symbol": true,
  net_value: true,
  "portfolio.base_currency.symbol": true,
  type: true,
  description: true,
  txhash: true,
};

function CSVExport() {
  const { transactions, session, setCSVSelections, csvSelections } =
    useContext(AppContext);

  const handleDownloadCustom = async () => {
    if (!transactions || !session) {
      return;
    }

    downloadCSVFile(transactions, csvSelections);
  };

  const handleDownloadKoinlyFormat = async () => {
    if (!transactions || !session) {
      return;
    }

    downloadCSVFile(transactions, koinlyImportFormatSelections);
  };

  return (
    <Stack>
      <ButtonGroup aria-label="CSV export button group">
        <Tooltip
          arrow
          title="https://docs.google.com/spreadsheets/d/1dESkilY70aLlo18P3wqXR_PX1svNyAbkYiAk2tBPJng/edit#gid=0"
        >
          <Button
            startIcon={<SummarizeIcon />}
            variant="contained"
            color="success"
            onClick={handleDownloadKoinlyFormat}
            disabled={!transactions.length}
          >
            Koinly CSV
          </Button>
        </Tooltip>
        <Button
          startIcon={<DownloadIcon />}
          variant="outlined"
          color="success"
          onClick={handleDownloadKoinlyFormat}
          disabled={!transactions.length}
        >
          Custom
        </Button>
      </ButtonGroup>
      <CSVColumns
        csvSelections={csvSelections}
        setCSVSelections={setCSVSelections}
      />
    </Stack>
  );
}

const CSVColumns: React.FC<{
  csvSelections: IAppContextValues["csvSelections"];
  setCSVSelections: (c: CSVSelections) => void;
}> = ({ csvSelections, setCSVSelections }) => {
  const [toggleAllState, setToggleAllState] = useState(false);

  // Updated selection toggle based on all items being already selected
  useEffect(() => {
    const notSelected = Object.keys(csvSelections).filter(
      (it) => !csvSelections[it]
    );
    setToggleAllState(notSelected.length === 0);
  }, [csvSelections]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    csvSelections[event.target.value] = event.target.checked;
    setCSVSelections({ ...csvSelections });
  };

  const handleToggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const state = e.target.checked;
    Object.keys(csvSelections).forEach((key) => {
      csvSelections[key] = state;
    });
    setCSVSelections(csvSelections);
    setToggleAllState(state);
  };

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Item</TableCell>
          <TableCell align="right">
            Select All{" "}
            <Checkbox checked={toggleAllState} onChange={handleToggleAll} />
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.keys(csvSelections).map((path) => (
          <TableRow>
            <TableCell>{getHeaderFromPath(path)}</TableCell>
            <TableCell align="right">
              <Checkbox
                value={path}
                checked={csvSelections[path]}
                onChange={handleChange}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CSVExport;
