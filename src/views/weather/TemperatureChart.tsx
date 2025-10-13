import * as echarts from "echarts";

import style from "./index.module.css";
import { useEffect, useRef, useState } from "react";
import { request } from "@/utils/reqeust";
import { useToken } from "@/utils/permanence";
import { useUser } from "@/store";

type AccTemp = {
    id: number;
    date: string;
    accTemp: number;
};
type AccTempResult = {
    code: number;
    msg: null;
    data: {
        last: AccTemp[];
        thisYear: AccTemp[];
    };
};
function TemperatureChart() {
    // inits
    const [token, _] = useToken();
    const farmId = useUser((state) => state.currentFarmId);
    const farmType = useUser((state) => state.farms).find((f) => f.id === farmId)?.type;

    // for painting
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [lastAccTemp, setLastAccTemp] = useState<AccTemp[]>([]);
    const [thisAccTemp, setThisAccTemp] = useState<AccTemp[]>([]);

    // show up while failed to fetch data
    const [tip, setTip] = useState<boolean>(false);

    useEffect(() => {
        request
            .get<AccTempResult>(`/weather/accumulated-temperature?farmType=${farmType}`, token)
            .then((data) => {
                setLastAccTemp(data.data.last);
                setThisAccTemp(data.data.thisYear);

                setTip(false);
            })
            .catch(() => {
                setTip(true);
            });

        if (window.innerWidth >= 1000) {
            console.log(123);
        }
    }, []);

    useEffect(() => {
        if (!containerRef.current) return;
        const chart = echarts.init(containerRef.current);
        chart.setOption({
            title: {
                text: "两年积温对照曲线图",
            },
            legend: {
                bottom: 0,
                data: ["去年曲线", "今年曲线"],
            },
            tooltip: {
                trigger: "axis",
            },
            grid: {
                top: 20,
                bottom: 20,
                left: 20,
                right: 20,
                containLabel: true,
            },
            xAxis: {
                data: lastAccTemp.map((t) => t.date),
            },
            yAxis: {
                type: "value",
                min: "dataMin",
            },
            series: [
                {
                    name: "去年曲线",
                    type: "line",
                    data: lastAccTemp.map((t) => t.accTemp),
                    areaStyle: {
                        color: "rgba(0, 123, 255, 0.2)",
                    },
                },
                {
                    name: "今年曲线",
                    type: "line",
                    data: thisAccTemp.map((t) => t.accTemp),
                    areaStyle: {
                        color: "rgba(0, 128, 0, 0.2)",
                    },
                },
            ],
        });
        return () => {
            chart.dispose();
        };
    }, [lastAccTemp, thisAccTemp]);
    return (
        <>
            {tip ? (
                <div style={{ color: "var(--danger)" }}>获取数据错误，请检查网络或联系管理员！</div>
            ) : (
                <div
                    ref={containerRef}
                    style={{ height: "400px" }}></div>
            )}
        </>
    );
}

export default TemperatureChart;
