import { CSVSelections } from "../../app-context/types";
import { KoinlyTransaction } from "../../koinly.types";

function recursiveKeys(
  obj: object,
  path: string,
  pathMap: Record<string, boolean>
): Record<string, boolean> {
  obj &&
    Object.entries(obj).forEach(([key, val]) => {
      const nested = path + (path ? "." : "") + key;
      if (typeof val === "object") recursiveKeys(val, nested, pathMap);
      else pathMap[nested] = true;
    });
  return pathMap;
}

export const toCSVSelections = (
  transactions: KoinlyTransaction[]
): CSVSelections => {
  return transactions.reduce((prev, curr) => {
    return {
      ...prev,
      ...recursiveKeys(curr, "", {}),
    };
  }, {} as CSVSelections);
};
