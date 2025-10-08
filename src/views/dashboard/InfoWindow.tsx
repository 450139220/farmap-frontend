import style from "./index.module.css";

export type InfoWindowProps = {
  id: number;
  date: string;
  // this url stands for crop image's url
  url: string;
  info: {
    // TODO: the same as index.tsx_LINE_16
    diseases: string;
    rate: number;
    size: number;
    yield: number;
  };
};
function InfoWindow(props: InfoWindowProps) {
  return (
    <div className={`box ${style.infowindow__container}`}>
      <div className={style.infowindow__data}>
        <span>作物数据：</span>
        <div className={style.infowindow__datacontent}>
          <div>更新日期：{props.date}</div>
          <div className={style.infowindow__infocontent}>
            <span>
              病虫害种类：
              {props.info.diseases === "none" || !props.info.diseases
                ? "暂无"
                : props.info.diseases}
            </span>
            <span>病虫害率：{props.info.rate} %</span>
          </div>
          <div className={style.infowindow__infocontent}>
            <span>冠层大小：{props.info.size} 米</span>
            <span>产量数量：{props.info.yield} 颗</span>
          </div>
        </div>
      </div>
      <div className={style.infowindow__img}>
        <div>详细展示：</div>
        <img
          src={props.url || "public/react.svg"}
          alt="作物图片"
        />
      </div>
    </div>
  );
}

export default InfoWindow;
