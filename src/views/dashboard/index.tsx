import { useState } from "react";
import type { FarmSelectType } from "./selects/FarmSelect";
import type { ModeSelectType } from "./selects/ModeSelect";
import type { InfoSelectType } from "./selects/InfoSelect";
import FarmSelect from "./selects/FarmSelect";
import { useUserStore } from "@/store/user";
import { Card, Flex } from "antd";
import InfoSelect from "./selects/InfoSelect";
import ModeSelect from "./selects/ModeSelect";
import MapContainer from "./Map";
import Slider from "./slider/Slider";
import type { SliderProps } from "./slider/Slider";

export default function Map() {
  // Get farm select informations
  const farmOptions = useUserStore((s) => s.farms);
  const [farm, setFarm] = useState<FarmSelectType["value"]>(-1);
  // THe mode & info select states
  const [mode, setMode] = useState<ModeSelectType["value"]>("crop");
  const [info, setInfo] = useState<InfoSelectType["value"]>("yield");

  // Slider
  // TODO: update slider values & scale with real requested data
  const [slider, setSlider] = useState<Omit<SliderProps, "onChangeEnd">>({
    value: {
      left: 10,
      right: 90,
    },
    scale: {
      min: 0,
      max: 100,
    },
    decimal: false,
  });
  const sliderChange: SliderProps["onChangeEnd"] = (left, right) => {
    // TODO: update map markers here
    console.log(left, right);
  };

  return (
    <Card style={{ height: "100%" }} styles={{ body: { height: "100%" } }}>
      <Flex gap="0.5rem" vertical style={{ height: "100%" }}>
        <Flex gap="0.5rem" style={{ width: "100%" }}>
          <FarmSelect
            value={farm}
            options={farmOptions}
            onChange={(newId) => {
              setFarm(newId);
              // TODO: update farm store here
            }}
          />
          <ModeSelect
            value={mode}
            onChange={(newMode) => {
              setMode(newMode);
              // TODO: update amap content here
            }}
          />
          <InfoSelect
            value={info}
            disabled={mode === "farm"}
            onChange={(newInfo) => {
              setInfo(newInfo);
              // TODO: update amap content here
            }}
          />
        </Flex>
        <MapContainer />
        <Slider {...slider} onChangeEnd={sliderChange} />
      </Flex>
    </Card>
  );
}
