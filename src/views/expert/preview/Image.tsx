import { Carousel, Divider, Flex, Image as ImageAntd } from "antd";

interface Props {
  urls: string;
}
export default function Image(props: Props) {
  const urls = props.urls.split(",");
  const images = urls.length === 0 ? [] : urls;

  return (
    <Flex vertical style={{ flexGrow: 1, maxWidth: "45%" }}>
      <Carousel arrows infinite>
        {images.map((img) => img !== "" && <ImageAntd width="90%" alt="作物图像" src={img} />)}
      </Carousel>
      <div style={{ width: "90%" }}>
        <Divider />
      </div>
      <div>
        <span style={{ color: "#dd0000" }}>*&nbsp;&nbsp;</span>作物记录图像
        <Divider orientation="vertical" />
        <span>点击可预览大图</span>
        <Divider orientation="vertical" />
        <span
          style={{
            fontSize: "0.6rem",
            color: "#555",
            backgroundColor: "#eee",
            width: "max-content",
            padding: "2px 5px",
            borderRadius: 4,
            marginBottom: 5,
          }}>
          共 {urls.length} 张
        </span>
      </div>
    </Flex>
  );
}
