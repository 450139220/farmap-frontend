import { useState, useEffect, useRef } from "react";
import { request } from "@/utils/reqeust";
import { useToken } from "@/utils/permanence";
import { useUser } from "@/store";

import style from "./index.module.css";

interface WeatherIntro {
  id: number;
  text: string;
}
type WeatherIntroResult = {
  code: number;
  msg: null;
  data: {
    intro: WeatherIntro[][];
  };
};
function WeatherIntroBox() {
  const [token, _] = useToken();
  const farmId = useUser((state) => state.currentFarmId);

  const [tip, setTip] = useState<boolean>(false);

  // store introductions
  const [introList, setIntroList] = useState<WeatherIntro[]>([]);
  useEffect(() => {
    request
      .get<WeatherIntroResult>(`/weather/intro?farmId=${farmId}`, token)
      .then((res) => {
        // this is for reshaping the strange response structure
        const list: WeatherIntro[] = [];
        res.data.intro.forEach((i) => {
          list.push(...i);
        });
        setIntroList(list);
        setTip(false);
      })
      .catch(() => {
        setTip(true);
      });
  }, []);

  // 12 months
  const seasonGroup = [0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 0];
  const colorGroup = ["#2e66e1", "#58aa65", "#eaa052", "#de3030"];
  const months = new Array(12).fill(0).map((_, i) => ({
    id: i,
    name: i + 1 + " 月",
    colorIndex: seasonGroup[i],
  }));
  // set current introduction
  const curMonth = new Date().getMonth();
  const [introIndex, setIntroIndex] = useState<number>(curMonth);
  let timer = useRef<number | undefined>(undefined);
  const changeintroIndex = (i: number) => {
    setIntroIndex(i);
    if (timer) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setIntroIndex(curMonth);
    }, 5000);
  };

  return (
    <div className={style.intro__container}>
      {tip ? (
        <div className={style.tip}>获取数据错误，请检查网络或联系管理员！</div>
      ) : (
        <>
          <div className={style.petal__container}>
            <div className={style.petal__center}></div>
            <svg
              width={200}
              height={200}
              viewBox="0 0 200 200">
              {months.map((m) => {
                const angle = (m.id - 1) * 30;
                const r = 80;
                const cx = 100;
                const cy = 100;

                // calculate petal position and rotation
                const x = cx + r * Math.sin(((angle - 1) * Math.PI) / 180);
                const y = cy - r * Math.cos(((angle - 1) * Math.PI) / 180);
                const lx = cx + r * Math.sin(((angle - 30) * Math.PI) / 180);
                const ly = cy - r * Math.cos(((angle - 30) * Math.PI) / 180);

                // calculate text position and rotation
                const textRadius = r * 0.7;
                const textAngle = angle - 15; // middle angle of the petal sector
                const textX = cx + textRadius * Math.sin((textAngle * Math.PI) / 180);
                const textY = cy - textRadius * Math.cos((textAngle * Math.PI) / 180);
                const rotation = textAngle;

                return (
                  <g key={m.id}>
                    <path
                      d={`M${cx} ${cy} L${lx} ${ly} A${r} ${r} 0 0 1 ${x} ${y} Z`}
                      fill={colorGroup[m.colorIndex]}
                      className={style.petal}
                      style={{ transform: m.id === introIndex ? "scale(1.1)" : "" }}
                      onClick={() => {
                        changeintroIndex(m.id);
                      }}
                    />
                    <text
                      x={textX}
                      y={textY}
                      textAnchor="middle"
                      fontSize={16}
                      fill="var(--light-box)"
                      transform={`rotate(${rotation} ${textX} ${textY})`}
                      pointerEvents={"none"}>
                      {m.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div className={style.intro__text}>
            {introList.length !== 0 && <div>{introList[introIndex].text}</div>}
          </div>
        </>
      )}
    </div>
  );
}

export default WeatherIntroBox;
