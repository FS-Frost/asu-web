import{s as J,n as M,r as U,d as W,u as X,g as Y,e as Z}from"../chunks/scheduler.xiAKmmds.js";import{S as K,i as Q,e as o,s as A,c,a as f,y as V,f as w,d as _,o as n,g as R,h as l,z as q,u as ee,v as te,w as ae,n as F,l as G,x as se}from"../chunks/index.CUcM17zg.js";import{a as z}from"../chunks/store.BWd8lMww.js";const ne=!0,_e=Object.freeze(Object.defineProperty({__proto__:null,prerender:ne},Symbol.toStringTag,{value:"Module"}));function re(d){let t,s,i,r,u="Inicio",p,a,e,v="Carteles",b,$,h,N="Copiar movimiento",S,g,C,E,m,O="Acerca de",j,P;return{c(){t=o("nav"),s=o("div"),i=o("div"),r=o("a"),r.textContent=u,p=A(),a=o("div"),e=o("a"),e.textContent=v,b=A(),$=o("div"),h=o("a"),h.textContent=N,S=A(),g=o("div"),C=o("div"),E=o("div"),m=o("a"),m.textContent=O,this.h()},l(k){t=c(k,"NAV",{class:!0,"aria-label":!0});var x=f(t);s=c(x,"DIV",{id:!0,class:!0});var y=f(s);i=c(y,"DIV",{class:!0});var I=f(i);r=c(I,"A",{class:!0,href:!0,"data-svelte-h":!0}),V(r)!=="svelte-1u1fyf"&&(r.textContent=u),p=w(I),a=c(I,"DIV",{class:!0});var D=f(a);e=c(D,"A",{class:!0,href:!0,"data-svelte-h":!0}),V(e)!=="svelte-1em7247"&&(e.textContent=v),b=w(D),$=c(D,"DIV",{class:!0});var B=f($);h=c(B,"A",{class:!0,href:!0,"data-svelte-h":!0}),V(h)!=="svelte-ye6hjg"&&(h.textContent=N),B.forEach(_),D.forEach(_),I.forEach(_),S=w(y),g=c(y,"DIV",{class:!0});var H=f(g);C=c(H,"DIV",{class:!0});var L=f(C);E=c(L,"DIV",{class:!0});var T=f(E);m=c(T,"A",{class:!0,href:!0,"data-svelte-h":!0}),V(m)!=="svelte-btfqoe"&&(m.textContent=O),T.forEach(_),L.forEach(_),H.forEach(_),y.forEach(_),x.forEach(_),this.h()},h(){n(r,"class","navbar-item"),n(r,"href","#_"),n(e,"class","navbar-link"),n(e,"href","#_"),n(h,"class","navbar-item"),n(h,"href","#_"),n($,"class","navbar-dropdown"),n(a,"class","navbar-item has-dropdown is-hoverable"),n(i,"class","navbar-start"),n(m,"class","button is-light"),n(m,"href","#_"),n(E,"class","buttons"),n(C,"class","navbar-item"),n(g,"class","navbar-end"),n(s,"id","navbarBasicExample"),n(s,"class","navbar-menu"),n(t,"class","navbar"),n(t,"aria-label","main navigation")},m(k,x){R(k,t,x),l(t,s),l(s,i),l(i,r),l(i,p),l(i,a),l(a,e),l(a,b),l(a,$),l($,h),l(s,S),l(s,g),l(g,C),l(C,E),l(E,m),j||(P=[q(r,"click",d[0]),q(h,"click",d[1]),q(m,"click",d[2])],j=!0)},p:M,i:M,o:M,d(k){k&&_(t),j=!1,U(P)}}}function le(d){return[()=>z.set("inicio"),()=>z.set("carteles.copiarMovimiento"),()=>z.set("acercaDe")]}class ie extends K{constructor(t){super(),Q(this,t,le,re,J,{})}}function oe(d){let t,s,i,r,u;s=new ie({});const p=d[1].default,a=W(p,d,d[0],null);return{c(){t=o("div"),ee(s.$$.fragment),i=A(),r=o("main"),a&&a.c(),this.h()},l(e){t=c(e,"DIV",{class:!0});var v=f(t);te(s.$$.fragment,v),i=w(v),r=c(v,"MAIN",{class:!0});var b=f(r);a&&a.l(b),b.forEach(_),v.forEach(_),this.h()},h(){n(r,"class","svelte-15hr64"),n(t,"class","app svelte-15hr64")},m(e,v){R(e,t,v),ae(s,t,null),l(t,i),l(t,r),a&&a.m(r,null),u=!0},p(e,[v]){a&&a.p&&(!u||v&1)&&X(a,p,e,e[0],u?Z(p,e[0],v,null):Y(e[0]),null)},i(e){u||(F(s.$$.fragment,e),F(a,e),u=!0)},o(e){G(s.$$.fragment,e),G(a,e),u=!1},d(e){e&&_(t),se(s),a&&a.d(e)}}}function ce(d,t,s){let{$$slots:i={},$$scope:r}=t;return d.$$set=u=>{"$$scope"in u&&s(0,r=u.$$scope)},[r,i]}class fe extends K{constructor(t){super(),Q(this,t,ce,oe,J,{})}}export{fe as component,_e as universal};