import{g as o,b as V}from"./index-C1s-hTSf.js";import{d as w,o as a,b as t,l as B,F as d,q as M,s as f,v as y,n as $,B as k,f as I,e as T,a as P,c as E,H as L,t as v}from"./index-BYA0E31P.js";import{m as F}from"./MjMessage-DgaPcODj.js";const S={key:0},q={key:1,class:"mj-pre-css-block"},D={key:2,class:"mj-pre-css-bracket"},H={key:3,class:"mj-pre-css-block"},U={key:4,class:"mj-pre-css-bracket"},A=w({__name:"MjPreCssEle",props:{list:{}},setup(_){const n=p=>/^(#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8}))$/.test(p);return(p,N)=>{const m=M("mj-pre-css-ele",!0);return a(!0),t(d,null,B(p.list,(r,h)=>(a(),t(d,{key:h},[r.type==="br"?(a(),t("br",S)):r.startBracket?(a(),t("div",q,[r.className==="keyword"?(a(!0),t(d,{key:0},B(r.value.split(/\s+/),(l,i)=>(a(),t("span",{key:`${h}_keyword_${i}`,class:f(i===0?"mj-pre-css-keyword":"mj-pre-css-funname")},y(l+" "),3))),128)):(a(),t("span",{key:1,class:f(`mj-pre-css-${r.className||r.type} ${r.type==="propValue"&&n(r.value)?"mj-pre-css-color-preview":""}`),style:$(r.type==="propValue"&&n(r.value)?{"--mj-pre-css-color-preview":r.value}:[])},y(r.value),7)),r.startBracket?(a(),t("span",D,y(r.startBracket),1)):k("",!0),r.children.length>0?(a(),t("div",H,[I(m,{list:r.children},null,8,["list"])])):k("",!0),r.endBracket?(a(),t("span",U,y(r.endBracket),1)):k("",!0)])):(a(),t("span",{key:2,class:f(`mj-pre-css-${r.className||r.type} ${r.type==="propValue"&&n(r.value)?"mj-pre-css-color-preview":""}`),style:$(r.type==="propValue"&&n(r.value)?{"--mj-pre-css-color-preview":r.value}:[])},y(r.value),7))],64))),128)}}}),G=T("path",{d:"M896 810.666667l-128 0c-23.466667 0-42.666667-19.2-42.666667-42.666667 0-23.466667 19.2-42.666667 42.666667-42.666667l106.666667 0c12.8 0 21.333333-8.533333 21.333333-21.333333L896 106.666667c0-12.8-8.533333-21.333333-21.333333-21.333333L448 85.333333c-12.8 0-21.333333 8.533333-21.333333 21.333333l0 21.333333c0 23.466667-19.2 42.666667-42.666667 42.666667-23.466667 0-42.666667-19.2-42.666667-42.666667L341.333333 85.333333c0-46.933333 38.4-85.333333 85.333333-85.333333l469.333333 0c46.933333 0 85.333333 38.4 85.333333 85.333333l0 640C981.333333 772.266667 942.933333 810.666667 896 810.666667zM682.666667 298.666667l0 640c0 46.933333-38.4 85.333333-85.333333 85.333333L128 1024c-46.933333 0-85.333333-38.4-85.333333-85.333333L42.666667 298.666667c0-46.933333 38.4-85.333333 85.333333-85.333333l469.333333 0C644.266667 213.333333 682.666667 251.733333 682.666667 298.666667zM576 298.666667 149.333333 298.666667c-12.8 0-21.333333 8.533333-21.333333 21.333333l0 597.333333c0 12.8 8.533333 21.333333 21.333333 21.333333l426.666667 0c12.8 0 21.333333-8.533333 21.333333-21.333333L597.333333 320C597.333333 307.2 588.8 298.666667 576 298.666667z"},null,-1),J=[G],K=w({__name:"CopyIcon",props:{color:{},spin:{type:Boolean}},setup(_){return(n,p)=>(a(),t("svg",{class:f(["mj-icon","mj-copy-icon",n.spin?"mj-icon-spin":""]),xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 1024 1024",fill:"currentColor",style:$({"--mj-icon-color":n.color})},J,6))}}),O={class:"mj-pre"},X=w({__name:"MjPre",props:{value:{},lang:{},copyable:{type:Boolean,default:!0}},setup(_){const n=_,p=P(),N=()=>{const l={},i=n.value.replace(/(^\s+|\s+$)/g,""),g=[{type:"",value:"",className:"",children:[]}];let u=0,z=0,e=1,s=[o(),o()];const j={type:"root",value:"",className:"",children:[]};for(l[s[0]]=j;u<i.length;){const c=i[u];if(!l[s[e]])if(c===`
`||c===" "){u++;continue}else if(l[s[e-1]].type==="root")c==="@"?l[s[e]]={type:"keyframes",value:"",className:"keyword",children:[]}:l[s[e]]={type:"selector",value:"",className:"",children:[]},j.children.push(s[e]);else if(c==="}"){l[s[e-1]].endBracket="}",e--,s[e]=o(),u++;continue}else l[s[e-1]].type==="keyframes"?(l[s[e]]={type:"selector",value:"",className:"",children:[]},l[s[e-1]].children.push(s[e])):l[s[e-1]].type==="selector"&&(l[s[e-1]].children.length&&(l[s[e]]={type:"br",value:"",className:"",children:[]},l[s[e-1]].children.push(s[e]),s[e]=o()),l[s[e]]={type:"propName",value:"",className:"",children:[]},l[s[e-1]].children.push(s[e]));l[s[e]].type==="keyframes"?c==="{"?(l[s[e]].value=l[s[e]].value.replace(/(^\s+|\s+$)/g,""),l[s[e]].startBracket="{",e++,s[e]=o()):l[s[e]].startBracket||(l[s[e]].value+=c):l[s[e]].type==="selector"?c==="{"?(l[s[e]].value=l[s[e]].value.replace(/(^\s+|\s+$)/g,"")+" ",l[s[e]].startBracket="{",e++,s[e]=o()):l[s[e]].startBracket||(l[s[e]].value+=c):l[s[e]].type==="propName"?c===":"?(l[s[e]].value=l[s[e]].value.replace(/(^\s+|\s+$)/g,""),s[e]=o(),l[s[e]]={type:"colon",value:": ",children:[]},l[s[e-1]].children.push(s[e]),s[e]=o(),l[s[e]]={type:"propValue",value:"",children:[]},l[s[e-1]].children.push(s[e])):(l[s[e]].value.length>0||c.replace(/[\s\n]/g,"").length>0)&&(l[s[e]].value+=c):l[s[e]].type==="propValue"&&(c===";"?(l[s[e]].value=l[s[e]].value.replace(/(^\s+|\s+$)/g,""),s[e]=o(),l[s[e]]={type:"semicolon",value:c,children:[]},l[s[e-1]].children.push(s[e]),s[e]=o()):(g[z].value.length>0||c.replace(/[\n]/g,"").length>0)&&(l[s[e]].value+=c)),u++}const C=(c,b=0)=>c.map(x=>({...l[x],level:b,children:C(l[x].children,b+1)}));return C(j.children)},m=()=>n.value.split(/[\n\r]/).map(l=>({type:"text",value:l,children:[]})),r=E(()=>{switch(n.lang){case"css":return N();default:return m()}}),h=()=>{p.value?V(p.value.innerText,()=>{F.success("复制成功")}):V(n.value)};return(l,i)=>(a(),t("div",O,[l.copyable?(a(),L(K,{key:0,onClick:h})):k("",!0),T("pre",{ref_key:"preBox",ref:p,class:"mj-pre-container"},[v("      "),l.lang==="css"?(a(),L(A,{key:0,list:r.value},null,8,["list"])):(a(),t(d,{key:1},[v(`
        `),(a(!0),t(d,null,B(r.value,(g,u)=>(a(),t("p",{key:u},y(g.value),1))),128)),v(`
      `)],64)),v(`
    `)],512)]))}});export{X as _};
