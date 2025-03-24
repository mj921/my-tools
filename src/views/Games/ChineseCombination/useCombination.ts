import { computed, ref, watch } from 'vue';
import type { ShowTextItem, TextItem, UnlockProgress } from './interface';

const STORE_ORIGIN_NUM = 'chineseCombinationOriginNum';
const STORE_TEXT = 'chineseCombinationText';

const useCombination = ({ combination }: { combination: TextItem[] }) => {
  const storeTexts = localStorage.getItem(STORE_TEXT);
  const storeUnlockOriginNum = localStorage.getItem(STORE_ORIGIN_NUM);
  const defUnlockTextList = combination.filter((el: TextItem) => el.bihua === 1 && !el.combination);
  /** 解锁的文字列表 */
  /** 合成组合对应产物map */
  const combinationGroupMap = ref<Record<string, string>>({});
  /** 一个文字可合成的文字 */
  const canCombinationMap = ref<Record<string, UnlockProgress>>({});
  /** 所有文字map */
  const textMap = ref<Record<string, TextItem>>({});
  /** 初始文字 */
  const originTexts = ref('');
  combination.forEach((el) => {
    textMap.value[el.text] = el;
    canCombinationMap.value[el.text] = { list: [], unlockNum: 0 };
    const textLocked = storeTexts
      ? !storeTexts.includes(el.text)
      : !defUnlockTextList.find((v) => v.text === el.text);
    if (el.combination) {
      el.combination.forEach((item) => {
        const group = item.split('').sort().join('');
        combinationGroupMap.value[group] = (combinationGroupMap.value[group] || '') + el.text;
        if (!canCombinationMap.value[item[0]].list.find((v) => el.text === v.text)) {
          canCombinationMap.value[item[0]].list.push({ text: el.text, locked: textLocked });
          if (!textLocked) {
            canCombinationMap.value[item[0]].unlockNum++;
          }
        }
        if (!canCombinationMap.value[item[1]].list.find((v) => el.text === v.text)) {
          canCombinationMap.value[item[1]].list.push({ text: el.text, locked: textLocked });
          if (!textLocked) {
            canCombinationMap.value[item[1]].unlockNum++;
          }
        }
      });
    } else {
      originTexts.value += el.text;
    }
  });
  for (const key in canCombinationMap.value) {
    if (!canCombinationMap.value[key]) {
      delete canCombinationMap.value[key];
    }
  }

  const unlockTextList = ref(
    storeTexts ? storeTexts.split('').map((t) => textMap.value[t]) : defUnlockTextList,
  );
  /** 解锁的初始文字数量 */
  const unlockOriginNum = ref(+(storeUnlockOriginNum || '') || defUnlockTextList.length);
  /** 解锁的初始文字进度 */
  const unlockOriginProgress = ref(0);
  /** 解锁的文字 */
  const unlockTexts = computed(() => {
    const ots: string[] = [];
    const ts = unlockTextList.value
      .map((el) => {
        if (!el.combination) {
          ots.push(el.text);
        }
        return el.text;
      })
      .join('');
    return {
      all: ts,
      origin: ots.join(''),
    };
  });
  const showUnlockTextList = computed<ShowTextItem[]>(() => {
    return unlockTextList.value
      .map((el) => {
        const unlockProgress = canCombinationMap.value[el.text];
        return {
          ...el,
          unlockProgress,
          sort:
            (unlockProgress.unlockNum === unlockProgress.list.length ? 10000000 : 0) +
            el.bihua * 100000 +
            el.no,
        };
      })
      .sort((a, b) => a.sort - b.sort);
  });
  const getShowTextItem = (text: string): ShowTextItem => {
    return {
      ...textMap.value[text],
      unlockProgress: canCombinationMap.value[text],
      sort: 0,
    };
  };
  const combinationText = (texts: string[]) => {
    const group = texts.sort().join('');
    const result = combinationGroupMap.value[group] || '';
    const lockedRes: TextItem[] = [];
    const lockReturnRes: TextItem[] = [];
    for (let i = 0; i < result.length; i++) {
      lockReturnRes.push(textMap.value[result[i]]);
      if (!unlockTexts.value.all.includes(result[i])) {
        lockedRes.push(textMap.value[result[i]]);
        canCombinationMap.value[texts[0]].unlockNum++;
        let r = canCombinationMap.value[texts[0]].list.find((el) => el.text === result[i]);
        if (r) {
          r.locked = false;
        }
        canCombinationMap.value[texts[1]].unlockNum++;
        r = canCombinationMap.value[texts[1]].list.find((el) => el.text === result[i]);
        if (r) {
          r.locked = false;
        }
      }
    }
    unlockTextList.value.push(...lockedRes);
    unlockOriginProgress.value += lockedRes.length;
    const num = Math.floor(unlockOriginProgress.value / 4);
    unlockOriginProgress.value %= 4;
    if (num > 0) {
      originTexts.value
        .slice(unlockOriginNum.value, unlockOriginNum.value + num)
        .split('')
        .forEach((t) => {
          unlockTextList.value.push(textMap.value[t]);
        });
      unlockOriginNum.value += num;
    }
    return lockReturnRes;
  };
  watch([unlockTexts], () => {
    localStorage.setItem(STORE_TEXT, unlockTexts.value.all);
  });
  watch([unlockOriginNum], () => {
    localStorage.setItem(STORE_ORIGIN_NUM, unlockOriginNum.value.toString());
  });
  return {
    canCombinationMap,
    showUnlockTextList,
    combinationText,
    getShowTextItem,
  };
};

export default useCombination;
