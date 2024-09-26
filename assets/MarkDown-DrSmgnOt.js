import{d as T,o as D,c as M,r as C,F as H,x as E,e as F,t as U,B as V,y as I,i as A,H as O,S as P,g as Q,h as z,b as N,w as Z,z as G,_ as J}from"./index-ClKN_2u4.js";import{g as c}from"./index-BX2F1_Kw.js";const K=T({name:"MjMdDom",__name:"MjMdDom",props:{doms:{}},setup(q){return(R,S)=>{const $=E("mj-md-dom",!0);return D(!0),M(H,null,C(R.doms,u=>(D(),M(H,{key:u.id},[u.type==="text"?(D(),M(H,{key:0},[F(U(u.value),1)],64)):(D(),V(P(u.type),O({key:1,ref_for:!0},u.attr,{class:u.className}),{default:I(()=>[A($,{doms:u.children},null,8,["doms"])]),_:2},1040,["class"]))],64))),128)}}}),W={class:"mj-md"},X=T({__name:"MjMd",props:{content:{}},setup(q){const R=q,S=(u,x=0)=>{const s={},m=[{currentLine:u,level:x,pid:""}],f=(i,t,a)=>{if(a){const e=c();s[e]={pid:i,id:e,level:t,type:"text",value:a,children:[]}}},v=(i,t,a)=>{a.length>0&&m.push({currentLine:a,level:t,pid:i})},g=[{testReg:/^[^*_~<]*`.+`/,matchReg:/^([^*_~<]*)`(.+)`/,type:"code",matchHandle:(i,{level:t,currentLine:a,pid:e})=>{const[o="",h="",n]=i||[];if(v(e,t,h),h.length>0)v(e,t,"`"+n+"`");else if(o&&n){const l=c();s[l]={pid:e,id:l,level:t,type:"code",children:[]},m.push({currentLine:n,level:t+1,pid:l})}v(e,t,a.replace(o,""))}},{testReg:/^[^*_`~<]*\*\*\**[^*]*\**\*\*/,matchReg:/^([^*_`~<]*?)\*\*(\**[^*]*\**)\*\*/,type:"strong"},{testReg:/^[^*_`~<]*___*[^_]*_*__/,matchReg:/^([^*_`~<]*?)__(_*[^*]*_*)__/,type:"strong"},{testReg:/^[^*_`~<]*\*\**[^_]*\**\*/,matchReg:/^([^*_`~<]*?)\*(\**[^_]*\**)\*/,type:"em"},{testReg:/^[^*_`~<]*__*[^_]*_*_/,matchReg:/^([^*_`~<]*?)_(_*[^_]*_*)_/,type:"em"},{testReg:/^[^*_`~<]*~~~*[^~]*~*~~/,matchReg:/^([^*_`~<]*?)~~(~*[^~]*~*)~~/,type:"del"},{testReg:/^[^*_`~<]*!\[[^\]]+\]\([^)]+?(?:\s+["'][^"']+["'][^)]*)?\)/,matchReg:/^([^*_`~<]*?)!\[([^\]]+)\]\(([^)]+?)(?:\s+["']([^"']+)["'][^)]*)?\)/,type:"img",matchHandle:(i,{level:t,currentLine:a,pid:e})=>{const[o="",h="",n,l,d]=i||[];if(f(e,t,h),o&&n){const p=c();s[p]={pid:e,id:p,level:t,type:"img",attr:{src:l,title:d||""},children:[]},m.push({currentLine:n,level:t+1,pid:p})}v(e,t,a.replace(o,""))}},{testReg:/^[^*_`~<]*\[[^\]]+\]\([^)]+?(?:\s+["'][^"']+["'][^)]*)?\)/,matchReg:/^([^*_`~<]*?)\[([^\]]+)\]\(([^)]+?)(?:\s+["']([^"']+)["'][^)]*)?\)/,type:"a",matchHandle:(i,{level:t,currentLine:a,pid:e})=>{const[o="",h="",n,l,d]=i||[];if(f(e,t,h),o&&n){const p=c();s[p]={pid:e,id:p,level:t,type:"a",attr:{href:l,title:d||""},children:[]},m.push({currentLine:n,level:t+1,pid:p})}v(e,t,a.replace(o,""))}},{testReg:/^[^*_`~<]*<[^>]*>/,matchReg:/^([^*_`~<]*?)<([^>]*)>/,type:"a",matchHandle:(i,{level:t,currentLine:a,pid:e})=>{const[o="",h="",n]=i||[];if(f(e,t,h),o&&n){const l=c();s[l]={pid:e,id:l,level:t,type:"a",attr:{href:n},children:[]};const d=c();s[d]={pid:l,id:d,level:t+1,type:"text",value:n,children:[]}}v(e,t,a.replace(o,""))}}];for(;m.length>0;){const i=m.shift(),{currentLine:t,level:a,pid:e}=i;let o=!0;for(let h=0;h<g.length&&o;h++){const{testReg:n,matchReg:l,type:d,matchHandle:p}=g[h];if(n.test(t)){if(typeof p=="function")p(t.match(l),i);else{const[b="",k="",L]=t.match(l)||[];if(f(e,a,k),b&&L){const y=c();s[y]={pid:e,id:y,level:a,type:d,children:[]},m.push({currentLine:L,level:a+1,pid:y})}v(e,a,t.replace(b,""))}o=!1}}if(o){const h=c();s[h]={pid:e,id:h,level:a,type:"text",value:t,children:[]}}}const r=[];return Object.keys(s).forEach(i=>{s[i].pid?s[s[i].pid].children.push(s[i]):r.push(s[i])}),r},$=Q(()=>{const u=R.content.split(`
`);let x=[],s=x,m=[],f=[];const v=(e,o,h,n,l,d)=>{var L;const p=(((L=n.match(/^\s*/))==null?void 0:L[0])||"").length;let b=n.replace(h,""),k=[];if(/^\[[\sx]\]\s/.test(b)&&(k.push({type:"input",children:[],attr:{type:"checkbox",disabled:!0,checked:/^\[x\]\s/.test(b)},pid:"",id:c(),level:l+2}),b=" "+b.replace(/^\[[\sx]\]\s+/,"")),e.length===0){const y={index:s.length,len:p,list:[],children:[],level:l+1,regType:d};e.push(y);const _={type:o,children:[{type:"li",children:k.concat(S(b,l+2)),pid:"",id:c(),level:l+1}],pid:"",id:c(),level:l};s.push(_),y.list=_.children,y.children=_.children[0].children}else{const y=e.findIndex(_=>_.len===p);if(y===-1){const _=e[e.length-1],w=_.list,j={index:w.length,len:p,list:w,children:[],level:_.level+1};e.push(j);const B={type:o,children:[{type:"li",children:k.concat(S(b,_.level+2)),pid:"",id:c(),level:_.level+1}],pid:"",id:c(),level:_.level};w.push(B),j.list=B.children,j.children=B.children[0].children}else{e=e.slice(0,y+1);const _=e[y],w=_.list,j={type:"li",children:k.concat(S(b,_.level+2)),pid:"",id:c(),level:_.level+1};w.push(j),_.children=j.children[0].children}}};let g=0,r=0,i=0,t="",a=[];return u.forEach((e,o)=>{var h;if(/^\s*>/.test(e)){let[n="",l=""]=e.match(/^\s*(>(?:\s*>)*)/)||[],d=l.replace(/\s/g,"").length;for(/^\s*>(\s*>)*\s*$/.test(e)&&d>g&&(n=(e.match(/^(\s*>(?:\s*>)*?)\s*>\s*$/)||[])[1]||"",d--),g===0&&(x=s,s=[],x.push({type:"blockquote",children:s,pid:"",id:c(),level:r}),r++,g++);d>g;){const p={type:"blockquote",children:[],pid:"",id:c(),level:r};s.push(p),s=p.children,r++,g++}e=e.replace(n,"")}else g>0&&e.replace(/\s/g,"").length>0&&(g=0,s=x,r--);if(/^([*-_])\1{2,}$/.test(e))m=[],f=[],t="",s.push({pid:"",id:c(),level:r,type:"hr",children:[]});else if(t===""&&o<u.length-1&&/^\s*\|([^|]*\|)+\s*$/.test(e)&&/^\s*\|(\s*:?-+:?\s*?\|)+\s*$/.test(u[o+1])){m=[],f=[],t="thead";const n=e.replace(/(^\s*\||\|\s*$)/g,"").split("|");a=u[o+1].replace(/(^\s*\||\|\s*$)/g,"").split("|").map(l=>{const d=l.replace(/(^\s*|\s*$)/g,"");if(d[0]===":"&&d[d.length-1]===":")return"text-align: center";if(d[d.length-1]===":")return"text-align: right"}),s.push({type:"table",pid:"",value:"",id:c(),children:[{type:"thead",pid:"",value:"",id:c(),children:[{type:"tr",pid:"",value:"",id:c(),children:n.map((l,d)=>({type:"th",pid:"",value:"",id:c(),children:S(l,r+3),level:r+3,attr:{style:a[d]}})),level:r+2}],level:r+1}],level:r})}else if(t==="thead")t="tbodyFirst";else if(t.includes("tbody")&&/^\s*\|([^|]*\|)+\s*$/.test(e)){const n=e.replace(/(^\s*\||\|\s*$)/g,"").split("|"),l={type:"tr",pid:"",value:"",id:c(),children:n.map((d,p)=>({type:"td",pid:"",value:"",id:c(),children:S(d,r+3),level:r+3,attr:{style:a[p]}})),level:r+2};t==="tbodyFirst"?(t="tbody",s[s.length-1].children.push({type:"tbody",pid:"",value:"",id:c(),children:[l],level:r+1})):s[s.length-1].children[1].children.push(l)}else if(i===0&&/^\s*`{3,}[^`]*$/.test(e)){t="";const[,n,l]=e.match(/^\s*(`{3,})\s*(.*)\s*$/)||[];i=n.length,s.push({type:"pre",children:[{type:"code",children:[{type:"text",pid:"",value:"",id:c(),children:[],level:r+2}],pid:"",value:"",id:c(),attr:{class:`lang-${l||""}`},level:r+1}],pid:"",value:"",id:c(),level:r})}else if(i>0)t="",new RegExp(`^\\s*${new Array(i).fill("`").join("")}\\s*$`).test(e)?i=0:s[s.length-1].children[0].children[0].value+=e+`
`;else if(/^\s*#{1,6}\s/.test(e))m=[],f=[],t="",s.push({type:`h${(((h=e.match(/^\s*(#{1,6})\s/))==null?void 0:h[1])||"").length}`,value:e.replace(/^(#{1,6})\s/,""),children:[{type:"text",value:e.replace(/^(#{1,6})\s/,""),children:[],pid:"",id:c(),level:r+1}],pid:"",id:c(),level:r});else if(/^\s*[*+-]\s/.test(e)){f=[],t="";const n=e.replace(/^\s/g,"")[0];m.length>0&&m[0].regType!==n&&(m=[]),v(m,"ul",/^\s*[*+-]\s+/,e,r,n)}else/^\s*\d+\.\s/.test(e)?(m=[],t="",v(f,"ol",/^\s*\d+\.\s+/,e,r)):e.replace(/\s/g,"")&&(m=[],f=[],t="",s.length>0&&s[s.length-1].type==="p"&&!/^\s*$/g.test(u[o-1])?s[s.length-1].children=s[s.length-1].children.concat([{type:"br",pid:"",id:c(),level:r+1,children:[]},...S(e,r+1)]):s.push({type:"p",value:e,children:S(e,r+1),pid:"",id:c(),level:r}))}),g>0&&(g=0,s=x,r--),s});return(u,x)=>(D(),M("div",W,[A(K,{doms:$.value},null,8,["doms"])]))}}),Y=`# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题

## 强调

**重点加粗**
*斜体*
~~删除线~~
***重点加粗斜体***

## 列表

- 无序列表
 - 嵌套无序列表
 - 嵌套无序列表
- 无序列表

+ 无序列表
+ 无序列表

* 无序列表
* 无序列表

1. 有序列表
2. 有序列表
3. 有序列表
  1. 嵌套有序列表
  2. 嵌套有序列表
  3. 嵌套有序列表

## 引用
  
> 引用内容引用内容引用内容引用内容引用内容引用内容引用内容引用内容引用内容
> 引用内容引用内容引用内容引用内容引用内容引用内容
>
>> 两层引用内容两层引用内容两层引用内容两层引用内容两层引用内容两层引用内容
 
## 代码

### 代码块

\`\`\`javascript
const num1 = 1;
const num2 = 2;
const add = (a, b) => a + b;
const num3 = add(num1 + num2);
\`\`\`

### 行内代码

这是\`行内代码\`

## 链接地址

[链接名称](https://mj921.github.io/my-tools "链接title")
<https://mj921.github.io/my-tools>

## 图片

![图片描述](https://mj921.github.io/my-tools/example.png "图片title")

## 表格

|表头1 左对齐|表头2 居中|表头3 右对齐|
|:-|:-:|-:|
|内容1|内容2|内容3|
|内容1|内容2|内容3|

## 分割线

***
---
___

## 复选框

- [ ] 1
- [x] 2`,ee={class:"markdown"},te=T({__name:"MarkDown",setup(q){const R=z(Y);return(S,$)=>(D(),M("div",ee,[N("div",null,[Z(N("textarea",{name:"",id:"","onUpdate:modelValue":$[0]||($[0]=u=>R.value=u)},null,512),[[G,R.value]])]),N("div",null,[A(X,{content:R.value},null,8,["content"])])]))}}),ce=J(te,[["__scopeId","data-v-bfe5a38e"]]);export{ce as default};
