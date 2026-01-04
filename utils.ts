import { TableRow } from './types';

// --- Realism Data Sets ---

const UNITS = [
  "华为技术有限公司", "北京小米机器人技术有限公司", "优必选科技", "达闼机器人", 
  "宇树科技", "之江实验室", "中国科学院自动化研究所", "科大讯飞股份有限公司",
  "追觅科技", "傅利叶智能", "乐聚机器人", "智元机器人",
  "国家机器人检测与评定中心", "深圳市人工智能行业协会", "上海交通大学",
  "哈尔滨工业大学", "普渡科技", "擎朗智能", "海康威视", "云迹科技",
  "极智嘉", "灵动科技", "九号公司", "天智航", "博实股份",
  "新松机器人", "埃斯顿自动化", "汇川技术", "美的集团", "格力电器"
];

const HANDLING_OPINIONS = [
  "采纳", "采纳", "采纳", "采纳", "部分采纳", 
  "部分采纳", "修改后采纳", "不采纳", "留作参考", "解释后维持原样",
  "建议在下个版本考虑", "提交工作组讨论", "采纳", "采纳", "需进一步验证"
];

const REMARKS = [
  "", "", "", "", "", "", "", "", 
  "需核实数据", "见会议纪要", "参考IEC标准", "一致性修改", 
  "待定", "术语统一", "格式调整", ""
];

const DUMMY_OPINIONS = [
  "建议明确“人形机器人”的具体定义，区分于普通双足机器人。",
  "4.2节中关于电池续航的测试条件描述不够具体，建议补充环境温度要求。",
  "“视觉感知”一词范围过大，建议细化为“深度视觉”和“RGB视觉”。",
  "图3中的坐标系标注方向与国际通用标准（ISO 8855）不一致，易造成混淆。",
  "5.1条目中的响应时间指标（<100ms）对于消费级产品过于严苛，建议放宽至200ms。",
  "建议增加关于数据安全和隐私保护的独立章节。",
  "文中多次出现的“力控”术语不统一，部分章节使用了“力矩控制”，建议统一。",
  "6.3.1 跌倒检测的准确率指标缺乏具体的测试数据集说明。",
  "建议删除关于具体芯片型号的推荐，保持标准的通用性。",
  "附录A中的算法流程图逻辑存在死循环风险，请重新核对。",
  "“自主导航”在室内复杂环境下的定义需要补充动态障碍物的场景。",
  "7.2 节的电磁兼容性（EMC）标准引用已过时，建议更新为GB/T 17626系列。",
  "建议对“行走速度”分档进行说明，区分“慢速”、“常速”和“快速”。",
  "表4中的负载能力单位标注错误，应为kg而非N。",
  "3.5 术语“本体感觉”定义晦涩，建议参照生物学定义简化。",
  "建议增加对机器人外壳材料阻燃等级的要求。",
  "8.1 远程控制的通信延迟要求未考虑网络抖动情况。",
  "建议补充关于机械臂末端执行器的通用接口标准。",
  "“人机交互”部分缺乏对语音识别抗噪能力的量化指标。",
  "5.4 节关于关节自由度（DOF）的计算方法有误，未包含手部自由度。",
  "建议引用最新发布的机器人操作系统（ROS 2）相关接口规范。",
  "文中关于“云端大脑”的描述过于理想化，建议增加离线运行的最低功能要求。",
  "9.2 包装运输测试标准建议增加跌落测试的高度分级。",
  "建议统一全文的单位符号，如“秒”统一用“s”，“小时”统一用“h”。",
  "4.5 节散热设计要求中，未考虑高温高湿环境下的降额使用。",
  "建议增加对机器人工作噪音的限制标准（如<60dB）。",
  "“情感计算”章节缺乏理论依据，建议作为资料性附录而非规范性内容。",
  "6.1 视觉传感器的分辨率要求应区分导航相机和交互相机。",
  "建议明确紧急停止按钮的物理位置和颜色规范。",
  "3.2 缩略语表中遗漏了“IMU”（惯性测量单元）的解释。",
  "建议补充机器人充电接口的防触电保护措施。",
  "5.2 节步态规划算法的稳定性判据建议采用ZMP（零力矩点）理论。",
  "建议增加对开源软件许可证合规性的说明。"
];

