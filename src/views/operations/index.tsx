import { useEffect, useState } from "react";

import GuidanceBox from "./GuidanceBox";
import type { Guidance } from "./GuidanceBox";

import style from "./index.module.css";
import { request } from "@/utils/reqeust";
import { useUser } from "@/store";

const Operations = () => {
  const farmId = useUser((state) => state.currentFarmId)!;
  const farmType = useUser((state) => state.farms)[farmId].type;
  const month = new Date().getMonth();

  const [guideList, setGuideLis] = useState<Guidance[]>([]);
  useEffect(() => {
    request
      .get<Guidance[]>(`/guidance/get?farmId=${farmId}&farmType=${farmType}&month=${month}`)
      .then((res) => {
        console.log(res);
      });
  }, []);
  return (
    <>
      <GuidanceBox />
    </>
  );
};

export default Operations;
