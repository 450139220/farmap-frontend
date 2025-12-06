// 1. 画地图
// 2. 画markers
import "@amap/amap-jsapi-types";
import "@amap/amap-jsapi-loader";

import { useCallback, useEffect } from "react";
import type { FarmStoreState } from "@/store/farm";
import { getPercentageColor } from "./utils/color";
import type { SliderProps } from "./slider/Slider";
import type { ModeSelectType } from "./selects/ModeSelect";

export type MapProps = {
  center: [number, number];
  zoom: number;
  crops: FarmStoreState["crops"];
  farmLocations: FarmStoreState["locations"];
  infoKey: keyof FarmStoreState["crops"][number];
  modeKey: ModeSelectType["value"];
  slider: Omit<SliderProps, "onChangeEnd">;
};

export default function MapContainer(props: MapProps) {
  // Show amap and update when farm changes
  let amap: AMap.Map | null = null;
  useEffect(() => {
    if (amap) amap.destroy();
    if (!(props.center.length === 2)) return;

    amap = new AMap.Map("map-container", {
      center: props.center,
      zoom: props.zoom,
    });
  }, [props.center, props.zoom]);

  // Show marker
  // PERF: the map will be reset to initial location
  const drawMarkers = useCallback(
    (amap: AMap.Map, crops: FarmStoreState["crops"]) => {
      amap.clearMap();

      // Slider range
      const max = props.slider.value.right;
      const min = props.slider.value.left;
      const range = max - min;

      crops.forEach((c) => {
        // Calculate color of markers
        const color = getPercentageColor(
          (((c[props.infoKey as keyof FarmStoreState["crops"][number]] as number) - min) / range) *
            100,
        );
        const content = `<div style="background-color: ${color}; width: 7px; height: 7px; border-radius: 50%"></div>`;
        const position = new AMap.LngLat(c.longitude, c.latitude);
        const marker = new AMap.Marker({
          content,
          position,
        });
        amap.add(marker);
      });
    },
    [props.slider.scale, props.slider.value, props.infoKey],
  );

  // Update display mode
  const drawPolygon = useCallback(
    (amap: AMap.Map) => {
      amap.clearMap();

      const pathArr = [[props.farmLocations.map((l) => [l.longitude, l.latitude])]];
      const polygon = new (AMap.Polygon as any)({
        path: pathArr,
        fillColor: "#ccebc5", //多边形填充颜色
        strokeOpacity: 1, //线条透明度
        fillOpacity: 0.5, //填充透明度
        strokeColor: "#2b8cbe", //线条颜色
        strokeWeight: 1, //线条宽度
        strokeStyle: "dashed", //线样式
        strokeDasharray: [5, 5], //轮廓的虚线和间隙的样式
      });

      polygon.on("mouseover", () => {
        polygon.setOptions({
          fillOpacity: 0.7, //多边形填充透明度
          fillColor: "#7bccc4",
        });
      });
      polygon.on("mouseout", () => {
        polygon.setOptions({
          fillOpacity: 0.5,
          fillColor: "#ccebc5",
        });
      });

      amap.add(polygon);
    },
    [props.modeKey, props.farmLocations],
  );

  useEffect(() => {
    if (!amap) return;

    if (props.modeKey === "farm") {
      drawPolygon(amap);
    } else if (props.modeKey === "crop") {
      drawMarkers(amap, props.crops);
    }

    // Trigger when farm sitches
  }, [props.crops, props.slider.value, props.slider.scale, props.modeKey]);

  return <div id="map-container" style={{ flexGrow: 1, borderRadius: 8 }}></div>;
}
