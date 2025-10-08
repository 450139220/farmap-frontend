import type { MapSelectors } from "@/views/dashboard";

let map: AMap.Map | null = null;
function setMap(newMap: AMap.Map) {
  map = newMap;
}
function resetMap() {
  map = null;
}
function useMap(): AMap.Map | undefined {
  if (!map) return;
  return map;
}

function createMap(farm: FarmState): AMap.Map {
  return new AMap.Map("map-container", {
    center: farm.center.split(",").map((c) => Number(c)) as [number, number],
    zoom: farm.zoom,
    viewMode: "2D",
    // mapStyle: "amap://styles/darkblue",
    mapStyle: "amap://styles/whitesmoke",
  });
}
function createMarkers(
  crops: Crop[],
  infoOptions: MapSelectors["infoOptions"],
  left: number,
  right: number,
): AMap.Marker[] {
  return crops.map((c) => {
    const content = `<div class="map__marker" data-value=${
      c.id
    } style="background-color: ${calculateColor(c[infoOptions], left, right)}"></div>`;
    const position = new AMap.LngLat(c.longitude, c.latitude);
    return new AMap.Marker({
      position,
      content,
    });
  });
}
function drawMarkers(map: AMap.Map, markers: AMap.Marker[]): void {
  // reset
  map.clearMap();

  for (const marker of markers) {
    map.add(marker);
  }
}

function addEventToMarkers(event: (e: MouseEvent) => void): void {
  const markerContainer = document.querySelector(".amap-markers") as HTMLElement | null;
  if (!markerContainer) return;
  markerContainer.addEventListener("click", event);
}
function removeEventToMarkers(event: (e: MouseEvent) => void): void {
  const markerContainer = document.querySelector(".amap-markers") as HTMLElement | null;
  if (!markerContainer) return;
  markerContainer.removeEventListener("click", event);
}

function drawPolygon(map: AMap.Map, locations: FarmState["locations"]): void {
  map.clearMap();

  const path = locations.map((l) => [l.longitude, l.latitude]);
  const polygon = new AMap.Polygon({
    path, //多边形路径
    fillColor: "#ccebc5", //多边形填充颜色
    strokeOpacity: 1, //线条透明度
    fillOpacity: 0.5, //填充透明度
    strokeColor: "#2b8cbe", //线条颜色
    strokeWeight: 1, //线条宽度
    strokeStyle: "dashed", //线样式
    strokeDasharray: [5, 5], //轮廓的虚线和间隙的样式
  });
  //鼠标移入更改样式
  polygon.on("mouseover", () => {
    polygon.setOptions({
      fillOpacity: 0.7, //多边形填充透明度
      fillColor: "#7bccc4",
    });
  });
  //鼠标移出恢复样式
  polygon.on("mouseout", () => {
    polygon.setOptions({
      fillOpacity: 0.5,
      fillColor: "#ccebc5",
    });
  });
  map.add(polygon);
}

export { setMap, resetMap, useMap };
export { createMap };

export { createMarkers, drawMarkers };
export { drawPolygon };

export { addEventToMarkers, removeEventToMarkers };

// utils
function calculateColor(currentValue: number, left: number, right: number) {
  // boundary
  if (currentValue <= left) return "rgb(255, 255, 91)";
  if (currentValue > right) return "rgb(64, 7, 88)";
  // within range
  const percent = (currentValue - left) / (right - left);
  if (percent <= 0.33) {
    const [r, g, b] = calculateRGB("rgb(255, 255, 91)", "rgb(145, 244, 128)", percent);
    return `rgb(${r}, ${g}, ${b})`;
  } else if (percent <= 0.67) {
    const [r, g, b] = calculateRGB("rgb(145, 244, 128)", "rgb(66, 89, 166)", percent);
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    const [r, g, b] = calculateRGB("rgb(66, 89, 166)", "rgb(64, 7, 88)", percent);
    return `rgb(${r}, ${g}, ${b})`;
  }
}

// utils for calculating colors
function rgbToArray(rgb: string): number[] {
  const match = rgb.match(/\d+/g);
  return match ? match.map(Number) : [];
}
function calculateRGB(c1: string, c2: string, p: number): number[] {
  const c1s = rgbToArray(c1);
  const c2s = rgbToArray(c2);
  const res = [];
  for (let i = 0; i < 3; i++) {
    const color = (c1s[i] - c2s[i]) * p + c2s[i];
    res.push(color);
  }
  return res;
}
