import React, { useMemo } from "react";
import {
  Leaf,
  Sprout,
  AlertCircle,
  ThermometerSun,
  Microscope,
  Activity,
  Bug,
  ClipboardCheck,
  Droplet,
  Info,
} from "lucide-react";
import type { PlantAnalysisData } from "@/types/model";

interface PlantReportProps {
  jsonString: string;
}

const PlantReport: React.FC<PlantReportProps> = ({ jsonString }) => {
  const data: PlantAnalysisData | null = useMemo(() => {
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse JSON", e);
      return null;
    }
  }, [jsonString]);

  // 1. JSON Parse Error Fallback
  if (!data) {
    return (
      <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg border border-red-200">
        <AlertCircle className="w-10 h-10 mx-auto mb-2" />
        <p>无法解析数据，请检查输入格式。</p>
      </div>
    );
  }

  const { plant_validation } = data;

  // 2. Logic/Data Error Fallback (Partial Data or Inconsistent)
  // If analysis_result or validation is missing, we show the validation error/info card.
  if (!data.analysis_result || !data.validation) {
    return (
      <div className=" mx-auto animate-fade-in w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
          <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex items-center justify-center gap-2">
            <AlertCircle className="text-orange-500" size={24} />
            <h2 className="font-semibold text-orange-800 text-lg">无法完成详细分析</h2>
          </div>

          <div className="p-8 text-center">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {plant_validation.message || "检测未通过"}
              </h3>
              <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 inline-block text-left w-full">
                <Info className="w-4 h-4 inline mr-2 text-gray-400" />
                {plant_validation.details || "无详细信息"}
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-500 shadow-sm">
              <Microscope size={14} />
              <span>
                AI 置信度:{" "}
                <span className="font-mono font-medium text-gray-700">
                  {plant_validation.confidence?.toFixed(2) ?? "0.00"}
                </span>
              </span>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">请尝试重新拍摄清晰、完整的植物照片后再次上传。</p>
          </div>
        </div>
      </div>
    );
  }

  // 3. Success State
  const result = data.analysis_result;
  const validation = data.validation;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header Section */}
      <header className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-nature-100 text-nature-800 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
              AI Diagnosis
            </span>
            <span className="text-gray-400 text-xs flex items-center gap-1">
              <Microscope size={12} /> 置信度: {plant_validation.confidence.toFixed(2)}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            {result.树种识别.种类}
            <span className="text-lg font-normal text-gray-500">({result.当前生长阶段})</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-500">综合长势</div>
            <div
              className={`font-semibold text-lg ${
                result.长势诊断.长势综合判断 === "强"
                  ? "text-green-600"
                  : result.长势诊断.长势综合判断 === "弱"
                    ? "text-amber-600"
                    : "text-gray-700"
              }`}>
              {result.长势诊断.长势综合判断}
            </div>
          </div>
          <div className="h-10 w-px bg-gray-200"></div>
          <div className="text-right">
            <div className="text-sm text-gray-500">图像质量</div>
            <div className="font-semibold text-lg text-gray-700">
              {validation.quality.includes("通过") ? "合格" : "需改善"}
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Growth & Structure */}
        <Card title="长势诊断" icon={<Activity className="text-blue-500" />}>
          <DetailRow label="冠层结构" value={result.长势诊断.冠层结构} />
          <DetailRow label="枝条形态" value={result.长势诊断.枝条形态} />
          <DetailRow label="新稍生长" value={result.长势诊断.新稍生长} />
          <DetailRow label="花芽状况" value={result.长势诊断.花芽生长} />
        </Card>

        {/* Leaves */}
        <Card title="叶部状态" icon={<Leaf className="text-nature-600" />}>
          <DetailRow label="叶色" value={result.叶部状态诊断.叶色} />
          <DetailRow label="面积" value={result.叶部状态诊断.叶面积大小} />
          <DetailRow
            label="病斑比例"
            value={result.叶部状态诊断.叶面病斑比例}
            warning={parseInt(result.叶部状态诊断.叶面病斑比例) > 10}
          />
          <p className="mt-3 text-xs text-gray-500 bg-gray-50 p-2 rounded">
            {result.叶部状态诊断.叶片状态总结}
          </p>
        </Card>

        {/* Fruit */}
        <Card title="果实状态" icon={<Sprout className="text-pink-500" />}>
          <DetailRow label="挂果量" value={result.果实状态诊断.挂果量} />
          <DetailRow label="大小" value={result.果实状态诊断.果实大小} />
          <DetailRow label="色泽" value={result.果实状态诊断.果实色泽} />
          <DetailRow label="异常比例" value={result.果实状态诊断.异常果实比例} />
        </Card>

        {/* Nutrition */}
        <Card title="营养状况" icon={<Droplet className="text-cyan-500" />}>
          <div className="space-y-3">
            <NutrientBadge label="氮 (N)" status={result.营养状况诊断.氮素状态} />
            <NutrientBadge label="磷 (P)" status={result.营养状况诊断.磷素状态} />
            <NutrientBadge label="钾 (K)" status={result.营养状况诊断.钾素状态} />
            <NutrientBadge label="微量元素" status={result.营养状况诊断.中微量元素} />
          </div>
        </Card>

        {/* Pests & Diseases */}
        <Card title="病虫害诊断" icon={<Bug className="text-red-500" />}>
          <div className="bg-red-50 border border-red-100 rounded-lg p-3 mb-3">
            <div className="flex justify-between items-start">
              <span className="text-red-800 font-medium">{result.病虫害诊断.疑似病害}</span>
              <span className="text-xs bg-red-200 text-red-800 px-1.5 py-0.5 rounded">
                {result.病虫害诊断.病害严重度}
              </span>
            </div>
            <p className="text-xs text-red-600 mt-1">{result.病虫害诊断.病斑描述}</p>
          </div>
          <DetailRow label="虫害迹象" value={result.病虫害诊断.虫害迹象} />
        </Card>

        {/* Ratio Assessment */}
        <Card title="果叶比评估" icon={<ClipboardCheck className="text-purple-500" />}>
          <div className="flex justify-between items-center mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {result.果叶比与树体评估.可见叶片数估计}
              </div>
              <div className="text-xs text-gray-400">预估叶片</div>
            </div>
            <div className="text-gray-300">/</div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {result.果叶比与树体评估.可见果实数估计}
              </div>
              <div className="text-xs text-gray-400">预估果实</div>
            </div>
          </div>
          <DetailRow label="当前比率" value={result.果叶比与树体评估.果叶比估计} />
          <div
            className={`mt-2 text-sm p-2 rounded ${
              result.果叶比与树体评估.是否合理.includes("合理")
                ? "bg-green-50 text-green-700"
                : "bg-amber-50 text-amber-700"
            }`}>
            {result.果叶比与树体评估.是否合理}
          </div>
        </Card>
      </div>

      {/* Recommendations Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-nature-100 overflow-hidden">
        <div className="bg-nature-50 px-6 py-4 border-b border-nature-100 flex items-center gap-2">
          <ThermometerSun className="text-nature-700" size={20} />
          <h2 className="font-semibold text-nature-900">综合养护建议</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <RecommendationBlock
            title="施肥建议"
            content={result.综合建议.施肥建议}
            dotColor="bg-blue-400"
          />
          <RecommendationBlock
            title="病害处理"
            content={result.综合建议.病害处理建议}
            dotColor="bg-red-400"
          />
          <RecommendationBlock
            title="树势提升"
            content={result.综合建议.树势提升建议}
            dotColor="bg-nature-500"
          />
          <RecommendationBlock
            title="特别注意"
            content={result.综合建议.补充说明}
            dotColor="bg-amber-400"
          />
        </div>
      </div>
    </div>
  );
};

// --- Subcomponents for Clean Layout ---

const Card: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({
  title,
  icon,
  children,
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-50">
      {icon}
      <h3 className="font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="space-y-3">{children}</div>
  </div>
);

const DetailRow: React.FC<{ label: string; value: string; warning?: boolean }> = ({
  label,
  value,
  warning,
}) => (
  <div className="flex flex-col sm:flex-row sm:justify-between text-sm gap-1 sm:gap-4">
    <span className="text-gray-500 min-w-fit">{label}</span>
    <span className={`text-right ${warning ? "text-amber-600 font-medium" : "text-gray-700"}`}>
      {value}
    </span>
  </div>
);

const NutrientBadge: React.FC<{ label: string; status: string }> = ({ label, status }) => {
  const isDeficient = status.includes("缺") || status.includes("少") || status.includes("失绿");
  return (
    <div className="flex justify-between items-start text-sm">
      <span className="text-gray-600 font-medium">{label}</span>
      <span
        className={`text-right max-w-[70%] ${isDeficient ? "text-amber-600" : "text-green-600"}`}>
        {status}
      </span>
    </div>
  );
};

const RecommendationBlock: React.FC<{ title: string; content: string; dotColor: string }> = ({
  title,
  content,
  dotColor,
}) => (
  <div className="flex gap-3">
    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${dotColor}`}></div>
    <div>
      <h4 className="font-medium text-gray-900 mb-1">{title}</h4>
      <p className="text-sm text-gray-600 leading-relaxed">{content}</p>
    </div>
  </div>
);

export default PlantReport;
