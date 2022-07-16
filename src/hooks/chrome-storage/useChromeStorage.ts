import React, { useEffect, useState } from "react";

type StorageKey = "transactions" | "cacheTime" | "session" | "csvSelections";
type StorageArea = "session" | "local" | "sync" | "managed";

const useChromeStorage = <T>(
  storageKey: StorageKey,
  defaultValue: T,
  storageArea: StorageArea
): [vlue: T, setValue: (v: T) => void, persistent: boolean, error: string] => {
  const [value, setValue] = useState<T>(defaultValue);
  const [isPersistent, setIsPersistent] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    chrome.storage[storageArea].get([storageKey], (result) => {
      console.log(`initial: setting ${storageKey}=`, result[storageKey]);
      if (result[storageKey]) {
        setValue(result[storageKey]);
      }
    });
  }, [setValue, storageKey]);

  // Keep state in sync with actual underlying storage
  useEffect(() => {
    const onChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: StorageArea
    ) => {
      if (areaName === storageArea && storageKey in changes) {
        setValue(changes[storageKey].newValue);
        setIsPersistent(true);
        setError("");
      }
    };
    chrome.storage.onChanged.addListener(onChange);
    return () => {
      chrome.storage.onChanged.removeListener(onChange);
    };
  }, [storageKey]);

  const setter = React.useCallback(
    async (newValue: T) => {
      await chrome.storage[storageArea].set({
        [storageKey]: newValue,
      });
      setValue(newValue);
    },
    [setValue, storageKey]
  );

  return [value, setter, isPersistent, error];
};

export const useChromeStorageLocal = <T>(
  storageKey: StorageKey,
  defaultValue: T
) => useChromeStorage<T>(storageKey, defaultValue, "local");

export const useChromeStorageSync = <T>(
  storageKey: StorageKey,
  defaultValue: T
) => useChromeStorage<T>(storageKey, defaultValue, "sync");
