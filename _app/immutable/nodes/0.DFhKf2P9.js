import{s as B,e as p,t as J,c as _,b as h,d as Q,f as m,p as d,i as K,h as u,K as R,j as U,n as z,a as D,g as V,L as W,M as X,N as Y,O as Z,P as ee}from"../chunks/scheduler.DMUG1wwS.js";import{S as T,i as F,b as w,d as y,m as A,a as I,t as E,e as C}from"../chunks/index.Bo2rCWFN.js";import{a as te}from"../chunks/store.x7_RTkg1.js";const ae=!0,me=Object.freeze(Object.defineProperty({__proto__:null,prerender:ae},Symbol.toStringTag,{value:"Module"}));function ne(i){let e,a,r,s,o;return{c(){e=p("a"),a=J(i[0]),this.h()},l(n){e=_(n,"A",{class:!0,href:!0});var t=h(e);a=Q(t,i[0]),t.forEach(m),this.h()},h(){d(e,"class","navbar-item"),d(e,"href",r=H(i[1]))},m(n,t){K(n,e,t),u(e,a),s||(o=R(e,"click",i[2]),s=!0)},p(n,[t]){t&1&&U(a,n[0]),t&2&&r!==(r=H(n[1]))&&d(e,"href",r)},i:z,o:z,d(n){n&&m(e),s=!1,o()}}}function H(i){return`?page=${i}`}function se(i,e,a){let{text:r}=e,{page:s}=e;const o=()=>te.set(s);return i.$$set=n=>{"text"in n&&a(0,r=n.text),"page"in n&&a(1,s=n.page)},[r,s,o]}class O extends T{constructor(e){super(),F(this,e,se,ne,B,{text:0,page:1})}}function re(i){let e,a,r,s,o,n,t,l="Carteles",f,v,$,P,g,q,x,b,N;return s=new O({props:{text:"Inicio",page:"inicio"}}),$=new O({props:{text:"Aplicar alpha",page:"carteles.aplicarAlpha"}}),g=new O({props:{text:"Copiar movimiento",page:"carteles.copiarMovimiento"}}),b=new O({props:{text:"Acerca de",page:"acercaDe"}}),{c(){e=p("nav"),a=p("div"),r=p("div"),w(s.$$.fragment),o=D(),n=p("div"),t=p("div"),t.textContent=l,f=D(),v=p("div"),w($.$$.fragment),P=D(),w(g.$$.fragment),q=D(),x=p("div"),w(b.$$.fragment),this.h()},l(c){e=_(c,"NAV",{class:!0});var k=h(e);a=_(k,"DIV",{class:!0});var M=h(a);r=_(M,"DIV",{class:!0});var S=h(r);y(s.$$.fragment,S),o=V(S),n=_(S,"DIV",{class:!0});var j=h(n);t=_(j,"DIV",{class:!0,"data-svelte-h":!0}),W(t)!=="svelte-x07esn"&&(t.textContent=l),f=V(j),v=_(j,"DIV",{class:!0});var L=h(v);y($.$$.fragment,L),P=V(L),y(g.$$.fragment,L),L.forEach(m),j.forEach(m),S.forEach(m),q=V(M),x=_(M,"DIV",{class:!0});var G=h(x);y(b.$$.fragment,G),G.forEach(m),M.forEach(m),k.forEach(m),this.h()},h(){d(t,"class","navbar-link"),d(v,"class","navbar-dropdown"),d(n,"class","navbar-item has-dropdown is-hoverable"),d(r,"class","navbar-start"),d(x,"class","navbar-end"),d(a,"class","navbar-menu svelte-13i85sg"),d(e,"class","navbar")},m(c,k){K(c,e,k),u(e,a),u(a,r),A(s,r,null),u(r,o),u(r,n),u(n,t),u(n,f),u(n,v),A($,v,null),u(v,P),A(g,v,null),u(a,q),u(a,x),A(b,x,null),N=!0},p:z,i(c){N||(I(s.$$.fragment,c),I($.$$.fragment,c),I(g.$$.fragment,c),I(b.$$.fragment,c),N=!0)},o(c){E(s.$$.fragment,c),E($.$$.fragment,c),E(g.$$.fragment,c),E(b.$$.fragment,c),N=!1},d(c){c&&m(e),C(s),C($),C(g),C(b)}}}class le extends T{constructor(e){super(),F(this,e,null,re,B,{})}}function ie(i){let e,a,r,s,o;a=new le({});const n=i[1].default,t=X(n,i,i[0],null);return{c(){e=p("div"),w(a.$$.fragment),r=D(),s=p("main"),t&&t.c(),this.h()},l(l){e=_(l,"DIV",{class:!0});var f=h(e);y(a.$$.fragment,f),r=V(f),s=_(f,"MAIN",{class:!0});var v=h(s);t&&t.l(v),v.forEach(m),f.forEach(m),this.h()},h(){d(s,"class","svelte-15hr64"),d(e,"class","app svelte-15hr64")},m(l,f){K(l,e,f),A(a,e,null),u(e,r),u(e,s),t&&t.m(s,null),o=!0},p(l,[f]){t&&t.p&&(!o||f&1)&&Y(t,n,l,l[0],o?ee(n,l[0],f,null):Z(l[0]),null)},i(l){o||(I(a.$$.fragment,l),I(t,l),o=!0)},o(l){E(a.$$.fragment,l),E(t,l),o=!1},d(l){l&&m(e),C(a),t&&t.d(l)}}}function oe(i,e,a){let{$$slots:r={},$$scope:s}=e;return i.$$set=o=>{"$$scope"in o&&a(0,s=o.$$scope)},[s,r]}class de extends T{constructor(e){super(),F(this,e,oe,ie,B,{})}}export{de as component,me as universal};