var ln=Array.isArray,an=Array.prototype.indexOf,Kn=Array.from,Zn=Object.defineProperty,dt=Object.getOwnPropertyDescriptor,un=Object.getOwnPropertyDescriptors,zn=Object.prototype,Jn=Array.prototype,on=Object.getPrototypeOf;const Wn=()=>{};function Xn(t){return t()}function Tt(t){for(var n=0;n<t.length;n++)t[n]()}const y=2,gt=4,U=8,ft=16,x=32,V=64,z=128,C=256,J=512,p=1024,D=2048,F=4096,P=8192,L=16384,fn=32768,At=65536,Qn=1<<17,_n=1<<19,kt=1<<20,Et=Symbol("$state"),tr=Symbol("legacy props"),nr=Symbol("");function xt(t){return t===this.v}function cn(t,n){return t!=t?n==n:t!==n||t!==null&&typeof t=="object"||typeof t=="function"}function Dt(t){return!cn(t,this.v)}function vn(t){throw new Error("https://svelte.dev/e/effect_in_teardown")}function pn(){throw new Error("https://svelte.dev/e/effect_in_unowned_derived")}function hn(t){throw new Error("https://svelte.dev/e/effect_orphan")}function dn(){throw new Error("https://svelte.dev/e/effect_update_depth_exceeded")}function rr(){throw new Error("https://svelte.dev/e/hydration_failed")}function er(t){throw new Error("https://svelte.dev/e/props_invalid_value")}function sr(){throw new Error("https://svelte.dev/e/state_descriptors_fixed")}function lr(){throw new Error("https://svelte.dev/e/state_prototype_fixed")}function En(){throw new Error("https://svelte.dev/e/state_unsafe_local_read")}function yn(){throw new Error("https://svelte.dev/e/state_unsafe_mutation")}let $=!1;function ar(){$=!0}const ur=1,or=2,ir=4,fr=8,_r=16,cr=1,vr=2,pr=4,hr=8,dr=16,Er=1,yr=2,wn="[",mn="[!",Tn="]",It={},wr=Symbol();function _t(t,n){var r={f:0,v:t,reactions:null,equals:xt,rv:0,wv:0};return r}function mr(t){return Rt(_t(t))}function gn(t,n=!1){var e;const r=_t(t);return n||(r.equals=Dt),$&&o!==null&&o.l!==null&&((e=o.l).s??(e.s=[])).push(r),r}function Tr(t,n=!1){return Rt(gn(t,n))}function Rt(t){return i!==null&&!k&&i.f&y&&(g===null?Ln([t]):g.push(t)),t}function gr(t,n){return An(t,sn(()=>en(t))),n}function An(t,n){return i!==null&&!k&&rt()&&i.f&(y|ft)&&(g===null||!g.includes(t))&&yn(),kn(t,n)}function kn(t,n){return t.equals(n)||(t.v,t.v=n,t.wv=Jt(),St(t,D),rt()&&f!==null&&f.f&p&&!(f.f&(x|V))&&(A===null?Mn([t]):A.push(t))),n}function St(t,n){var r=t.reactions;if(r!==null)for(var e=rt(),s=r.length,l=0;l<s;l++){var a=r[l],u=a.f;u&D||!e&&a===f||(m(a,n),u&(p|C)&&(u&y?St(a,F):st(a)))}}function Ot(t){console.warn("https://svelte.dev/e/hydration_mismatch")}let S=!1;function Ar(t){S=t}let w;function Y(t){if(t===null)throw Ot(),It;return w=t}function kr(){return Y(b(w))}function xr(t){if(S){if(b(w)!==null)throw Ot(),It;w=t}}function Dr(t=1){if(S){for(var n=t,r=w;n--;)r=b(r);w=r}}function Ir(){for(var t=0,n=w;;){if(n.nodeType===8){var r=n.data;if(r===Tn){if(t===0)return n;t-=1}else(r===wn||r===mn)&&(t+=1)}var e=b(n);n.remove(),n=e}}var yt,xn,Ct,bt;function Rr(){if(yt===void 0){yt=window,xn=document;var t=Element.prototype,n=Node.prototype;Ct=dt(n,"firstChild").get,bt=dt(n,"nextSibling").get,t.__click=void 0,t.__className="",t.__attributes=null,t.__styles=null,t.__e=void 0,Text.prototype.__t=void 0}}function lt(t=""){return document.createTextNode(t)}function at(t){return Ct.call(t)}function b(t){return bt.call(t)}function Sr(t,n){if(!S)return at(t);var r=at(w);if(r===null)r=w.appendChild(lt());else if(n&&r.nodeType!==3){var e=lt();return r==null||r.before(e),Y(e),e}return Y(r),r}function Or(t,n){if(!S){var r=at(t);return r instanceof Comment&&r.data===""?b(r):r}return w}function Cr(t,n=1,r=!1){let e=S?w:t;for(var s;n--;)s=e,e=b(e);if(!S)return e;var l=e==null?void 0:e.nodeType;if(r&&l!==3){var a=lt();return e===null?s==null||s.after(a):e.before(a),Y(a),a}return Y(e),e}function br(t){t.textContent=""}function Nt(t){var n=y|D;f===null?n|=C:f.f|=kt;var r=i!==null&&i.f&y?i:null;const e={children:null,ctx:o,deps:null,equals:xt,f:n,fn:t,reactions:null,rv:0,v:null,wv:0,parent:r??f};return r!==null&&(r.children??(r.children=[])).push(e),e}function Nr(t){const n=Nt(t);return n.equals=Dt,n}function qt(t){var n=t.children;if(n!==null){t.children=null;for(var r=0;r<n.length;r+=1){var e=n[r];e.f&y?ct(e):O(e)}}}function Dn(t){for(var n=t.parent;n!==null;){if(!(n.f&y))return n;n=n.parent}return null}function Pt(t){var n,r=f;tt(Dn(t));try{qt(t),n=Xt(t)}finally{tt(r)}return n}function Ft(t){var n=Pt(t),r=(R||t.f&C)&&t.deps!==null?F:p;m(t,r),t.equals(n)||(t.v=n,t.wv=Jt())}function ct(t){qt(t),B(t,0),m(t,L),t.v=t.children=t.deps=t.ctx=t.reactions=null}function Lt(t){f===null&&i===null&&hn(),i!==null&&i.f&C&&pn(),vt&&vn()}function In(t,n){var r=n.last;r===null?n.last=n.first=t:(r.next=t,t.prev=r,n.last=t)}function M(t,n,r,e=!0){var s=(t&V)!==0,l=f,a={ctx:o,deps:null,deriveds:null,nodes_start:null,nodes_end:null,f:t|D,first:null,fn:n,last:null,next:null,parent:s?null:l,prev:null,teardown:null,transitions:null,wv:0};if(r){var u=N;try{wt(!0),pt(a),a.f|=fn}catch(T){throw O(a),T}finally{wt(u)}}else n!==null&&st(a);var _=r&&a.deps===null&&a.first===null&&a.nodes_start===null&&a.teardown===null&&(a.f&(kt|z))===0;if(!_&&!s&&e&&(l!==null&&In(a,l),i!==null&&i.f&y)){var c=i;(c.children??(c.children=[])).push(a)}return a}function qr(t){const n=M(U,null,!1);return m(n,p),n.teardown=t,n}function Rn(t){Lt();var n=f!==null&&(f.f&x)!==0&&o!==null&&!o.m;if(n){var r=o;(r.e??(r.e=[])).push({fn:t,effect:f,reaction:i})}else{var e=Mt(t);return e}}function Pr(t){return Lt(),Sn(t)}function Fr(t){const n=M(V,t,!0);return(r={})=>new Promise(e=>{r.outro?bn(n,()=>{O(n),e(void 0)}):(O(n),e(void 0))})}function Mt(t){return M(gt,t,!1)}function Sn(t){return M(U,t,!0)}function Lr(t,n=[],r=Nt){const e=n.map(r);return On(()=>t(...e.map(en)))}function On(t,n=0){return M(U|ft|n,t,!0)}function Mr(t,n=!0){return M(U|x,t,!0,n)}function Yt(t){var n=t.teardown;if(n!==null){const r=vt,e=i;mt(!0),Q(null);try{n.call(null)}finally{mt(r),Q(e)}}}function Ht(t){var n=t.deriveds;if(n!==null){t.deriveds=null;for(var r=0;r<n.length;r+=1)ct(n[r])}}function jt(t,n=!1){var r=t.first;for(t.first=t.last=null;r!==null;){var e=r.next;O(r,n),r=e}}function Cn(t){for(var n=t.first;n!==null;){var r=n.next;n.f&x||O(n),n=r}}function O(t,n=!0){var r=!1;if((n||t.f&_n)&&t.nodes_start!==null){for(var e=t.nodes_start,s=t.nodes_end;e!==null;){var l=e===s?null:b(e);e.remove(),e=l}r=!0}jt(t,n&&!r),Ht(t),B(t,0),m(t,L);var a=t.transitions;if(a!==null)for(const _ of a)_.stop();Yt(t);var u=t.parent;u!==null&&u.first!==null&&Bt(t),t.next=t.prev=t.teardown=t.ctx=t.deps=t.fn=t.nodes_start=t.nodes_end=null}function Bt(t){var n=t.parent,r=t.prev,e=t.next;r!==null&&(r.next=e),e!==null&&(e.prev=r),n!==null&&(n.first===t&&(n.first=e),n.last===t&&(n.last=r))}function bn(t,n){var r=[];Ut(t,r,!0),Nn(r,()=>{O(t),n&&n()})}function Nn(t,n){var r=t.length;if(r>0){var e=()=>--r||n();for(var s of t)s.out(e)}else n()}function Ut(t,n,r){if(!(t.f&P)){if(t.f^=P,t.transitions!==null)for(const a of t.transitions)(a.is_global||r)&&n.push(a);for(var e=t.first;e!==null;){var s=e.next,l=(e.f&At)!==0||(e.f&x)!==0;Ut(e,n,l?r:!1),e=s}}}function Yr(t){Vt(t,!0)}function Vt(t,n){if(t.f&P){t.f^=P,t.f&p||(t.f^=p),G(t)&&(m(t,D),st(t));for(var r=t.first;r!==null;){var e=r.next,s=(r.f&At)!==0||(r.f&x)!==0;Vt(r,s?n:!1),r=e}if(t.transitions!==null)for(const l of t.transitions)(l.is_global||n)&&l.in()}}const qn=typeof requestIdleCallback>"u"?t=>setTimeout(t,1):requestIdleCallback;let W=!1,X=!1,ut=[],ot=[];function $t(){W=!1;const t=ut.slice();ut=[],Tt(t)}function Gt(){X=!1;const t=ot.slice();ot=[],Tt(t)}function Hr(t){W||(W=!0,queueMicrotask($t)),ut.push(t)}function jr(t){X||(X=!0,qn(Gt)),ot.push(t)}function Pn(){W&&$t(),X&&Gt()}function Kt(t){throw new Error("https://svelte.dev/e/lifecycle_outside_component")}const Zt=0,Fn=1;let K=!1,Z=Zt,H=!1,j=null,N=!1,vt=!1;function wt(t){N=t}function mt(t){vt=t}let I=[],q=0;let i=null,k=!1;function Q(t){i=t}let f=null;function tt(t){f=t}let g=null;function Ln(t){g=t}let h=null,E=0,A=null;function Mn(t){A=t}let zt=1,nt=0,R=!1,o=null;function Jt(){return++zt}function rt(){return!$||o!==null&&o.l===null}function G(t){var c;var n=t.f;if(n&D)return!0;if(n&F){var r=t.deps,e=(n&C)!==0;if(r!==null){var s,l,a=(n&J)!==0,u=e&&f!==null&&!R,_=r.length;if(a||u){for(s=0;s<_;s++)l=r[s],(a||!((c=l==null?void 0:l.reactions)!=null&&c.includes(t)))&&(l.reactions??(l.reactions=[])).push(t);a&&(t.f^=J)}for(s=0;s<_;s++)if(l=r[s],G(l)&&Ft(l),l.wv>t.wv)return!0}(!e||f!==null&&!R)&&m(t,p)}return!1}function Yn(t,n){for(var r=n;r!==null;){if(r.f&z)try{r.fn(t);return}catch{r.f^=z}r=r.parent}throw K=!1,t}function Hn(t){return(t.f&L)===0&&(t.parent===null||(t.parent.f&z)===0)}function et(t,n,r,e){if(K){if(r===null&&(K=!1),Hn(n))throw t;return}r!==null&&(K=!0);{Yn(t,n);return}}function Wt(t,n,r=0){var e=t.reactions;if(e!==null)for(var s=0;s<e.length;s++){var l=e[s];l.f&y?Wt(l,n,r+1):n===l&&(r===0?m(l,D):l.f&p&&m(l,F),st(l))}}function Xt(t){var ht;var n=h,r=E,e=A,s=i,l=R,a=g,u=o,_=k,c=t.f;h=null,E=0,A=null,i=c&(x|V)?null:t,R=!N&&(c&C)!==0,g=null,o=t.ctx,k=!1,nt++;try{var T=(0,t.fn)(),v=t.deps;if(h!==null){var d;if(B(t,E),v!==null&&E>0)for(v.length=E+h.length,d=0;d<h.length;d++)v[E+d]=h[d];else t.deps=v=h;if(!R)for(d=E;d<v.length;d++)((ht=v[d]).reactions??(ht.reactions=[])).push(t)}else v!==null&&E<v.length&&(B(t,E),v.length=E);if(rt()&&A!==null&&!(t.f&(y|F|D)))for(d=0;d<A.length;d++)Wt(A[d],t);return s!==null&&nt++,T}finally{h=n,E=r,A=e,i=s,R=l,g=a,o=u,k=_}}function jn(t,n){let r=n.reactions;if(r!==null){var e=an.call(r,t);if(e!==-1){var s=r.length-1;s===0?r=n.reactions=null:(r[e]=r[s],r.pop())}}r===null&&n.f&y&&(h===null||!h.includes(n))&&(m(n,F),n.f&(C|J)||(n.f^=J),B(n,0))}function B(t,n){var r=t.deps;if(r!==null)for(var e=n;e<r.length;e++)jn(t,r[e])}function pt(t){var n=t.f;if(!(n&L)){m(t,p);var r=f,e=o;f=t;try{n&ft?Cn(t):jt(t),Ht(t),Yt(t);var s=Xt(t);t.teardown=typeof s=="function"?s:null,t.wv=zt;var l=t.deps,a}catch(u){et(u,t,r,e||t.ctx)}finally{f=r}}}function Qt(){if(q>1e3){q=0;try{dn()}catch(t){if(j!==null)et(t,j,null);else throw t}}q++}function tn(t){var n=t.length;if(n!==0){Qt();var r=N;N=!0;try{for(var e=0;e<n;e++){var s=t[e];s.f&p||(s.f^=p);var l=[];nn(s,l),Bn(l)}}finally{N=r}}}function Bn(t){var n=t.length;if(n!==0)for(var r=0;r<n;r++){var e=t[r];if(!(e.f&(L|P)))try{G(e)&&(pt(e),e.deps===null&&e.first===null&&e.nodes_start===null&&(e.teardown===null?Bt(e):e.fn=null))}catch(s){et(s,e,null,e.ctx)}}}function Un(){if(H=!1,q>1001)return;const t=I;I=[],tn(t),H||(q=0,j=null)}function st(t){Z===Zt&&(H||(H=!0,queueMicrotask(Un))),j=t;for(var n=t;n.parent!==null;){n=n.parent;var r=n.f;if(r&(V|x)){if(!(r&p))return;n.f^=p}}I.push(n)}function nn(t,n){var r=t.first,e=[];t:for(;r!==null;){var s=r.f,l=(s&x)!==0,a=l&&(s&p)!==0,u=r.next;if(!a&&!(s&P))if(s&U){if(l)r.f^=p;else try{G(r)&&pt(r)}catch(v){et(v,r,null,r.ctx)}var _=r.first;if(_!==null){r=_;continue}}else s&gt&&e.push(r);if(u===null){let v=r.parent;for(;v!==null;){if(t===v)break t;var c=v.next;if(c!==null){r=c;continue t}v=v.parent}}r=u}for(var T=0;T<e.length;T++)_=e[T],n.push(_),nn(_,n)}function rn(t){var n=Z,r=I;try{Qt();const s=[];Z=Fn,I=s,H=!1,tn(r);var e=t==null?void 0:t();return Pn(),(I.length>0||s.length>0)&&rn(),q=0,j=null,e}finally{Z=n,I=r}}async function Br(){await Promise.resolve(),rn()}function en(t){var T;var n=t.f,r=(n&y)!==0;if(r&&n&L){var e=Pt(t);return ct(t),e}if(i!==null&&!k){g!==null&&g.includes(t)&&En();var s=i.deps;t.rv<nt&&(t.rv=nt,h===null&&s!==null&&s[E]===t?E++:h===null?h=[t]:h.push(t))}else if(r&&t.deps===null)for(var l=t,a=l.parent,u=l;a!==null;)if(a.f&y){var _=a;u=_,a=_.parent}else{var c=a;(T=c.deriveds)!=null&&T.includes(u)||(c.deriveds??(c.deriveds=[])).push(u);break}return r&&(l=t,G(l)&&Ft(l)),t.v}function sn(t){var n=k;try{return k=!0,t()}finally{k=n}}const Vn=-7169;function m(t,n){t.f=t.f&Vn|n}function Ur(t,n=!1,r){o={p:o,c:null,e:null,m:!1,s:t,x:null,l:null},$&&!n&&(o.l={s:null,u:null,r1:[],r2:_t(!1)})}function Vr(t){const n=o;if(n!==null){t!==void 0&&(n.x=t);const a=n.e;if(a!==null){var r=f,e=i;n.e=null;try{for(var s=0;s<a.length;s++){var l=a[s];tt(l.effect),Q(l.reaction),Mt(l.fn)}}finally{tt(r),Q(e)}}o=n.p,n.m=!0}return t||{}}function $r(t){if(!(typeof t!="object"||!t||t instanceof EventTarget)){if(Et in t)it(t);else if(!Array.isArray(t))for(let n in t){const r=t[n];typeof r=="object"&&r&&Et in r&&it(r)}}}function it(t,n=new Set){if(typeof t=="object"&&t!==null&&!(t instanceof EventTarget)&&!n.has(t)){n.add(t),t instanceof Date&&t.getTime();for(let e in t)try{it(t[e],n)}catch{}const r=on(t);if(r!==Object.prototype&&r!==Array.prototype&&r!==Map.prototype&&r!==Set.prototype&&r!==Date.prototype){const e=un(r);for(let s in e){const l=e[s].get;if(l)try{l.call(t)}catch{}}}}}function Gr(t){o===null&&Kt(),$&&o.l!==null?Gn(o).m.push(t):Rn(()=>{const n=sn(t);if(typeof n=="function")return n})}function $n(t,n,{bubbles:r=!1,cancelable:e=!1}={}){return new CustomEvent(t,{detail:n,bubbles:r,cancelable:e})}function Kr(){const t=o;return t===null&&Kt(),(n,r,e)=>{var l;const s=(l=t.s.$$events)==null?void 0:l[n];if(s){const a=ln(s)?s.slice():[s],u=$n(n,r,e);for(const _ of a)_.call(t.x,u);return!u.defaultPrevented}return!0}}function Gn(t){var n=t.l;return n.u??(n.u={a:[],b:[],m:[]})}export{er as $,Sr as A,xr as B,Cr as C,zn as D,At as E,Jn as F,_t as G,mn as H,sr as I,An as J,dt as K,f as L,lr as M,on as N,ln as O,Mt as P,Sn as Q,Hr as R,Et as S,Qn as T,wr as U,x as V,V as W,tt as X,$ as Y,vr as Z,tr as _,kr as a,Nr as a0,pr as a1,Dt as a2,cr as a3,hr as a4,gn as a5,dr as a6,un as a7,jr as a8,nr as a9,kn as aA,or as aB,Ut as aC,Nn as aD,O as aE,ir as aF,fr as aG,_r as aH,rt as aI,xn as aJ,Dr as aK,Kr as aL,gr as aM,rn as aa,Zn as ab,Gr as ac,Br as ad,mr as ae,Tr as af,at as ag,br as ah,Q as ai,i as aj,qr as ak,wn as al,b as am,lt as an,_n as ao,Er as ap,yr as aq,Rr as ar,It as as,Tn as at,Ot as au,rr as av,Kn as aw,Fr as ax,P as ay,ur as az,On as b,Ar as c,Yr as d,Mr as e,w as f,cn as g,S as h,Rn as i,o as j,sn as k,Tt as l,en as m,Wn as n,Xn as o,bn as p,$r as q,Ir as r,Y as s,Nt as t,Pr as u,ar as v,Ur as w,Or as x,Lr as y,Vr as z};
