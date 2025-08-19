export const AiApiUrl = {
  deepseek: 'https://api.deepseek.com',
  nebulablock: 'https://inference.nebulablock.com/v1',
};

export const AiAppid = {
  deepseek: 'appid',
  nebulablock: 'nebulablockAppid',
};

export const AiMaxToken = {
  deepseek: 4096,
  nebulablock: 8192,
};

export type AiType = keyof typeof AiApiUrl;
export const deepseekModelList = ['deepseek-reasoner'];

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
export const AiModelList = {
  deepseek: deepseekModelList,
  nebulablock: nebulablockModelList,
};
