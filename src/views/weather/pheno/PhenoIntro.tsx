import { Flex } from "antd";
import SeasonWheel from "./SeasenWheel";
import { useFarmStore } from "@/store/farm";
import { useEffect, useMemo, useState } from "react";
import { req, Request } from "@/utils/reqeust";

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

export default function PhenoIntro() {
  // Season wheel event
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const onMonthChange = (month: number): void => {
    setSelectedMonth(month);
  };

  // Introductions
  const farmId = useFarmStore((s) => s.id);
  // Store introductions
  const [introList, setIntroList] = useState<WeatherIntro[]>([]);
  useEffect(() => {
    req
      .get<WeatherIntroResult>(`/weather/intro?farmId=${farmId}`)
      .then((res) => {
        // This is for reshaping the strange response structure
        const list: WeatherIntro[] = [];
        res.data.intro.forEach((i) => {
          list.push(...i);
        });
        setIntroList(list);
      })
      .catch(() => {});
  }, []);

  // Update introduction text when selected month changes
  const introText = useMemo(
    () => introList[selectedMonth]?.text ?? "服务出错，暂未获得物候期信息。",
    [selectedMonth],
  );
  const intro = <div>{introText}</div>;

  return (
    <Flex>
      <SeasonWheel onMonthChange={onMonthChange} />
      <div>{intro}</div>
    </Flex>
  );
}
