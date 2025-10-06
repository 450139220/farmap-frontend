import "@amap/amap-jsapi-types";
import "@amap/amap-jsapi-loader";

import { useEffect, useState } from "react";

import style from "./index.module.css";
import { createMap, resetMap, setMap, useMap } from "@/utils/map";

export type MapProps = {
  farm: FarmState;
};
export type CropTypes = "rate" | "size" | "yield";

function MapContainer(props: MapProps) {
  // execute when farm changes
  useEffect(() => {
    // create map and mount
    const map: AMap.Map = createMap(props.farm);
    setMap(map);

    // clear storage when unmount
    return () => {
      map?.destroy();
      resetMap();
    };
  }, [props.farm]);

  return (
    <div
      id="map-container"
      className={style.map__container}></div>
  );
}

export default MapContainer;
