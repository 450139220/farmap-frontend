import { useUser } from "@/store";
import { useEffect, useState } from "react";

import style from "./index.module.css";

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
  // inits
  const farmId = useUser((state) => state.currentFarmId);
  const location = useUser((state) => state.farms).find((f) => f.id === farmId)?.center;

  // store 3 days weathers
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  // for error
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
    <>
      <div className={style.prediction__container}>
        {isError ? (
          <div className={style.tip}>获取天气信息错误，请检查网络或联系管理员！</div>
        ) : (
          predictions.map((p) => (
            <div
              key={p.fxDate}
              className="box"
              style={{ color: "var(--light-font)", fontSize: "1rem" }}>
              <div style={{ color: "var(--font-color)" }}>{p.fxDate}</div>
              <div>
                <span style={{ color: calcColor(p.tempMin) }}>{p.tempMin}</span>℃
                <span>&nbsp;~&nbsp;</span>
                <span style={{ color: calcColor(p.tempMax) }}>{p.tempMax}</span>℃
              </div>
              <div>
                <span className={style.prediction__title}>日夜间天气情况：</span>
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
              <div>
                <span className={style.prediction__title}>常规数据：</span>
                <div className={style.normal__container}>
                  <div>湿度{p.humidity}% </div>
                  <div>降水量{p.precip}mm</div>
                  <div>能见度{p.vis}km</div>
                  <div>大气压{p.pressure}hPa</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default WeatherPrediction;
