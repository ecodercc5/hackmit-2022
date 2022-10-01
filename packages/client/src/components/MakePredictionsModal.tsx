import React, { useState } from "react";
import { Button, Modal, Text, RadioButton, Stack } from "@shopify/polaris";

interface Props {
  labeledCSV: Papa.ParseResult<unknown>;
  unlabeledCSV: Papa.ParseResult<unknown>;
  open: boolean;
  onClose: () => void;
  activator:
    | React.RefObject<HTMLElement>
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>;

  onMakePrediction: (data: any, label: string) => void;
}

export const MakePredictionsModal: React.FC<Props> = ({
  labeledCSV,
  unlabeledCSV,
  open,
  onClose,
  activator,
  onMakePrediction,
}) => {
  const [selected, setSelected] = useState({
    feature: "",
    label: "",
  });

  const { feature, label } = selected;

  const canMakePrediction = Boolean(feature) && Boolean(label);
  const fields = labeledCSV.meta.fields!;

  return (
    <Modal
      title="Make Predictions"
      open={open}
      activator={activator}
      onClose={onClose}
    >
      <Modal.Section>
        <Stack vertical>
          <div>
            <Text variant="headingMd" as="h6">
              Features
            </Text>
            <Text variant="bodyMd" as="span">
              Features are inputs ...
            </Text>

            <div style={{ marginTop: 12 }}>
              <Stack vertical spacing="none">
                {fields.map((field) => {
                  return (
                    <RadioButton
                      key={field}
                      checked={feature === field}
                      label={field}
                      id={field}
                      name="features"
                      onChange={(_checked, newValue) => {
                        console.log("asdfasdf");
                        console.log(newValue);

                        setSelected({
                          ...selected,
                          feature: field,
                        });
                      }}
                    />
                  );
                })}
              </Stack>
            </div>
          </div>

          <div>
            <Text variant="headingMd" as="h6">
              Label
            </Text>

            <Text variant="bodyMd" as="span">
              Labels are inputs ...
            </Text>

            <div style={{ marginTop: 12 }}>
              <Stack vertical spacing="none">
                {fields.map((field) => {
                  return (
                    <RadioButton
                      key={field}
                      id={`${Math.random()}`}
                      name="labels"
                      checked={label === field}
                      label={field}
                      onChange={(_checked, newValue) => {
                        console.log("asdfasdf");
                        console.log(newValue);

                        setSelected({
                          ...selected,
                          label: field,
                        });
                      }}
                    />
                  );
                })}
              </Stack>
            </div>
          </div>
        </Stack>

        <div style={{ marginTop: 16 }}>
          <Button
            disabled={!canMakePrediction}
            onClick={() => {
              const features = labeledCSV.data.map((data: any) =>
                Number(data[feature])
              );
              const labels = labeledCSV.data.map((data: any) =>
                Number(data[label])
              );

              const unlabeledFeatures = unlabeledCSV.data.map((data: any) =>
                Number(data[feature])
              );

              console.log(labels, features);
              console.log(unlabeledFeatures);

              const data = {
                training: {
                  features,
                  labels,
                },
                unlabeledFeatures,
              };

              onMakePrediction(data, label);
            }}
          >
            Calculate
          </Button>
        </div>
      </Modal.Section>
    </Modal>
  );
};
