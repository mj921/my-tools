<template>
  <div class="mj-md">
    <mj-md-dom :doms="mdDoms" />
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import type { MjMdParseLineItem, MjMdProps, MjMdListDomItem } from './interface';
import MjMdDom from './MjMdDom.vue';
import { generateUuid } from '@/utils';

const props = withDefaults(defineProps<MjMdProps>(), {
  disabledTypes: () => [],
});

const parseLine = (line: string, startLevel = 0) => {
  const map: Record<string, MjMdParseLineItem> = {};
  const lineQueue: { currentLine: string; level: number; pid: string }[] = [
    { currentLine: line, level: startLevel, pid: '' },
  ];
  const addBeforeOther = (pid: string, level: number, otherStr: string) => {
    if (otherStr) {
      const id = generateUuid();
      map[id] = {
        pid,
        id,
        level,
        type: 'text',
        value: otherStr,
        children: [],
      };
    }
  };
  const addAfterQueue = (pid: string, level: number, other: string) => {
    if (other.length > 0) {
      lineQueue.push({
        currentLine: other,
        level,
        pid,
      });
    }
  };
  const matchList = [
    {
      testReg: /^[^*_~<]*`.+`/,
      matchReg: /^([^*_~<]*)`(.+)`/,
      type: 'code',
      matchHandle: (
        matchArr: RegExpMatchArray | null,
        { level, currentLine, pid }: { currentLine: string; level: number; pid: string },
      ) => {
        const [matchStr = '', otherStr = '', groupStr] = matchArr || [];
        addAfterQueue(pid, level, otherStr);
        if (otherStr.length > 0) {
          addAfterQueue(pid, level, '`' + groupStr + '`');
        } else {
          if (matchStr && groupStr) {
            const id = generateUuid();
            map[id] = {
              pid,
              id,
              level,
              type: 'code',
              children: [],
            };
            lineQueue.push({
              currentLine: groupStr,
              level: level + 1,
              pid: id,
            });
          }
        }
        addAfterQueue(pid, level, currentLine.replace(matchStr, ''));
      },
    },
    {
      testReg: /^[^*_`~<]*\*\*\**[^*]*\**\*\*/,
      matchReg: /^([^*_`~<]*?)\*\*(\**[^*]*\**)\*\*/,
      type: 'strong',
    },
    {
      testReg: /^[^*_`~<]*___*[^_]*_*__/,
      matchReg: /^([^*_`~<]*?)__(_*[^*]*_*)__/,
      type: 'strong',
    },
    {
      testReg: /^[^*_`~<]*\*\**[^_]*\**\*/,
      matchReg: /^([^*_`~<]*?)\*(\**[^_]*\**)\*/,
      type: 'em',
    },
    {
      testReg: /^[^*_`~<]*__*[^_]*_*_/,
      matchReg: /^([^*_`~<]*?)_(_*[^_]*_*)_/,
      type: 'em',
    },
    {
      testReg: /^[^*_`~<]*~~~*[^~]*~*~~/,
      matchReg: /^([^*_`~<]*?)~~(~*[^~]*~*)~~/,
      type: 'del',
    },
    {
      testReg: /^[^*_`~<]*!\[[^\]]+\]\([^)]+?(?:\s+["'][^"']+["'][^)]*)?\)/,
      matchReg: /^([^*_`~<]*?)!\[([^\]]+)\]\(([^)]+?)(?:\s+["']([^"']+)["'][^)]*)?\)/,
      type: 'img',
      matchHandle: (
        matchArr: RegExpMatchArray | null,
        { level, currentLine, pid }: { currentLine: string; level: number; pid: string },
      ) => {
        const [matchStr = '', otherStr = '', groupStr, srcStr, titleStr] = matchArr || [];
        addBeforeOther(pid, level, otherStr);
        if (matchStr && groupStr) {
          const id = generateUuid();
          map[id] = {
            pid,
            id,
            level,
            type: 'img',
            attr: {
              src: srcStr,
              title: titleStr || '',
            },
            children: [],
          };
          lineQueue.push({
            currentLine: groupStr,
            level: level + 1,
            pid: id,
          });
        }
        addAfterQueue(pid, level, currentLine.replace(matchStr, ''));
      },
    },
    {
      testReg: /^[^*_`~<]*\[[^\]]+\]\([^)]+?(?:\s+["'][^"']+["'][^)]*)?\)/,
      matchReg: /^([^*_`~<]*?)\[([^\]]+)\]\(([^)]+?)(?:\s+["']([^"']+)["'][^)]*)?\)/,
      type: 'a',
      matchHandle: (
        matchArr: RegExpMatchArray | null,
        { level, currentLine, pid }: { currentLine: string; level: number; pid: string },
      ) => {
        const [matchStr = '', otherStr = '', groupStr, hrefStr, titleStr] = matchArr || [];
        addBeforeOther(pid, level, otherStr);
        if (matchStr && groupStr) {
          const id = generateUuid();
          map[id] = {
            pid,
            id,
            level,
            type: 'a',
            attr: {
              href: hrefStr,
              title: titleStr || '',
            },
            children: [],
          };
          lineQueue.push({
            currentLine: groupStr,
            level: level + 1,
            pid: id,
          });
        }
        addAfterQueue(pid, level, currentLine.replace(matchStr, ''));
      },
    },
    {
      testReg: /^[^*_`~<]*<[^>]*>/,
      matchReg: /^([^*_`~<]*?)<([^>]*)>/,
      type: 'a',
      matchHandle: (
        matchArr: RegExpMatchArray | null,
        { level, currentLine, pid }: { currentLine: string; level: number; pid: string },
      ) => {
        const [matchStr = '', otherStr = '', groupStr] = matchArr || [];
        addBeforeOther(pid, level, otherStr);
        if (matchStr && groupStr) {
          const id = generateUuid();
          map[id] = {
            pid,
            id,
            level,
            type: 'a',
            attr: {
              href: groupStr,
            },
            children: [],
          };
          const cid = generateUuid();
          map[cid] = {
            pid: id,
            id: cid,
            level: level + 1,
            type: 'text',
            value: groupStr,
            children: [],
          };
        }
        addAfterQueue(pid, level, currentLine.replace(matchStr, ''));
      },
    },
  ];
  while (lineQueue.length > 0) {
    const lineItem = lineQueue.shift()!;
    const { currentLine, level, pid } = lineItem;
    let flag = true;
    for (let i = 0; i < matchList.length && flag; i++) {
      const { testReg, matchReg, type, matchHandle } = matchList[i];
      if (props.disabledTypes.includes(type)) continue;
      if (testReg.test(currentLine)) {
        if (typeof matchHandle === 'function') {
          matchHandle(currentLine.match(matchReg), lineItem);
        } else {
          const [matchStr = '', otherStr = '', groupStr] = currentLine.match(matchReg) || [];
          addBeforeOther(pid, level, otherStr);
          if (matchStr && groupStr) {
            const id = generateUuid();
            map[id] = {
              pid,
              id,
              level,
              type,
              children: [],
            };
            lineQueue.push({
              currentLine: groupStr,
              level: level + 1,
              pid: id,
            });
          }
          addAfterQueue(pid, level, currentLine.replace(matchStr, ''));
        }
        flag = false;
      }
    }
    if (flag) {
      const id = generateUuid();
      map[id] = {
        pid,
        id,
        level,
        type: 'text',
        value: currentLine,
        children: [],
      };
    }
  }
  const arr: MjMdParseLineItem[] = [];
  Object.keys(map).forEach((key) => {
    if (map[key].pid) {
      map[map[key].pid].children.push(map[key]);
    } else {
      arr.push(map[key]);
    }
  });
  return arr;
};

