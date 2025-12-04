import type Ocx from "./ocx";
import { useOcx, type OcxOptions } from "./useOcx";
import { useMonitorStore } from "@/store/monitor";

export default function MonitorPlayer() {
  const initData = useMonitorStore((state) => state.initData);

  const ocxOptions: OcxOptions = {
    el: "video-player",
    width: 300,
    height: 300,
    autoLoad: true,
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

  // 2. 使用 Hook，获取容器 ref 和 Ocx 实例
  const { ocxContainerRef, ocxInstance } = useOcx(ocxOptions);

  // 3. 示例：使用 ocxInstance 执行操作
  const handleCut = () => {
    if (ocxInstance) {
      ocxInstance.cut(10, 10, 100, 100);
      console.log("Called ocxInstance.cut()");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>视频播放器</h2>
      <p>当前 Artmis URL: **{initData?.artemisUrl || "N/A"}**</p>

      {/* 4. 将 ref 绑定到 DOM 元素 */}
      <div
        id="video-player" // 建议保持 ID 与 ocx.js 中的默认值一致
        ref={ocxContainerRef}
        style={{ width: "600px", height: "400px", border: "1px solid gray" }}
      />

      <button
        onClick={handleCut}
        disabled={!ocxInstance}>
        执行裁剪 (Cut)
      </button>
    </div>
  );
}
