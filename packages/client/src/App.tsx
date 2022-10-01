import { CSVTable } from "./components/CSVTable";
import { useImportCSVData } from "./hooks/use-import-csv-data";
import { Button, Modal, TextContainer, Text, Stack } from "@shopify/polaris";
import { useState } from "react";
import { MakePredictionsModal } from "./components/MakePredictionsModal";
import regression from "regression";

function App() {
  const { csv: labeledCSV, onChange: onChangeLabeledCSV } = useImportCSVData();
  const {
    csv: unlabeledCSV,
    onChange: onChangeUnlabledCSV,
    setCSV: setUnlabeledCSV,
  } = useImportCSVData();
  const [isMakePredictionsModalOpen, setIsMakePredictionsModalOpen] =
    useState(false);

  const openMakePredictionsModal = () => setIsMakePredictionsModalOpen(true);
  const closeMakePredictionsModal = () => setIsMakePredictionsModalOpen(false);

  const canMakePrediction = Boolean(labeledCSV) && Boolean(unlabeledCSV);

  const activator = (
    <Button disabled={!canMakePrediction} onClick={openMakePredictionsModal}>
      Make Predictions
    </Button>
  );

  const handleMakePredictions = async (data: any, label: string) => {
    console.log(data);

    closeMakePredictionsModal();

    const { features, labels } = data.training;

    const featuresWithLabels = features.map((feature: any, i: number) => {
      return [feature, labels[i]];
    });

    console.log("featrures with labels");
    console.log(featuresWithLabels);

    const result = regression.linear(featuresWithLabels);

    const gradient = result.equation[0];
    const yIntercept = result.equation[1];

    console.log(gradient, yIntercept);

    const hypothesis = (x: number) => {
      return gradient * x + yIntercept;
    };

    const predictions = data.unlabeledFeatures.map(hypothesis);

    const newUnlabeledCSV: Papa.ParseResult<unknown> = {
      ...unlabeledCSV!,
      data: unlabeledCSV!.data.map((data: any, i) => {
        return {
          ...data,
          [label]: predictions[i],
        };
      })!,
    };

    console.log(newUnlabeledCSV);

    setTimeout(() => {
      setUnlabeledCSV(newUnlabeledCSV);
    }, 2000);
  };

  return (
    <div className="App">
      <div style={{ marginBottom: 24 }}>
        {!canMakePrediction ? (
          activator
        ) : (
          <MakePredictionsModal
            labeledCSV={labeledCSV!}
            unlabeledCSV={unlabeledCSV!}
            open={isMakePredictionsModalOpen}
            onClose={closeMakePredictionsModal}
            activator={activator}
            onMakePrediction={handleMakePredictions}
          />
        )}
      </div>

      <Stack>
        <div>
          <label htmlFor="test">Import Training Data</label>
          <input name="file" type="File" onChange={onChangeLabeledCSV} />

          {labeledCSV && <CSVTable csv={labeledCSV} />}
        </div>
        <div>
          <label htmlFor="test">Import Training Data</label>
          <input name="file" type="File" onChange={onChangeUnlabledCSV} />

          {unlabeledCSV && <CSVTable csv={unlabeledCSV} />}
        </div>
      </Stack>
    </div>
  );
}

export default App;
