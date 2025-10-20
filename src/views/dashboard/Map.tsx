import "@amap/amap-jsapi-types";
import "@amap/amap-jsapi-loader";

import { useEffect } from "react";

import style from "./index.module.css";
import {
    createMap,
    createMarkers,
    drawMarkers,
    drawPolygon,
    resetMap,
    setMap,
    useMap,
} from "@/utils/map";
import type { MapSelectors } from ".";

export type MapProps = {
    farm: FarmState;
    selector: {
        selectedMode: MapSelectors["modeOptions"];
        selectedInfo: MapSelectors["infoOptions"];
    };
    slider: {
        left: number;
        right: number;
    };
    onMapReady?: () => void;
};

function MapContainer(props: MapProps) {
    // execute when farm changes
    useEffect(() => {
        // create map and mount
        let map: AMap.Map | undefined = useMap();
        if (!map) {
            map = createMap(props.farm);
            setMap(map);
        }
        // draw markers and polygon
        paintOnMap(map);
        // add event when map is ready
        props.onMapReady?.();

        // clear storage when unmount
        return () => {
            map?.destroy();
            resetMap();
        };
    }, [props.farm]);
    // execute when slider moves
    useEffect(() => {
        const map = useMap();
        if (!map) return;
        paintOnMap(map);
    }, [props.selector.selectedMode, props.slider.left, props.slider.right]);

    function paintOnMap(map: AMap.Map): void {
        if (props.selector.selectedMode === "crop") {
            const markers = createMarkers(
                props.farm.crops,
                props.selector.selectedInfo,
                props.slider.left,
                props.slider.right,
            );
            drawMarkers(map, markers);
        } else {
            drawPolygon(map, props.farm.locations);
        }
    }

    return (
        <div
            id="map-container"
            className={style.map__container}></div>
    );
}

export default MapContainer;
