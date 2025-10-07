import Selector from "./Selector";
import MapContainer from "./Map";
import Slider from "./Slider";
import type { SliderProps } from "./Slider";
import InfoWindow from "./InfoWindow";
import Upload from "./Upload";

import style from "./index.module.css";
import { useEffect, useState } from "react";
import { useUser } from "@/store";

export type MapSelectors = {
  // TODO: <farmOptions> type needs to be changed
  farmOptions: number[];
  modeOptions: "crop" | "farm";
  // TODO: this <infoOption> type needs to be the same with the columns in database
  // which refers to specific information types
  infoOptions: "rate" | "size" | "yield";
};
function Map() {
  // farm initial states
  const currentFarmId = useUser((state) => state.currentFarmId);

  // these two values are also the farm options and selected farm for selector
  const farms = useUser((state) => state.farms);
  const currentFarm = farms.find((f) => f.id === currentFarmId);
  const setFarm = useUser((state) => state.selectFarm);
  // selectors' states
  const [selectedMode, setSelectedMode] = useState<MapSelectors["modeOptions"]>("crop");
  const [selectedInfo, setSelectedInfo] = useState<MapSelectors["infoOptions"]>("rate");
  const modeOptions: MapSelectors["modeOptions"][] = ["crop", "farm"];
  // TODO: the same as LINE_16
  const infoOptions: MapSelectors["infoOptions"][] = ["rate", "size", "yield"];
  // selectors' change event
  const handleSelectorChange: <T extends string | number>(
    newValue: T,
    type: keyof MapSelectors,
  ) => void = (newValue, type) => {
    if (type === "farmOptions") {
      setFarm(farms.find((f) => f.name === newValue)!.id);
    } else if (type === "modeOptions") {
      setSelectedMode(newValue as MapSelectors["modeOptions"]);
    } else {
      setSelectedInfo(newValue as MapSelectors["infoOptions"]);
    }
  };

  // init slider states
  const [sliderStates, setSliderStates] = useState<SliderProps>({
    value: {
      left: 0,
      right: 100,
    },
    scale: {
      min: 0,
      max: 100,
    },
    decimal: true,
    onChangeEnd(leftValue, rightValue) {
      setSliderStates((p) => ({
        ...p,
        value: {
          left: leftValue,
          right: rightValue,
        },
      }));
    },
  });

  useEffect(() => {
    if (!currentFarm) return;
    // update data for slider states
    updateSliderStates(selectedInfo !== "yield");
  }, [currentFarm, selectedInfo]);

  function updateSliderStates(decimal: boolean = false): void {
    const minSliderScale = Math.min(...currentFarm!.crops.map((c) => c[selectedInfo]));
    const maxSliderScale = Math.max(...currentFarm!.crops.map((c) => c[selectedInfo]));
    const scale = maxSliderScale - minSliderScale;
    const leftSliderValue = Math.random() * 0.4 * scale + minSliderScale;
    const rightSliderValue = (Math.random() * 0.4 + 0.6) * scale + minSliderScale;
    setSliderStates((p) => ({
      ...p,
      value: {
        left: leftSliderValue,
        right: rightSliderValue,
      },
      scale: {
        min: minSliderScale,
        max: maxSliderScale,
      },
      decimal,
    }));
  }

  return (
    <div className={style.container}>
      <Slider {...sliderStates} />
      <div className="box">
        {currentFarm && (
          <div className={style.selector__container}>
            <span>当前农场：</span>
            <Selector
              selected={currentFarm.name}
              options={farms.map((f) => f.name)}
              type="farmOptions"
              onChange={handleSelectorChange}
            />
            <span style={{ margin: "0 1rem" }}>|</span>
            <span>地图模式：</span>
            <Selector
              selected={selectedMode}
              options={modeOptions}
              type="modeOptions"
              onChange={handleSelectorChange}
            />
            <span style={{ margin: "0 1rem" }}>|</span>
            <span>展示信息：</span>
            <Selector
              selected={selectedInfo}
              options={infoOptions}
              type="infoOptions"
              onChange={handleSelectorChange}
            />
          </div>
        )}
      </div>
      {currentFarm && (
        <MapContainer
          farm={currentFarm!}
          selector={{ selectedMode, selectedInfo }}
          slider={{ left: sliderStates.value.left, right: sliderStates.value.right }}
        />
      )}

      <InfoWindow />
      <Upload />
    </div>
  );
}

export default Map;
