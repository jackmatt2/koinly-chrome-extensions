import { useEffect, useState } from "react";
import { queryIsKoinlyWebsite } from "./browser/operations";
import CSVExport from "./features/csv-export";
import CacheControl from "./components/cache-control";
import { Box, Container, Paper, Typography } from "@mui/material";

import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

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
    <Container>
      <h1>Koinly Extensions</h1>

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
          <BasicTabs />
        </>
      )}
    </Container>
  );
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `feature-tab-${index}`,
    "aria-controls": `feature-tabpanel-${index}`,
  };
}

const BasicTabs = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="CSV Export" {...a11yProps(0)} />
          <Tab label="Wallet Aliases" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <CSVExport />
      </TabPanel>
      <TabPanel value={value} index={1}>
        Coming Soon!
      </TabPanel>
    </Box>
  );
};

export default App;
