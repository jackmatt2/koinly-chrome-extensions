import React, { useEffect, useState } from "react";

type StorageKey = "transactions" | "cacheTime" | "session" | "csvSelections";

export default <T>(
  storageKey: StorageKey,
  defaultValue: T
): [v: T, s: (v: T) => void] => {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    chrome.storage.sync.get([storageKey], (result) => {
      console.log("Value currently is " + result.key);
      setValue(result[storageKey]);
    });
  }, []);

  const setter = React.useCallback(async (newValue: T) => {
    await chrome.storage.sync.set({
      [storageKey]: newValue,
    });
    setValue(newValue);
  }, []);

  return [value ?? defaultValue, setter];
};
