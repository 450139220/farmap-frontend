import MapContainer from "./Map";
import InfoWindow from "./InfoWindow";
import Upload from "./Upload";

import style from "./index.module.css";
import { useEffect, useState } from "react";
import { useUser } from "@/store";
import Selector from "./Selector";
import Slider from "./Slider";

function Map() {
  // farm initial states
  const currentFarmId = useUser((state) => state.currentFarmId);
  const farms = useUser((state) => state.farms);
  const currentFarm = farms.find((f) => f.id === currentFarmId);

  return (
    <div className={style.container}>
      <div className="box">
        <div className={style.selector__container}>
          <Selector />
          <Selector />
          <Selector />
        </div>
      </div>
      <MapContainer farm={currentFarm!} />
      {/* <Slider /> */}

      <InfoWindow />
      <Upload />
    </div>
  );
}

export default Map;
