import { useEffect, useState } from "react";
import type { JSX } from "react";
import Distribution from "./Distribution";
import type { DistributionData, DistributionBorder } from "./Distribution";
import { useUser } from "@/store";

import style from "./index.module.css";
import { Card } from "antd";

export default function Statistic(): JSX.Element {
    const [distributions, setDistributions] = useState<
        Record<string, { data: DistributionData[]; border: DistributionBorder[] }>
    >({});
    const currentFarmId = useUser((state) => state.currentFarmId);
    const currentFarm = useUser((state) => state.farms).find((f) => f.id === currentFarmId);

    useEffect(() => {
        if (!currentFarm) return;

        const { crops, locations } = currentFarm;
        // set all kinds of data except these below
        const exclude = ["date", "diseases", "id", "latitude", "longitude", "url"];
        const keys = Object.keys(crops[0] || {}).filter((key) => !exclude.includes(key));
        const state: Record<string, { data: DistributionData[]; border: DistributionBorder[] }> =
            {};

        keys.forEach((k) => {
            state[k] = { data: [], border: [] };
            state[k].data = crops.map(
                (c) =>
                    ({
                        id: c.id,
                        value: c[k],
                        latitude: c.latitude,
                        longitude: c.longitude,
                    } as DistributionData),
            );
            state[k].border = locations.map((l) => ({
                id: l.id,
                latitude: l.latitude,
                longitude: l.longitude,
            }));
        });

        setDistributions(state);
    }, [currentFarm]);

    return (
        <div className={style.container}>
            {Object.entries(distributions).map(([key, state]) => (
                <Card
                    key={key}
                    title={
                        key === "yield"
                            ? "产量分布热力图"
                            : key === "size"
                            ? "冠层分布热力图"
                            : "病虫率分布热力图"
                    }>
                    <Distribution
                        data={state.data}
                        border={state.border}
                        type={key}
                    />
                </Card>
            ))}
        </div>
    );
}
