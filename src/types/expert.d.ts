interface PendingCase {
    requestId: string;
    uploadTime: string;
    imageCount: number;
    generateTime: string;
    revisionCount: number;
}
interface CasesStore {
    total: number;
    list: PendingCase[];
    pageNum: number;
    pageSize: number;
    size: number;
    startRow: number;
    endRow: number;
    pages: number;
    prePage: number;
    nextPage: number;
    isFirstPage: boolean;
    isLastPage: boolean;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    navigatePages: number;
    navigatepageNums: number[];
    navigateFirstPage: number;
    navigateLastPage: number;
}
interface CasesStoreResult {
    code: number;
    data: CasesStore;
    msg: null;
}

interface CaseContent {
    userRequestInfo: {
        requestId: string;
        imageUrls: string;
        uploadTime: string;
        status: 1;
    };
    initialResultInfo: {
        jsonData: string;
        modelVersion: string;
    };
    revisionRecords: [];
    onClear: () => void;
}
interface CaseContentResult {
    code: number;
    data: CaseContent;
    msg: null;
}

interface RevisionTextContent {
    plant_validation: {
        consistent: boolean;
        message: string;
        details: string;
        confidence: 0.68032;
    };
    analysis_result: {
        树种识别: {
            种类: string;
            置信度: string;
        };
        图像质量诊断: {
            图像完整性: string;
            图像清晰度: string;
            光照条件: string;
            拍摄建议: string;
        };
        当前生长阶段: string;
        长势诊断: {
            冠层结构: string;
            枝条形态: string;
            新稍生长: string;
            花芽生长: string;
            长势综合判断: string;
        };
        叶部状态诊断: {
            叶色: string;
            叶面积大小: string;
            叶面病斑比例: string;
            叶片状态总结: string;
        };
        果实状态诊断: {
            挂果量: string;
            果实大小: string;
            果实色泽: string;
            异常果实比例: string;
        };
        营养状况诊断: {
            氮素状态: string;
            磷素状态: string;
            钾素状态: string;
            中微量元素: string;
        };
        病虫害诊断: {
            疑似病害: string;
            病斑描述: string;
            虫害迹象: string;
            病害严重度: string;
        };
        果叶比与树体评估: {
            可见叶片数估计: string;
            可见果实数估计: string;
            果叶比估计: string;
            是否合理: string;
        };
        综合建议: {
            施肥建议: string;
            病害处理建议: string;
            树势提升建议: string;
            补充说明: string;
        };
        回答置信度: string;
    };
    validation: {
        plant_type: string;
        quality: string;
        count: string;
    };
}
