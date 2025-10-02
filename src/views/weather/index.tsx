import style from "./index.module.css";

import WeatherPrediction from "./WeatherPredcition";
import WeatherIntroBox from "./WeatherIntroBox";
import TemperatureChart from "./TemperatureChart";

function Weather() {
  return (
    <div className={style.container}>
      <div className={style.content__left}>
        <div className="title">
          <i className="ri-sun-foggy-fill"></i>&nbsp;&nbsp;天气预报
        </div>
        <WeatherPrediction />
        <div className="line"></div>
      </div>

      <div className={style.content__right}>
        <div className="title">
          <i className="ri-information-2-fill"></i>&nbsp;&nbsp;物候期详情
        </div>
        <div className="box">
          <WeatherIntroBox />
        </div>
        <div className="line"></div>

        <div className="title">
          <i className="ri-line-chart-fill"></i>
          &nbsp;&nbsp;积温曲线
        </div>
        <div className={style["chart__container-special"]}>
          <TemperatureChart />
        </div>
      </div>
    </div>
  );
}

export default Weather;
