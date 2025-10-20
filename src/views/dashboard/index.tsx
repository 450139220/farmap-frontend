import MapContainer from "./Map";
import Slider from "./Slider";
import type { SliderProps } from "./Slider";
import Upload from "./Upload";

import style from "./index.module.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { useUser } from "@/store";
import { addEventToMarkers, removeEventToMarkers, useMap } from "@/utils/map";

import { Card, Carousel, Divider, Flex, Image, Select, Space } from "antd";

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
    const modeOptions: { value: number; label: string }[] = [
        { value: 0, label: "作物" },
        { value: 1, label: "农场" },
    ];
    const modeOptionsMap = {
        作物: "crop",
        农场: "farm",
    };
    // TODO: the same as LINE_16
    const infoOptions: { value: number; label: string }[] = [
        { value: 0, label: "病虫害率" },
        { value: 1, label: "冠层大小" },
        { value: 2, label: "作物产量" },
    ];
    const infoOptionsMap = {
        病虫害率: "rate",
        冠层大小: "size",
        作物产量: "yield",
    };
    // select events
    const handleChangeFarm = (value: number): void => {
        setFarm(farms.find((f) => f.id === value)!.id);
    };
    const handleChangeMode = (_: number, opts?: { value: number; label: string }): void => {
        setSelectedMode(modeOptionsMap[opts!.label as keyof typeof modeOptionsMap] as any);
    };
    const handleChangeInfo = (
        _: number,
        opts?: { value: number; label: MapSelectors["infoOptions"] },
    ): void => {
        setSelectedInfo(infoOptionsMap[opts!.label as keyof typeof infoOptionsMap] as any);
    };
    // map info options to chinese words

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

    // content to information window
    const map = useMap();
    // store infoWindow object to cache
    const infoWindow = useRef<AMap.InfoWindow>(
        new AMap.InfoWindow({
            content: "",
            anchor: "bottom-center",
        }),
    );

    const [mapReady, setMapReady] = useState<boolean>(false);
    const [selectedImagesUrl, setSelectedImagesUrl] = useState<string[]>([]);
    useEffect(() => {
        if (!map && !mapReady) return;
        addEventToMarkers(clickMarkerContainer);
        return () => {
            removeEventToMarkers(clickMarkerContainer);
            setMapReady(false);
        };
    }, [mapReady, currentFarm]);
    const clickMarkerContainer = useCallback(
        (e: MouseEvent) => {
            const target = e.target as HTMLDivElement;
            if (!target) return;
            const value = Number(target.getAttribute("data-value"));
            if (!value) return;
            const crop = currentFarm?.crops.find((c) => c.id === value);
            if (!crop || !map) return;

            const content = [
                `<div>${currentFarm?.name} 农场作物详情</div>`,
                `更新时间：${crop.date}`,
                `病虫害种类：${crop.diseases}`,
                `病虫害率：${crop.rate}`,
                `冠层大小：${crop.size}`,
                `单株产量：${crop.yield}`,
            ];

            setSelectedImagesUrl([crop.url]);
            infoWindow.current!.setContent(content.join("<br>"));
            infoWindow.current!.open(map, new AMap.LngLat(crop.longitude, crop.latitude) as any);
        },
        [map, currentFarm],
    );

    return (
        <Flex
            vertical
            style={{ gap: "1rem" }}>
            <Card
                title={
                    <i
                        className="ri-earth-fill"
                        style={{ color: "var(--primary)" }}>
                        &nbsp;&nbsp;数字地图
                    </i>
                }>
                {currentFarm && (
                    <Space
                        split={<Divider type="vertical" />}
                        wrap
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}>
                        <div>
                            <span>当前农场：</span>
                            <Select
                                style={{ width: 120 }}
                                defaultValue={currentFarm.id}
                                onChange={handleChangeFarm}
                                options={farms.map((f) => ({
                                    value: f.id,
                                    label: f.name,
                                }))}
                            />
                        </div>
                        <div>
                            <span>地图模式：</span>
                            <Select
                                style={{ width: 120 }}
                                defaultValue={0}
                                onChange={handleChangeMode as any}
                                options={modeOptions}
                            />
                        </div>
                        <div>
                            <span>展示信息：</span>
                            <Select
                                style={{ width: 120 }}
                                defaultValue={0}
                                onChange={handleChangeInfo as any}
                                options={infoOptions}
                            />
                        </div>
                    </Space>
                )}
                {currentFarm && (
                    <MapContainer
                        farm={currentFarm!}
                        selector={{ selectedMode, selectedInfo }}
                        slider={{ left: sliderStates.value.left, right: sliderStates.value.right }}
                        onMapReady={() => {
                            setMapReady(true);
                        }}
                    />
                )}
                <Slider {...sliderStates} />
            </Card>

            <Flex className={style.other__container}>
                <Card
                    title={
                        <i
                            className="ri-image-fill"
                            style={{ color: "var(--primary)" }}>
                            &nbsp;&nbsp;作物图片
                        </i>
                    }>
                    <Carousel autoplay>
                        {selectedImagesUrl.length === 0 ? (
                            <div>请选择作物以展示图片</div>
                        ) : (
                            selectedImagesUrl.map((url) => (
                                <div>
                                    <Image
                                        src={url || ""}
                                        width={500}
                                    />
                                </div>
                            ))
                        )}
                    </Carousel>
                </Card>
                <Upload />
            </Flex>
        </Flex>
    );
}

export default Map;
