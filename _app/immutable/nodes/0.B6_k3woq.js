import{s as ue,e as v,t as ke,c as m,b as w,d as we,f as p,p as c,i as ce,h as u,K as ie,j as xe,n as le,o as be,a as $,L as Q,g as h,w as Ie,r as $e,M as Me,N as Ve,O as Ce,P as De}from"../chunks/scheduler.4tcewBu8.js";import{S as fe,i as de,b as x,d as I,m as M,a as b,t as k,e as V}from"../chunks/index.kb8icfUQ.js";import{a as he,z as U,t as K}from"../chunks/text.CRd4b8xu.js";const ye=!0,Oe=Object.freeze(Object.defineProperty({__proto__:null,prerender:ye},Symbol.toStringTag,{value:"Module"}));function Ee(i){let e,t,l,r,s,f;return{c(){e=v("a"),t=ke(i[0]),this.h()},l(a){e=m(a,"A",{class:!0,href:!0});var n=w(e);t=we(n,i[0]),n.forEach(p),this.h()},h(){c(e,"class",l="navbar-item "+(i[2]?"is-active":"")),c(e,"href",r=_e(i[1]))},m(a,n){ce(a,e,n),u(e,t),s||(f=ie(e,"click",i[3]),s=!0)},p(a,[n]){n&1&&xe(t,a[0]),n&4&&l!==(l="navbar-item "+(a[2]?"is-active":""))&&c(e,"class",l),n&2&&r!==(r=_e(a[1]))&&c(e,"href",r)},i:le,o:le,d(a){a&&p(e),s=!1,f()}}}function _e(i){return`?pagina=${i}`}function Le(i,e,t){let{text:l}=e,{page:r}=e,s=!1;be(()=>{he.subscribe(a=>{t(2,s=r===a)})});const f=()=>he.set(r);return i.$$set=a=>{"text"in a&&t(0,l=a.text),"page"in a&&t(1,r=a.page)},[l,r,s,f]}class L extends fe{constructor(e){super(),de(this,e,Le,Ee,ue,{text:0,page:1})}}const oe=U.object({sha:U.string().default(""),ref:U.string().default(""),actor:U.string().default("")});async function Se(){const i=oe.parse({}),e=await fetch("build-info.json");if(!e.ok)return console.error(`failed to fetch build info, status ${e.status}`),i;const t=await e.json(),l=oe.safeParse(t);return l.success?l.data:(console.error("invalid build info",{parseResult:l}),i)}function je(i){let e,t,l='<span aria-hidden="true"></span> <span aria-hidden="true"></span> <span aria-hidden="true"></span> <span aria-hidden="true"></span>',r,s,f,a,n,o,_,ve="Carteles",W,g,S,X,j,Y,A,Z,H,ee,C,P,me="Karaokes",te,D,T,ae,B,ne,N,se,z,pe='<a class="navbar-item" title="Ver en GitHub" href="https://github.com/FS-Frost/asu-web" target="_blank">Ver en GitHub</a>',F,re,ge;return a=new L({props:{text:"Inicio",page:"inicio"}}),S=new L({props:{text:K.aplicarAlpha,page:"carteles.aplicarAlpha"}}),j=new L({props:{text:K.aplicarColor,page:"carteles.aplicarColor"}}),A=new L({props:{text:K.aplicarSecuenciaPosiciones,page:"carteles.aplicarSecuenciaPosiciones"}}),H=new L({props:{text:K.copiarMovimiento,page:"carteles.copiarMovimiento"}}),T=new L({props:{text:K.dividirKaraoke,page:"karaokes.dividirKaraoke"}}),B=new L({props:{text:K.dividirSilabas,page:"karaokes.dividirSilabas"}}),N=new L({props:{text:K.acercaDe,page:"acercaDe"}}),{c(){e=v("nav"),t=v("a"),t.innerHTML=l,r=$(),s=v("div"),f=v("div"),x(a.$$.fragment),n=$(),o=v("div"),_=v("div"),_.textContent=ve,W=$(),g=v("div"),x(S.$$.fragment),X=$(),x(j.$$.fragment),Y=$(),x(A.$$.fragment),Z=$(),x(H.$$.fragment),ee=$(),C=v("div"),P=v("div"),P.textContent=me,te=$(),D=v("div"),x(T.$$.fragment),ae=$(),x(B.$$.fragment),ne=$(),x(N.$$.fragment),se=$(),z=v("div"),z.innerHTML=pe,this.h()},l(d){e=m(d,"NAV",{class:!0});var O=w(e);t=m(O,"A",{role:!0,tabindex:!0,class:!0,"data-target":!0,"aria-label":!0,"aria-expanded":!0,href:!0,"data-svelte-h":!0}),Q(t)!=="svelte-dlbsti"&&(t.innerHTML=l),r=h(O),s=m(O,"DIV",{class:!0,id:!0});var G=w(s);f=m(G,"DIV",{class:!0});var y=w(f);I(a.$$.fragment,y),n=h(y),o=m(y,"DIV",{class:!0});var q=w(o);_=m(q,"DIV",{class:!0,"data-svelte-h":!0}),Q(_)!=="svelte-x07esn"&&(_.textContent=ve),W=h(q),g=m(q,"DIV",{class:!0});var E=w(g);I(S.$$.fragment,E),X=h(E),I(j.$$.fragment,E),Y=h(E),I(A.$$.fragment,E),Z=h(E),I(H.$$.fragment,E),E.forEach(p),q.forEach(p),ee=h(y),C=m(y,"DIV",{class:!0});var R=w(C);P=m(R,"DIV",{class:!0,"data-svelte-h":!0}),Q(P)!=="svelte-1mtzdlz"&&(P.textContent=me),te=h(R),D=m(R,"DIV",{class:!0});var J=w(D);I(T.$$.fragment,J),ae=h(J),I(B.$$.fragment,J),J.forEach(p),R.forEach(p),ne=h(y),I(N.$$.fragment,y),y.forEach(p),se=h(G),z=m(G,"DIV",{class:!0,"data-svelte-h":!0}),Q(z)!=="svelte-bagalk"&&(z.innerHTML=pe),G.forEach(p),O.forEach(p),this.h()},h(){c(t,"role","button"),c(t,"tabindex","0"),c(t,"class","navbar-burger"),c(t,"data-target","navMenu"),c(t,"aria-label","menu"),c(t,"aria-expanded","false"),c(t,"href","javascript:;"),c(_,"class","navbar-link"),c(g,"class","navbar-dropdown"),c(o,"class","navbar-item has-dropdown is-hoverable"),c(P,"class","navbar-link"),c(D,"class","navbar-dropdown"),c(C,"class","navbar-item has-dropdown is-hoverable"),c(f,"class","navbar-start"),c(z,"class","navbar-end"),c(s,"class","navbar-menu"),c(s,"id","navMenu"),c(e,"class","navbar")},m(d,O){ce(d,e,O),u(e,t),i[3](t),u(e,r),u(e,s),u(s,f),M(a,f,null),u(f,n),u(f,o),u(o,_),u(o,W),u(o,g),M(S,g,null),u(g,X),M(j,g,null),u(g,Y),M(A,g,null),u(g,Z),M(H,g,null),u(f,ee),u(f,C),u(C,P),u(C,te),u(C,D),M(T,D,null),u(D,ae),M(B,D,null),u(f,ne),M(N,f,null),u(s,se),u(s,z),i[5](s),F=!0,re||(ge=[ie(t,"click",i[4]),ie(t,"keydown",Ae)],re=!0)},p:le,i(d){F||(b(a.$$.fragment,d),b(S.$$.fragment,d),b(j.$$.fragment,d),b(A.$$.fragment,d),b(H.$$.fragment,d),b(T.$$.fragment,d),b(B.$$.fragment,d),b(N.$$.fragment,d),F=!0)},o(d){k(a.$$.fragment,d),k(S.$$.fragment,d),k(j.$$.fragment,d),k(A.$$.fragment,d),k(H.$$.fragment,d),k(T.$$.fragment,d),k(B.$$.fragment,d),k(N.$$.fragment,d),F=!1},d(d){d&&p(e),i[3](null),V(a),V(S),V(j),V(A),V(H),V(T),V(B),V(N),i[5](null),re=!1,Ie(ge)}}}const Ae=()=>{};function He(i,e,t){oe.parse({});let l,r;function s(){r&&r.classList.toggle("is-active"),l&&l.classList.toggle("is-active")}be(async()=>{await Se()});function f(o){$e[o?"unshift":"push"](()=>{r=o,t(1,r)})}const a=()=>s();function n(o){$e[o?"unshift":"push"](()=>{l=o,t(0,l)})}return[l,r,s,f,a,n]}class Pe extends fe{constructor(e){super(),de(this,e,He,je,ue,{})}}function Te(i){let e,t,l,r,s;t=new Pe({});const f=i[1].default,a=Me(f,i,i[0],null);return{c(){e=v("div"),x(t.$$.fragment),l=$(),r=v("main"),a&&a.c(),this.h()},l(n){e=m(n,"DIV",{class:!0});var o=w(e);I(t.$$.fragment,o),l=h(o),r=m(o,"MAIN",{class:!0});var _=w(r);a&&a.l(_),_.forEach(p),o.forEach(p),this.h()},h(){c(r,"class","svelte-15hr64"),c(e,"class","app svelte-15hr64")},m(n,o){ce(n,e,o),M(t,e,null),u(e,l),u(e,r),a&&a.m(r,null),s=!0},p(n,[o]){a&&a.p&&(!s||o&1)&&Ve(a,f,n,n[0],s?De(f,n[0],o,null):Ce(n[0]),null)},i(n){s||(b(t.$$.fragment,n),b(a,n),s=!0)},o(n){k(t.$$.fragment,n),k(a,n),s=!1},d(n){n&&p(e),V(t),a&&a.d(n)}}}function Be(i,e,t){let{$$slots:l={},$$scope:r}=e;return i.$$set=s=>{"$$scope"in s&&t(0,r=s.$$scope)},[r,l]}class Fe extends fe{constructor(e){super(),de(this,e,Be,Te,ue,{})}}export{Fe as component,Oe as universal};
