import React from "react";
import Papa from "papaparse";
import { DataTable, ColumnContentType } from "@shopify/polaris";

interface ICSVTableProps {
  csv: Papa.ParseResult<unknown>;
}

export const CSVTable: React.FC<ICSVTableProps> = ({ csv }) => {
  const fields = csv.meta.fields!;
  const data = csv.data.map((row: any) => {
    return fields.map((field) => row[field]);
  });

  const types: ColumnContentType[] = fields.map(() => "text");

  return <DataTable headings={fields} rows={data} columnContentTypes={types} />;
};
