import{d as r,a as b,h as _,r as h,o as m,b as c,O as d,c as o,e as n,v as f,n as v,s as g,i as y}from"./index-BYA0E31P.js";const p=Symbol("MjFormInjectKey"),j=r({__name:"MjForm",props:{showColon:{type:Boolean,default:!1},labelWidth:{default:80},labelAlign:{default:"right"},model:{}},setup(i){const e=i,a=b([]),s=l=>{a.value.push(l)};_(p,h({showColon:e.showColon,labelWidth:e.labelWidth,labelAlign:e.labelAlign,addField:s}));const t=()=>{};return(l,u)=>(m(),c("form",{class:"mj-form",onSubmit:t},[d(l.$slots,"default")],32))}}),A={class:"mj-form-item__content"},F=r({__name:"MjFormItem",props:{label:{},name:{}},setup(i){const e=y(p),a=o(()=>{const l=["mj-form-item"];return(e==null?void 0:e.labelAlign)==="top"&&l.push("mj-form-item--top"),l}),s=o(()=>e==null?void 0:e.labelWidth),t=o(()=>({width:`${s.value}px`,flex:`0 0 ${s.value}px`,textAlign:(e==null?void 0:e.labelAlign)==="top"||e==null?void 0:e.labelAlign}));return(l,u)=>(m(),c("div",{class:g(a.value)},[n("div",{class:"mj-form-item__label",style:v(t.value)},[n("label",null,f(l.label),1)],4),n("div",A,[d(l.$slots,"default")])],2))}}),S=Object.assign(j,{FormItem:F});export{S as M};
