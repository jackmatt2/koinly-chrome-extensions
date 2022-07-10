import { KoinlySession, KoinlyTransaction } from "../koinly.types";

export const getTabID = async (): Promise<number | undefined> => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab?.id;
};

export const queryIsKoinlyWebsite = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true }, (tab) => {
      console.log(tab[0].url);
      resolve(tab[0].url?.startsWith("https://app.koinly.io") ?? false);
    });
  });
};

export const injectScripts = async (): Promise<boolean> => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return new Promise((resolve) => {
    if (tab.id) {
      chrome.scripting
        .executeScript({
          target: { tabId: tab.id },
          files: ["injection/functions.js"],
        })
        .finally(() => {
          resolve(true);
        });
    }
  });
};

export const getKoinlySession = async (
  tabId: number
): Promise<KoinlySession> => {
  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript(
      {
        target: { tabId },
        func: () => {
          return window.KoinlyExtensions.fetchSession();
        },
      },
      (result) => {
        const session = result[0].result;
        if (typeof session === "object") {
          resolve(session);
        } else {
          console.error("Err: Not an object", session);
          reject("Failed to retrieve Koinly Sessions");
        }
      }
    );
  });
};

export const getKoinlyTransactions = async (
  tabId: number
): Promise<KoinlyTransaction[]> => {
  return new Promise<KoinlyTransaction[]>((resolve, reject) => {
    chrome.scripting.executeScript(
      {
        target: { tabId },
        func: () => {
          return window.KoinlyExtensions.getAllTransactions();
        },
      },
      (result) => {
        const transactions = result[0].result;
        if (Array.isArray(transactions)) {
          resolve(transactions);
        } else {
          console.error("Err: Not an array", transactions);
          reject("Failed to retrieve Koinly Transactions");
        }
      }
    );
  });
};
