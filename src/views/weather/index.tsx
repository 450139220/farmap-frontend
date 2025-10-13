import style from "./index.module.css";

import WeatherPrediction from "./WeatherPredcition";
import WeatherIntroBox from "./WeatherIntroBox";
import TemperatureChart from "./TemperatureChart";

import { Card, Divider, Flex } from "antd";

function Weather() {
    return (
        <div className={style.container}>
            <Card
                title={
                    <i
                        className="ri-sun-foggy-fill"
                        style={{ color: "var(--primary)" }}>
                        &nbsp;&nbsp;天气预报
                    </i>
                }>
                <WeatherPrediction />
            </Card>

            <Divider />

            <Flex className={style.child__container}>
                <Card
                    title={
                        <i
                            className="ri-information-2-fill"
                            style={{ color: "var(--primary)" }}>
                            &nbsp;&nbsp;物候期详情
                        </i>
                    }>
                    <WeatherIntroBox />
                </Card>
                <Card
                    className={style.chart__container}
                    title={
                        <i
                            className="ri-line-chart-fill"
                            style={{ color: "var(--primary)" }}>
                            &nbsp;&nbsp;积温曲线
                        </i>
                    }>
                    <TemperatureChart />
                </Card>
            </Flex>
        </div>
    );
}

export default Weather;
