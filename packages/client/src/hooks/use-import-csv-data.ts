import { useState } from "react";
import Papa from "papaparse";

export const useImportCSVData = () => {
  const [csv, setCSV] = useState<Papa.ParseResult<unknown> | undefined>();

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    // get files
    const files = e.target.files!;

    // check if user uploaded a file
    if (files.length === 0) {
      return;
    }

    const file = files[0];

    console.log(file);

    // check type of file -> make sure it's csv
    const isCSV = file.type.split("/")[1] === "csv";

    if (!isCSV) {
      // some error perhaps
      return;
    }

    // parse file
    const fileReader = new FileReader();

    fileReader.onload = async ({ target }) => {
      // csv in text format
      const result = target!.result as string;

      const csv = Papa.parse(result, { header: true });

      setCSV(csv);
    };

    fileReader.readAsText(file);
  };

  return {
    csv,
    onChange,
    setCSV,
  };
};
