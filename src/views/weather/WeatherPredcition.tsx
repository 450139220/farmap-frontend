import { useEffect, useState } from "react";

import style from "./index.module.css";
import { Divider, Flex } from "antd";
import { useFarmStore } from "@/store/farm";

// PERF: put this key to server
const API_KEY = "31b6db36c66f461e89c408c864b51da9";

type Prediction = {
  fxDate: string;
  tempMax: string;
  tempMin: string;

  iconDay: string;
  iconNight: string;
  textDay: string;
  textNight: string;
  windDirDay: string;
  windDirNight: string;
  windScaleDay: string;
  windScaleNight: string;

  humidity: string;
  precip: string;
  vis: string;
  pressure: string;
};
type PredictionResult = {
  code: string;
  daily: Prediction[];
  updateTime: string;
};
function WeatherPrediction() {
  // Get farm location
  const location = useFarmStore((s) => s.center);

  // Store 3 days weathers
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  // For error tips
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    fetch(`https://m25eghjq33.re.qweatherapi.com/v7/weather/3d?location=${location}`, {
      headers: {
        "X-QW-Api-Key": API_KEY,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("failed to fetch qw weather");
        return res.json();
      })
      .then((data: PredictionResult) => {
        const pres = data.daily;
        if (!pres) throw new Error();

        setPredictions(pres);
        setIsError(false);
      })
      .catch(() => {
        setIsError(true);
      });
  }, []);

  const calcColor = (temp: string) => {
    if (Number(temp) <= 10) return "var(--primary)";
    if (Number(temp) <= 20) return "var(--success)";
    if (Number(temp) <= 30) return "var(--warning)";
    return "var(--danger)";
  };

  return (
    <Flex className={style.prediction__container}>
      {isError ? (
        <div>无法获取农场定位，请检查网络或联系管理员！</div>
      ) : (
        predictions.map((p) => (
          <div className={style.prediction__item} key={p.fxDate}>
            <div className={style.prediction__title}>
              <div style={{ color: "var(--font-color)", fontSize: "1.2rem" }}>{p.fxDate}</div>
              <div>
                今日最高最低气温预测：
                <span style={{ color: calcColor(p.tempMin) }}>{p.tempMin}</span>℃
                <span>&nbsp;~&nbsp;</span>
                <span style={{ color: calcColor(p.tempMax) }}>{p.tempMax}</span>℃
              </div>
            </div>
            <Divider />
            <div className={style.prediction__content}>
              <div className={style["prediction__content-left"]}>
                <span style={{ color: "black", fontSize: "1.1rem" }}>日夜间天气情况：</span>
                <div>
                  日间：<i className={`qi-${p.iconDay}`}></i>&nbsp;&nbsp;
                  {p.textDay}&nbsp;&nbsp;
                  {`${p.windDirDay} ${p.windScaleDay} 级`}
                </div>
                <div>
                  夜间：<i className={`qi-${p.iconNight}`}></i>&nbsp;&nbsp;
                  {p.textNight}&nbsp;&nbsp;
                  {`${p.windDirNight} ${p.windScaleNight} 级`}
                </div>
              </div>
              <div className={style["prediction__content-right"]}>
                <span style={{ color: "black", fontSize: "1.1rem" }}>常规数据：</span>
                <div>
                  <div>湿度{p.humidity}% </div>
                  <div>降水量{p.precip}mm</div>
                  <div>能见度{p.vis}km</div>
                  <div>大气压{p.pressure}hPa</div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </Flex>
  );
}

export default WeatherPrediction;
