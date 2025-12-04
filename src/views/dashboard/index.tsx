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
import { GlobalOutlined, MacCommandOutlined } from "@ant-design/icons";

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
    <Flex vertical gap="0.5rem" style={{ height: "100%" }}>
      <Card
        title={
          <>
            <GlobalOutlined />
            &nbsp;&nbsp;地图详情
          </>
        }
        style={{ height: "100%" }}
        styles={{ body: { height: "calc(100% - 60px)" } }}>
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
        </Flex>
      </Card>
      <Card
        title={
          <>
            <MacCommandOutlined />
            &nbsp;&nbsp;调整分布
          </>
        }>
        <Slider {...slider} onChangeEnd={sliderChange} />
      </Card>
    </Flex>
  );
}
