import style from "./index.module.css";
import TemperatureChart from "./TemperatureChart";

import WeatherIntroBox from "./WeatherIntroBox";

function Weather() {
  return (
    <div className={style.container}>
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
      <TemperatureChart />
    </div>
  );
}

export default Weather;
