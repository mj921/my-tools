export interface MjMdProps {
  content: string;
  disabledTypes?: string[];
}

export interface MjMdParseLineItem {
  pid: string;
  id: string;
  level: number;
  type: string;
  value?: string;
  attr?: Record<string, any>;
  className?: string;
  children: MjMdParseLineItem[];
}

export interface MjMdDomProps {
  doms: MjMdParseLineItem[];
}

export interface MjMdListDomItem {
  index: number;
  len: number;
  list: MjMdParseLineItem[];
  children: MjMdParseLineItem[];
  level: number;
  regType?: string;
}
