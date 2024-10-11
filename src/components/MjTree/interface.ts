export interface MjTreeNodeData {
  key: string;
  title: string;
  children: MjTreeNodeData[];
  isLeaf: boolean;
  [key: string]: any;
}

type NodeClickAction = 'expand';

export interface MjTreeProps {
  data: MjTreeNodeData[];
  nodeClickAction?: NodeClickAction;
  loadMore?: (node: MjTreeNodeData) => Promise<any>;
  textColor?: string;
  bgColor?: string;
}

export interface MjTreeNodeProps {
  node: MjTreeNodeData;
  nodeClickAction: NodeClickAction;
  loadMore?: (node: MjTreeNodeData) => Promise<any>;
}