const DUMMY_SUGGESTIONS = [
  "修改为：“本标准所称人形机器人，是指具有类人躯干、双足行走能力及双臂操作能力的智能机器人。”",
  "建议补充：“测试环境温度应控制在 25±2℃，相对湿度 40%-60%。”",
  "建议将“视觉感知”修改为“环境感知系统”，并下设子条款描述不同传感器。",
  "请参照ISO 8855标准重新绘制图3，确保X轴指向前方，Z轴垂直向上。",
  "建议修改为：“在典型应用场景下，系统端到端响应时间宜小于200ms。”",
  "新增第10章“安全与隐私”，明确用户数据的采集、存储和传输规范。",
  "全文统一替换为“力矩控制（Torque Control）”。",
  "建议注明：“测试应基于公开数据集（如Fall-1k）或经CNAS认证的第三方测试集。”",
  "删除具体的硬件选型描述，改为描述性能指标要求。",
  "请修改流程图，增加判定节点的“否”分支回路。",
  "建议补充：“在包含人流密度大于0.5人/m²的动态场景下...”。",
  "将引用标准更新为 GB/T 17626.4-2018。",
  "建议增加定义：慢速（<0.5m/s）、常速（0.5-1.5m/s）、快速（>1.5m/s）。",
  "请将表4第3列单位修正为“kg”，并核对数值。",
  "修改定义为：“本体感觉是指机器人感知自身关节位置、速度及受力状态的能力。”",
  "增加：“外壳材料应符合UL94 V-0阻燃等级。”",
  "建议补充：“在5%丢包率网络环境下，控制指令到达率应大于95%。”",
  "建议增加附录B：机械臂末端法兰接口尺寸图。",
  "建议增加指标：“在90dB环境噪声下，唤醒率应大于95%。”",
  "请核对计算公式，建议明确自由度统计范围是否包含末端执行器。",
  "建议参考IEEE 1872-2015机器人本体论标准。",
  "建议增加条款：“在断网模式下，机器人应保持基本的避障和运动控制能力。”",
  "建议依据产品重量分级，20kg以上产品跌落测试高度定为76cm。",
  "请使用Word通配符功能批量替换全文单位符号。",
  "建议补充：“在环境温度超过40℃时，设备应具备自动降频保护功能。”",
  "修改为：“在距离机器人1米处测量，工作噪音不应超过55dB(A)。”",
  "建议将第8章内容整体移至附录C（资料性附录）。",
  "建议改为：“导航相机分辨率不低于720p，交互相机分辨率不低于1080p。”",
  "建议强制要求：“急停按钮应位于肩部或背部易触达位置，并采用红色蘑菇头设计。”",
  "在3.2节补充：IMU - Inertial Measurement Unit (惯性测量单元)。",
  "增加：“充电触点应具备IPX4以上防水等级，并设计防短路机制。”",
  "建议修改判定标准，增加对摩擦锥约束的考虑。",
  "增加：“涉及开源组件时，应提供完整的软件物料清单（SBOM）。”"
];

// --- Helper Functions ---

const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateClauseNumber = (index: number): string => {
  const section = Math.floor(index / 5) + 4; // Starts from section 4
  const sub = (index % 5) + 1;
  return `${section}.${sub}`;
};

// --- Generators ---

export const generateInitialData = (): TableRow[] => {
  const rows: TableRow[] = [];
  const count = 35; // Generate 35 rows initially

  for (let i = 0; i < count; i++) {
    rows.push({
      id: i + 1,
      serialNumber: i + 1,
      clauseNumber: generateClauseNumber(i),
      opinionContent: getRandom(DUMMY_OPINIONS),
      modificationSuggestion: getRandom(DUMMY_SUGGESTIONS),
      proposingUnit: getRandom(UNITS),
      handlingOpinion: getRandom(HANDLING_OPINIONS),
      remarks: Math.random() > 0.7 ? getRandom(REMARKS) : ""
    });
  }
  return rows;
};

export const parseTextToRows = (text: string): TableRow[] => {
  // 1. Process Real Text Chunking
  const cleanText = text.replace(/\r\n/g, '\n');
  const sentences = cleanText.split(/([。！？.!?\n]+)/).reduce((acc: string[], part, i, arr) => {
    if (i % 2 === 0 && part.trim()) {
      acc.push(part + (arr[i + 1] || ''));
    }
    return acc;
  }, []);

  const realChunks: string[] = [];
  let idx = 0;
  while (idx < sentences.length) {
    const count = Math.floor(Math.random() * 2) + 1; // 1-2 sentences per chunk
    let chunk = "";
    for (let k = 0; k < count && idx < sentences.length; k++) {
      chunk += sentences[idx++];
    }
    realChunks.push(chunk.trim());
  }

  // 2. Mix with Dummy Data in Chess-board Pattern
  // Pattern: 
  // Row 0: [Real, Dummy]
  // Row 1: [Dummy, Real]
  // ...
  
  const rows: TableRow[] = [];
  const minRows = 30; // Minimum rows to ensure "full" look
  const totalRows = Math.max(minRows, realChunks.length); 

  for (let i = 0; i < totalRows; i++) {
    const isEven = i % 2 === 0;
    const realText = realChunks[i] || getRandom(DUMMY_OPINIONS); // Fallback to dummy if real text runs out
    
    // To ensure we use the real text effectively, we check if we still have real text available.
    // However, the prompt implies "filling in the txt" so we prioritize showing the uploaded text.
    
    let opinion = "";
    let suggestion = "";

    // Chess-board logic
    if (isEven) {
      // Even Rows: Opinion = Real (or Dummy fallback), Suggestion = Dummy
      opinion = i < realChunks.length ? realText : getRandom(DUMMY_OPINIONS);
      suggestion = getRandom(DUMMY_SUGGESTIONS);
    } else {
      // Odd Rows: Opinion = Dummy, Suggestion = Real (or Dummy fallback)
      opinion = getRandom(DUMMY_OPINIONS);
      suggestion = i < realChunks.length ? realText : getRandom(DUMMY_SUGGESTIONS);
    }

    rows.push({
      id: i + 1,
      serialNumber: i + 1,
      clauseNumber: generateClauseNumber(i),
      opinionContent: opinion,
      modificationSuggestion: suggestion,
      proposingUnit: getRandom(UNITS),
      handlingOpinion: getRandom(HANDLING_OPINIONS),
      remarks: Math.random() > 0.8 ? getRandom(REMARKS) : ""
    });
  }

  return rows;
};
