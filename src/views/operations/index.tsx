import { useEffect, useState } from "react";

import GuidanceBox from "./GuidanceBox";
import type { Guidance } from "./GuidanceBox";

import style from "./index.module.css";
import { request } from "@/utils/reqeust";
import { useUser } from "@/store";

import { Flex, Card } from "antd";

type GuidanceSet = {
    body: Guidance[];
    fertile: Guidance[];
    park: Guidance[];
    pest: Guidance[];
};

type GuidanceResult = {
    code: number;
    msg: null;
    data: GuidanceSet;
};
const Operations = () => {
    const farmId = useUser((state) => state.currentFarmId)!;
    const farmType = useUser((state) => state.farms).find((f) => f.id === farmId)!.type;
    const month = new Date().getMonth();

    const [guideList, setGuideList] = useState<GuidanceSet>({
        body: [],
        fertile: [],
        park: [],
        pest: [],
    });
    useEffect(() => {
        request
            .get<GuidanceResult>(
                `/guidance/get?farmId=${farmId}&farmType=${farmType}&month=${month}`,
            )
            .then((res) => {
                setGuideList(res.data);
            });
    }, []);

    // validate iframe is working or not
    const [hasExpert, setHasExpert] = useState(false);
    return (
        <Flex className={style.container}>
            <Flex className={style.box__container}>
                <GuidanceBox
                    list={guideList.body}
                    type="树体管理"
                    iconClass="ri-tree-fill"
                />
                <GuidanceBox
                    list={guideList.fertile}
                    type="水肥管理"
                    iconClass="ri-cloud-fill"
                />
                <GuidanceBox
                    list={guideList.pest}
                    type="病虫管理"
                    iconClass="ri-bug-2-fill"
                />
                <GuidanceBox
                    list={guideList.park}
                    type="清园操作"
                    iconClass="ri-parking-box-fill"
                />
            </Flex>
            <Card
                title={
                    <i
                        className="ri-user-2-fill"
                        style={{ color: "var(--primary)" }}>
                        &nbsp;&nbsp;问专家
                    </i>
                }>
                {!hasExpert && (
                    <div style={{ color: "var(--danger)" }}>问专家平台出错，请联系管理员！</div>
                )}
                <iframe
                    className={style.expert__iframe}
                    src="https://chat.archivemodel.cn"
                    onLoad={(e) => {
                        const iframe = e.currentTarget;
                        try {
                            if (
                                !iframe.contentDocument ||
                                iframe.contentDocument.body.innerHTML === ""
                            ) {
                                setHasExpert(false);
                            } else {
                                setHasExpert(true);
                            }
                        } catch {
                            setHasExpert(false);
                        }
                    }}></iframe>
            </Card>
        </Flex>
    );
};

export default Operations;
