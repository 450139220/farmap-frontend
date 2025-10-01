import { useEffect, useRef, useState } from "react";

import { useUser } from "@/store";
import { useToken } from "@/utils/permanence";
import { request } from "@/utils/reqeust";

import style from "./index.module.css";

type AccumulatedTemp = {
  id: number;
  date: string;
  accTemp: number;
};
type YearlyAccTemp = {
  last: AccumulatedTemp[];
  thisYear: AccumulatedTemp[];
};
type AccTempResult = {
  code: number;
  msg: null;
  data: YearlyAccTemp;
};
function TemperatureChar() {
  const [token, _] = useToken();
  const farmId = useUser((state) => state.currentFarmId);
  const farmType = useUser((state) => state.farms).find((f) => f.id === farmId)?.type;

  // store the accumulated temperature data
  const [accTemp, setAccTemp] = useState<YearlyAccTemp>({ last: [], thisYear: [] });
  useEffect(() => {
    // fetch data
    request
      .get<AccTempResult>(`/weather/accumulated-temperature?farmType=${farmType}`, token)
      .then((data) => {
        setAccTemp(data.data);
      });

    // draw canvas
    if (canvasRef.current) {
      const chart = new AccTempChart(canvasRef.current);
      chart.see();
    }
  }, []);

  class AccTempChart {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D | null;
    constructor(canvas: HTMLCanvasElement) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
    }
    see() {
      console.log(this.canvas);
    }
  }
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  return (
    <canvas
      ref={canvasRef}
      className={style.canvas__contaienr}
      height={300}></canvas>
  );
}

export default TemperatureChar;
