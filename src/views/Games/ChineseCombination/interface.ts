export interface TextItem {
  text: string;
  no: number;
  bihua: number;
  pinyin: string;
  tags: string[];
  combination?: string[];
}

export interface UnlockProgress {
  list: { text: string; locked: boolean }[];
  unlockNum: number;
}

export interface ShowTextItem extends TextItem {
  unlockProgress: UnlockProgress;
  sort: number;
}