const mdDoms = computed(() => {
  const lines = props.content.split('\n');
  let outDoms: MjMdParseLineItem[] = [];
  let doms: MjMdParseLineItem[] = outDoms;
  let ulIndex: MjMdListDomItem[] = [];
  let olIndex: MjMdListDomItem[] = [];

  const listParst = (
    listIndex: MjMdListDomItem[],
    type: string,
    replaceRegExp: RegExp,
    line: string,
    level: number,
    regType?: string,
  ) => {
    const startSpaceLen = (line.match(/^\s*/)?.[0] || '').length;
    let other = line.replace(replaceRegExp, '');
    let checkboxDom: MjMdParseLineItem[] = [];
    if (/^\[[\sx]\]\s/.test(other)) {
      checkboxDom.push({
        type: 'input',
        children: [],
        attr: {
          type: 'checkbox',
          disabled: true,
          checked: /^\[x\]\s/.test(other),
        },
        pid: '',
        id: generateUuid(),
        level: level + 2,
      });
      other = ' ' + other.replace(/^\[[\sx]\]\s+/, '');
    }
    if (listIndex.length === 0) {
      const _item: MjMdListDomItem = {
        index: doms.length,
        len: startSpaceLen,
        list: [],
        children: [],
        level: level + 1,
        regType,
      };
      listIndex.push(_item);
      const eleItem = {
        type,
        children: [
          {
            type: 'li',
            children: checkboxDom.concat(parseLine(other, level + 2)),
            pid: '',
            id: generateUuid(),
            level: level + 1,
          },
        ],
        pid: '',
        id: generateUuid(),
        level,
      };
      doms.push(eleItem);
      _item.list = eleItem.children;
      _item.children = eleItem.children[0].children;
    } else {
      const i = listIndex.findIndex((el) => el.len === startSpaceLen);
      if (i === -1) {
        const lastUl = listIndex[listIndex.length - 1];
        const list = lastUl.list;
        const _item: MjMdListDomItem = {
          index: list.length,
          len: startSpaceLen,
          list: list,
          children: [],
          level: lastUl.level + 1,
        };
        listIndex.push(_item);
        const eleItem = {
          type,
          children: [
            {
              type: 'li',
              children: checkboxDom.concat(parseLine(other, lastUl.level + 2)),
              pid: '',
              id: generateUuid(),
              level: lastUl.level + 1,
            },
          ],
          pid: '',
          id: generateUuid(),
          level: lastUl.level,
        };
        list.push(eleItem);
        _item.list = eleItem.children;
        _item.children = eleItem.children[0].children;
      } else {
        listIndex = listIndex.slice(0, i + 1);
        const lastUl = listIndex[i];
        const list = lastUl.list;
        const eleItem = {
          type: 'li',
          children: checkboxDom.concat(parseLine(other, lastUl.level + 2)),
          pid: '',
          id: generateUuid(),
          level: lastUl.level + 1,
        };
        list.push(eleItem);
        lastUl.children = eleItem.children[0].children;
      }
    }
  };
  let blockquoteZIndex = 0;
  let level = 0;
  let codeLen = 0;
  let table = '';
  let tdStyles: (string | undefined)[] = [];
  lines.forEach((line, i) => {
    if (/^\s*>/.test(line)) {
      let [matchStr = '', bqStr = ''] = line.match(/^\s*(>(?:\s*>)*)/) || [];
      let bqNum = bqStr.replace(/\s/g, '').length;
      if (/^\s*>(\s*>)*\s*$/.test(line) && bqNum > blockquoteZIndex) {
        const matchArr = line.match(/^(\s*>(?:\s*>)*?)\s*>\s*$/) || [];
        matchStr = matchArr[1] || '';
        bqNum--;
      }
      if (blockquoteZIndex === 0) {
        outDoms = doms;
        doms = [];
        outDoms.push({
          type: 'blockquote',
          children: doms,
          pid: '',
          id: generateUuid(),
          level,
        });
        level++;
        blockquoteZIndex++;
      }
      while (bqNum > blockquoteZIndex) {
        const bqItem = {
          type: 'blockquote',
          children: [],
          pid: '',
          id: generateUuid(),
          level,
        };
        doms.push(bqItem);
        doms = bqItem.children;
        level++;
        blockquoteZIndex++;
      }
      line = line.replace(matchStr, '');
    } else if (blockquoteZIndex > 0 && line.replace(/\s/g, '').length > 0) {
      blockquoteZIndex = 0;
      doms = outDoms;
      level--;
    }
    if (/^([*-_])\1{2,}$/.test(line)) {
      ulIndex = [];
      olIndex = [];
      table = '';
      doms.push({
        pid: '',
        id: generateUuid(),
        level,
        type: 'hr',
        children: [],
      });
    } else if (
      table === '' &&
      i < lines.length - 1 &&
      /^\s*\|([^|]*\|)+\s*$/.test(line) &&
      /^\s*\|(\s*:?-+:?\s*?\|)+\s*$/.test(lines[i + 1])
    ) {
      ulIndex = [];
      olIndex = [];
      table = 'thead';
      const ths = line.replace(/(^\s*\||\|\s*$)/g, '').split('|');
      tdStyles = lines[i + 1]
        .replace(/(^\s*\||\|\s*$)/g, '')
        .split('|')
        .map((el) => {
          const str = el.replace(/(^\s*|\s*$)/g, '');
          if (str[0] === ':' && str[str.length - 1] === ':') {
            return 'text-align: center';
          } else if (str[str.length - 1] === ':') {
            return 'text-align: right';
          }
          return undefined;
        });
      doms.push({
        type: 'table',
        pid: '',
        value: '',
        id: generateUuid(),
        children: [
          {
            type: 'thead',
            pid: '',
            value: '',
            id: generateUuid(),
            children: [
              {
                type: 'tr',
                pid: '',
                value: '',
                id: generateUuid(),
                children: ths.map((el, i) => ({
                  type: 'th',
                  pid: '',
                  value: '',
                  id: generateUuid(),
                  children: parseLine(el, level + 3),
                  level: level + 3,
                  attr: {
                    style: tdStyles[i],
                  },
                })),
                level: level + 2,
              },
            ],
            level: level + 1,
          },
        ],
        level: level,
      });
    } else if (table === 'thead') {
      table = 'tbodyFirst';
    } else if (table.includes('tbody') && /^\s*\|([^|]*\|)+\s*$/.test(line)) {
      const tds = line.replace(/(^\s*\||\|\s*$)/g, '').split('|');
      const trDom = {
        type: 'tr',
        pid: '',
        value: '',
        id: generateUuid(),
        children: tds.map((el, i) => ({
          type: 'td',
          pid: '',
          value: '',
          id: generateUuid(),
          children: parseLine(el, level + 3),
          level: level + 3,
          attr: {
            style: tdStyles[i],
          },
        })),
        level: level + 2,
      };
      if (table === 'tbodyFirst') {
        table = 'tbody';
        doms[doms.length - 1].children.push({
          type: 'tbody',
          pid: '',
          value: '',
          id: generateUuid(),
          children: [trDom],
          level: level + 1,
        });
      } else {
        doms[doms.length - 1].children[1].children.push(trDom);
      }
    } else if (codeLen === 0 && /^\s*`{3,}[^`]*$/.test(line)) {
      table = '';
      const [, codeStr, codeType] = line.match(/^\s*(`{3,})\s*(.*)\s*$/) || [];
      codeLen = codeStr.length;
      doms.push({
        type: 'pre',
        children: [
          {
            type: 'code',
            children: [
              {
                type: 'text',
                pid: '',
                value: '',
                id: generateUuid(),
                children: [],
                level: level + 2,
              },
            ],
            pid: '',
            value: '',
            id: generateUuid(),
            attr: {
              class: `lang-${codeType || ''}`,
            },
            level: level + 1,
          },
        ],
        pid: '',
        value: '',
        id: generateUuid(),
        level,
      });
    } else if (codeLen > 0) {
      table = '';
      if (new RegExp(`^\\s*${new Array(codeLen).fill('`').join('')}\\s*$`).test(line)) {
        codeLen = 0;
      } else {
        doms[doms.length - 1].children[0].children[0].value += line + '\n';
      }
    } else if (/^\s*#{1,6}\s/.test(line)) {
      ulIndex = [];
      olIndex = [];
      table = '';
      doms.push({
        type: `h${(line.match(/^\s*(#{1,6})\s/)?.[1] || '').length}`,
        value: line.replace(/^(#{1,6})\s/, ''),
        children: [
          {
            type: 'text',
            value: line.replace(/^(#{1,6})\s/, ''),
            children: [],
            pid: '',
            id: generateUuid(),
            level: level + 1,
          },
        ],
        pid: '',
        id: generateUuid(),
        level,
      });
    } else if (/^\s*[*+-]\s/.test(line)) {
      olIndex = [];
      table = '';
      const regType = line.replace(/^\s/g, '')[0];
      if (ulIndex.length > 0 && ulIndex[0].regType !== regType) {
        ulIndex = [];
      }
      listParst(ulIndex, 'ul', /^\s*[*+-]\s+/, line, level, regType);
    } else if (/^\s*\d+\.\s/.test(line)) {
      ulIndex = [];
      table = '';
      listParst(olIndex, 'ol', /^\s*\d+\.\s+/, line, level);
    } else if (line.replace(/\s/g, '')) {
      ulIndex = [];
      olIndex = [];
      table = '';
      if (doms.length > 0 && doms[doms.length - 1].type === 'p' && !/^\s*$/g.test(lines[i - 1])) {
        doms[doms.length - 1].children = doms[doms.length - 1].children.concat([
          {
            type: 'br',
            pid: '',
            id: generateUuid(),
            level: level + 1,
            children: [],
          },
          ...parseLine(line, level + 1),
        ]);
      } else {
        doms.push({
          type: 'p',
          value: line,
          children: parseLine(line, level + 1),
          pid: '',
          id: generateUuid(),
          level,
        });
      }
    }
  });

  if (blockquoteZIndex > 0) {
    blockquoteZIndex = 0;
    doms = outDoms;
    level--;
  }
  return doms;
});
</script>
<style lang="scss">
.mj-md {
  padding: 20px;
  *:first-child {
    margin-top: 0;
  }
  h1,
  h2 {
    margin-top: 1em;
    border-bottom: 1px solid #ddd;
    padding-bottom: 0.5em;
    margin-bottom: 0.5em;
  }
  h3,
  h4,
  h5,
  h6 {
    margin: 1em 0;
  }
  a {
    color: #4183c4;
    text-decoration: none;
  }
  ul,
  ol {
    padding-left: 2em;
    margin-bottom: 1em;
    li {
      list-style: inherit;
    }
  }

  ul {
    list-style-type: disc;
    ul {
      list-style-type: circle;
      margin-bottom: 0;
      ul {
        list-style-type: square;
      }
    }
  }
  ol {
    list-style-type: decimal;
    ol {
      list-style-type: lower-roman;
      margin-bottom: 0;
      ol {
        list-style-type: lower-alpha;
      }
    }
  }
  img {
    max-width: 100%;
  }
  p {
    margin-left: 1em;
    margin-bottom: 1em;
  }
  blockquote {
    padding-left: 20px;
    border-left: 4px solid #ddd;
    & > *:last-child {
      margin-bottom: 0;
    }
  }
  code {
    padding: 0;
    padding-top: 0.2em;
    padding-bottom: 0.2em;
    margin: 0;
    font-size: 85%;
    background-color: rgba(27, 31, 35, 0.05);
    border-radius: 3px;
    &::before,
    &::after {
      content: '\00a0';
    }
  }
  pre {
    background-color: #f6f8fa;
    padding: 16px;
    border-radius: 3px;
    font-size: 85%;
    code {
      background-color: transparent;
      font-size: 100%;
      border-radius: 0;
      &::before,
      &::after {
        display: none;
      }
    }
  }
  table {
    border-collapse: collapse;
    thead {
      background-color: #f8f8f8;
    }
    th,
    td {
      border: 1px solid #ddd;
      padding: 6px 13px;
    }
    tbody {
      tr {
        &:nth-child(even) {
          background-color: #f8f8f8;
        }
      }
    }
  }
  hr {
    border-top: none;
    margin: 24px 0;
  }
}
</style>
