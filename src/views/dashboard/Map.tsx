import "@amap/amap-jsapi-types";
import "@amap/amap-jsapi-loader";

import { useEffect } from "react";

// import {
//     createMap,
//     createMarkers,
//     drawMarkers,
//     drawPolygon,
//     resetMap,
//     setMap,
//     useMap,
// } from "@/utils/map";

export type MapProps = {};

function MapContainer(props: MapProps) {
  let amap: AMap.Map | null = null;
  const satellite = new AMap.TileLayer.Satellite();

  useEffect(() => {
    amap = new AMap.Map("map-container", {
      zoom: 12,
      layers: [satellite],
      // mapStyle: "amap://styles/darkblue",
      // mapStyle: "amap://styles/whitesmoke",
    });

    return () => {
      amap?.destroy();
    };
  }, []);

  // execute when slider moves
  // useEffect(() => {
  //   const map = useMap();
  //   if (!map) return;
  //   paintOnMap(map);
  // }, [props.selector.selectedMode, props.slider.left, props.slider.right]);

  // function paintOnMap(map: AMap.Map): void {
  //   if (props.selector.selectedMode === "crop") {
  //     const markers = createMarkers(
  //       props.farm.crops,
  //       props.selector.selectedInfo,
  //       props.slider.left,
  //       props.slider.right,
  //     );
  //     drawMarkers(map, markers);
  //   } else {
  //     drawPolygon(map, props.farm.locations);
  //   }
  // }

  return (
    <div id="map-container" style={{ flexGrow: 1, borderRadius: 8 }}></div>
  );
}

export default MapContainer;
