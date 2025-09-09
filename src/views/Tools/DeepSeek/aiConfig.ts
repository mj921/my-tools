export const AiApiUrl = {
  deepseek: 'https://api.deepseek.com',
  nebulablock: 'https://inference.nebulablock.com/v1',
  edgefn: 'https://api.edgefn.net/v1',
};

export const AiAppid = {
  deepseek: 'appid',
  nebulablock: 'nebulablockAppid',
  edgefn: 'edgefnAppid',
};

export const AiMaxToken = {
  deepseek: 4096,
  nebulablock: 8192,
  edgefn: 8192,
};

export type AiType = keyof typeof AiApiUrl;
export const deepseekModelList = ['deepseek-reasoner', 'deepseek-chat'];

export const nebulablockModelList = [
  'deepseek-ai/DeepSeek-R1',
  'deepseek-ai/DeepSeek-R1-0528',
  'deepseek-ai/DeepSeek-V3-0324',
  'Steelskull/L3.3-MS-Nevoria-70b',
  'mistralai/Mistral-Small-3.2-24B-Instruct-2506',
  'sophosympatheia/Midnight-Rose-70B-v2.0.3',
  'Sao10K/L3-70B-Euryale-v2.1',
  'Sao10K/L3-8B-Stheno-v3.2',
];
export const edgefnModelList = [
  'DeepSeek-R1-0528-Qwen3-8B',
  'DeepSeek-R1-0528',
  'Qwen3-Coder-480B-A35B-Instruct',
  'GLM-4.5',
  'Qwen3-32B-FP8',
  'Qwen3-30B-A3B-FP8',
  'DeepSeek-V3',
  'Qwen3-235B-A22B',
  'DeepSeek-R1-Distill-Qwen-14B',
  'DeepSeek-R1-Distill-Qwen-32B',
  'Qwen2.5-72B-Instruct',
  'Qwen2.5-72B-Instruct-128K',
  'Kimi-K2-Instruct',
  'Qwen3-235B-A22B-2507',
  'GLM-4.5V',
];
export const AiModelList = {
  deepseek: deepseekModelList,
  nebulablock: nebulablockModelList,
  edgefn: edgefnModelList,
};
