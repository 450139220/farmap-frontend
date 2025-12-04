// import VideoPlayer from "./official/VideoPlayer";
import { useEffect, useRef } from "react";
import Ocx, { type OcxOptions } from "./official/ocx";

const ocxOptions: OcxOptions = {
  el: "video-player",
  width: 300,
  height: 300,
  autoLoad: false,
  iServicePortStart: 14460,
  iServicePortEnd: 14460,
  success: () => {
    console.log("sueccess");
  },
  error: () => {
    console.log("error");
  },
  callback: (data: any, ocx: Ocx) => {
    console.log("callback");
  },
  afterCreateWnd: (ocx: Ocx) => {
    console.log("afterCreateWnd");
  },
};
const requestParams = {
  funcName: "HikYun_ParamBeforCreatWnd",
  arguments: {
    showMode: 0,
    moduleIndex: 0,
    defaultStreamType: 0,
    artemisToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJzY29wZSJdLCJleHAiOjE2MDY5NTI5MjMsImp0aSI6IjY1YmFiMzdmLWEwNTMtNDc3YS04NmIyLTE5OGY5YWQ3N2E2NSIsImNsaWVudF9pZCI6IjIwMjc4NDAwIn0.DAWTbPoCyMusMrw0_4BILCQ2VMHJtmPq6cx4mckwe8k",
    artemisUrl: "https://open-gn.hikyun.com/artemis",
    productCode: "demo1",
    projectId: 223903434873056,
    strAuthorization:
      "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBdXRob3JpemF0aW9uIiwicGF5bG9hZCI6IntcImRlcGFydG1lbnRJZFwiOjQ2MTE5MDk5MjE4NjIyNjA5NjAsXCJleHBpcmVkXCI6MzAsXCJuaWNrTmFtZVwiOlwiYWRtaW4gc2hvdWxkXCIsXCJwcm9kdWN0Q29kZVwiOlwiZGVtbzFcIixcInByb2plY3RJZFwiOjIyMzkwMzQzNDg3MzA1NixcInJlbGF0aW9uVHlwZVwiOjAsXCJzaG93UHJpdmFjeUFndFwiOnRydWUsXCJzaG93VHJpYWxBZ3RcIjpmYWxzZSxcInRpbWVcIjpcIjE2MDY5MDk1MTcwNDRcIixcInR5cGVcIjoxLFwidXNlcklkXCI6MjI0MTc4MzEyNzgwMDAwLFwidXNlck5hbWVcIjpcImFkbWluXCIsXCJ1c2VyVHlwZVwiOjB9In0.heU7kSMxADT8rCE5TcWrb4oHa6EKCNRjm6kYwxjtzX80C1YeJnNUNev67tMnlEgYZ89a2WbFoqXp3VlLlos2Cw",
    keepLiveUrl: "https://zh-gn.hikyun.com",
    userIndexCode: "224178312780000",
    needPictureResult: 1,
    notifyPlayBackTimes: 10,
  },
};

export default function index() {
  const ocxContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ocxContainerRef.current) return;
    const ocx = new Ocx({ ...ocxOptions, el: ocxContainerRef.current.id });
    ocx.run();
    // ocx.request(requestParams);
  }, []);

  return (
    <>
      <div>index</div>
      <div
        id="video-player" // 建议保持 ID 与 ocx.js 中的默认值一致
        ref={ocxContainerRef}
        style={{ width: "600px", height: "400px", border: "1px solid gray" }}>
        aa
      </div>
      {/* <VideoPlayer /> */}
    </>
  );
}
