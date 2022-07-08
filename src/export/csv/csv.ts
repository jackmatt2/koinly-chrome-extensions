import { CSVSelections } from "../../app-context/types";
import { KoinlyTransaction } from "../../koinly.types";

// const defaultCSVSelections: CSVSelections = {
//     'date': true,
//     'from.amount': true,
//     'from.currency.symbol': true,
//     'to.amount': true,
//     'to.currency.symbol': true,
//     'fee.amount': true,
//     'fee.currency.symbol': true,
//     'net_value': true,
//     //baseCurrency,
//     'type': true,
//     'description': true,
//     'txhash': true,
// }

const getValueFromPath = (obj: object, path: string): string | number | undefined | null => {
    const keys = path.split('.');
    let value: any = obj;
    keys.forEach(k => {
        value = value ? value[k] : ''
    });
    return value;
}

const toRow = (k: KoinlyTransaction, selections: CSVSelections) => {
    return Object.keys(selections)
        .filter(path => selections[path])
        .map(path => getValueFromPath(k, path));
}

const getHeaderFromPath = (path: string) => path
    .replaceAll('_', '.')
    .split('.')
    .map(str => str.charAt(0).toUpperCase() + str.slice(1)) // Title Case
    .join(" ");

const toHeadings = (selections: CSVSelections) => {
    return Object.keys(selections)
        .filter(path => selections[path])
        .map(path => getHeaderFromPath(path));
}

export const toCSVFile = (transactions: Array<KoinlyTransaction>, selections: CSVSelections) => {  
    const headings = toHeadings(selections)
    
    const transactionRows = transactions.map((t) => { 
        const row = toRow(t, selections)
        return row.join(',');  
    });

    const csv = [
        headings.join(','), 
        ...transactionRows
    ].join('\n');
        
    const hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'Koinly Transactions.csv';
    hiddenElement.click();
}


