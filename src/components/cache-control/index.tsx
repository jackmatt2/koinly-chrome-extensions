import {
  Backdrop,
  Badge,
  Button,
  ButtonGroup,
  CircularProgress,
  Divider,
  Stack,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { AppContext } from "../../app-context/app-context";
import { getTabID, injectScripts } from "../../browser/operations";
import { updateToLatest } from "../../storage/operations";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

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
    <Stack spacing={2} divider={<Divider orientation="vertical" flexItem />}>
      <div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <ButtonGroup
          variant="contained"
          aria-label="cache contorl button group"
        >
          <Button
            startIcon={<CloudDownloadIcon />}
            onClick={handleRefreshCache}
            disabled={loading}
          >
            {loading ? "Loading..." : "Populate"}
          </Button>
          <Button
            startIcon={<DeleteForeverIcon />}
            variant="outlined"
            color="error"
            onClick={handleClearCache}
          >
            Clear
          </Button>
        </ButtonGroup>

        <div>
          <small>
            Last Refreshed:{" "}
            {cacheTime ? `${new Date(cacheTime).toLocaleString()}` : "Never"}
          </small>

          <Badge
            color="success"
            max={99999}
            badgeContent={transactions.length}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <SwapHorizIcon />
          </Badge>
        </div>
      </div>
    </Stack>
  );
}

export default CacheControl;
