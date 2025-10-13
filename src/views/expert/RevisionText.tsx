import { Button, Form, Input } from "antd";
import LeftDivider from "./LeftDevider";
import TextArea from "antd/es/input/TextArea";

export default function RevisionText(props: { content: string }) {
    const jsonData: RevisionTextContent = JSON.parse(props.content);
    console.log(jsonData);

    // TODO: transform to embeded object type
    return (
        <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            initialValues={{
                叶片状态总结: jsonData.analysis_result.叶部状态诊断.叶片状态总结,
                叶色: jsonData.analysis_result.叶部状态诊断.叶色,
                叶面病斑比例: jsonData.analysis_result.叶部状态诊断.叶面病斑比例,
                叶面积大小: jsonData.analysis_result.叶部状态诊断.叶面积大小,
                种类: jsonData.analysis_result.树种识别.种类,
                图像完整性: jsonData.analysis_result.图像质量诊断.图像完整性,
                图像清晰度: jsonData.analysis_result.图像质量诊断.图像清晰度,
                光照条件: jsonData.analysis_result.图像质量诊断.光照条件,
                拍摄建议: jsonData.analysis_result.图像质量诊断.拍摄建议,
                当前生长阶段: jsonData.analysis_result.当前生长阶段,
                冠层结构: jsonData.analysis_result.长势诊断.冠层结构,
                枝条形态: jsonData.analysis_result.长势诊断.枝条形态,
                新稍生长: jsonData.analysis_result.长势诊断.新稍生长,
                花芽生长: jsonData.analysis_result.长势诊断.花芽生长,
                长势综合判断: jsonData.analysis_result.长势诊断.长势综合判断,
                挂果量: jsonData.analysis_result.果实状态诊断.挂果量,
                果实大小: jsonData.analysis_result.果实状态诊断.果实大小,
                果实色泽: jsonData.analysis_result.果实状态诊断.果实色泽,
                异常果实比例: jsonData.analysis_result.果实状态诊断.异常果实比例,
                氮素状态: jsonData.analysis_result.营养状况诊断.氮素状态,
                磷素状态: jsonData.analysis_result.营养状况诊断.磷素状态,
                钾素状态: jsonData.analysis_result.营养状况诊断.钾素状态,
                中微量元素: jsonData.analysis_result.营养状况诊断.中微量元素,
                疑似病害: jsonData.analysis_result.病虫害诊断.疑似病害,
                病斑描述: jsonData.analysis_result.病虫害诊断.病斑描述,
                虫害迹象: jsonData.analysis_result.病虫害诊断.虫害迹象,
                病害严重度: jsonData.analysis_result.病虫害诊断.病害严重度,
                可见叶片数估计: jsonData.analysis_result.果叶比与树体评估.可见叶片数估计,
                可见果实数估计: jsonData.analysis_result.果叶比与树体评估.可见果实数估计,
                果叶比估计: jsonData.analysis_result.果叶比与树体评估.果叶比估计,
                是否合理: jsonData.analysis_result.果叶比与树体评估.是否合理,
                施肥建议: jsonData.analysis_result.综合建议.施肥建议,
                病害处理建议: jsonData.analysis_result.综合建议.病害处理建议,
                树势提升建议: jsonData.analysis_result.综合建议.施肥建议,
                补充说明: jsonData.analysis_result.综合建议.补充说明,
            }}
            onFinish={(values) => {
                console.log("form", values);
            }}
            style={{ maxWidth: "100%" }}>
            <LeftDivider
                text="叶部状态诊断
"
            />
            <Form.Item
                label="叶片状态总结"
                name="叶片状态总结">
                <TextArea rows={2} />
            </Form.Item>
            <Form.Item
                label="叶色"
                name="叶色">
                <Input />
            </Form.Item>
            <Form.Item
                label="叶面病斑比例"
                name="叶面病斑比例">
                <Input />
            </Form.Item>
            <Form.Item
                label="叶面积大小"
                name="叶面积大小">
                <Input />
            </Form.Item>

            <LeftDivider text="图像质量诊断" />
            <Form.Item
                label="光照条件"
                name="光照条件">
                <Input />
            </Form.Item>
            <Form.Item
                label="图像完整性"
                name="图像完整性">
                <TextArea rows={2} />
            </Form.Item>
            <Form.Item
                label="图像清晰度"
                name="图像清晰度">
                <Input />
            </Form.Item>
            <Form.Item
                label="拍摄建议"
                name="拍摄建议">
                <Input />
            </Form.Item>

            <LeftDivider text="果叶比与树体评估" />
            <Form.Item
                label="可见叶片数估计"
                name="可见叶片数估计">
                <Input />
            </Form.Item>
            <Form.Item
                label="可见果实数估计"
                name="可见果实数估计">
                <Input />
            </Form.Item>
            <Form.Item
                label="是否合理"
                name="是否合理">
                <Input />
            </Form.Item>
            <Form.Item
                label="果叶比估计"
                name="果叶比估计">
                <Input />
            </Form.Item>
            <Form.Item
                label="当前生长阶段"
                name="当前生长阶段">
                <Input />
            </Form.Item>

            <LeftDivider text="果实状态诊断" />
            <Form.Item
                label="异常果实比例"
                name="异常果实比例">
                <Input />
            </Form.Item>
            <Form.Item
                label="挂果量"
                name="挂果量">
                <Input />
            </Form.Item>
            <Form.Item
                label="果实大小"
                name="果实大小">
                <Input />
            </Form.Item>
            <Form.Item
                label="果实色泽"
                name="果实色泽">
                <TextArea rows={2} />
            </Form.Item>

            <LeftDivider text="树种识别" />
            <Form.Item
                label="种类"
                name="种类">
                <Input />
            </Form.Item>

            <LeftDivider text="病虫害诊断" />
            <Form.Item
                label="疑似病害"
                name="疑似病害">
                <Input />
            </Form.Item>
            <Form.Item
                label="病害严重度"
                name="病害严重度">
                <Input />
            </Form.Item>
            <Form.Item
                label="病斑描述"
                name="病斑描述">
                <TextArea rows={2} />
            </Form.Item>
            <Form.Item
                label="虫害迹象"
                name="虫害迹象">
                <Input />
            </Form.Item>

            <LeftDivider text="营养状况诊断" />
            <Form.Item
                label="中微量元素"
                name="中微量元素">
                <TextArea rows={2} />
            </Form.Item>
            <Form.Item
                label="氮素状态"
                name="氮素状态">
                <TextArea rows={2} />
            </Form.Item>
            <Form.Item
                label="磷素状态"
                name="磷素状态">
                <TextArea rows={2} />
            </Form.Item>
            <Form.Item
                label="钾素状态"
                name="钾素状态">
                <TextArea rows={2} />
            </Form.Item>

            <LeftDivider text="长势诊断" />
            <Form.Item
                label="冠层结构"
                name="冠层结构">
                <Input />
            </Form.Item>
            <Form.Item
                label="新稍生长"
                name="新稍生长">
                <Input />
            </Form.Item>
            <Form.Item
                label="枝条形态"
                name="枝条形态">
                <Input />
            </Form.Item>
            <Form.Item
                label="花芽生长"
                name="花芽生长">
                <Input />
            </Form.Item>
            <Form.Item
                label="长势综合判断"
                name="长势综合判断">
                <Input />
            </Form.Item>

            <LeftDivider text="综合建议" />
            <Form.Item
                label="施肥建议"
                name="施肥建议">
                <TextArea rows={2} />
            </Form.Item>
            <Form.Item
                label="树势提升建议"
                name="树势提升建议">
                <TextArea rows={2} />
            </Form.Item>
            <Form.Item
                label="病害处理建议"
                name="病害处理建议">
                <TextArea rows={2} />
            </Form.Item>
            <Form.Item
                label="补充说明"
                name="补充说明">
                <TextArea rows={2} />
            </Form.Item>

            <Button
                type="primary"
                htmlType="submit">
                提价结果
            </Button>
        </Form>
    );
}
