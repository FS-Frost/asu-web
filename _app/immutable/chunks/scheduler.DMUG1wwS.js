function T(){}function C(t,n){for(const e in n)t[e]=n[e];return t}function D(t){return t()}function K(){return Object.create(null)}function q(t){t.forEach(D)}function Q(t){return typeof t=="function"}function W(t,n){return t!=t?n==n:t!==n||t&&typeof t=="object"||typeof t=="function"}let h;function V(t,n){return t===n?!0:(h||(h=document.createElement("a")),h.href=n,t===h.href)}function X(t){return Object.keys(t).length===0}function H(t,...n){if(t==null){for(const i of n)i(void 0);return T}const e=t.subscribe(...n);return e.unsubscribe?()=>e.unsubscribe():e}function Y(t,n,e){t.$$.on_destroy.push(H(n,e))}function Z(t,n,e,i){if(t){const r=w(t,n,e,i);return t[0](r)}}function w(t,n,e,i){return t[1]&&i?C(e.ctx.slice(),t[1](i(n))):e.ctx}function $(t,n,e,i){if(t[2]&&i){const r=t[2](i(e));if(n.dirty===void 0)return r;if(typeof r=="object"){const s=[],c=Math.max(n.dirty.length,r.length);for(let u=0;u<c;u+=1)s[u]=n.dirty[u]|r[u];return s}return n.dirty|r}return n.dirty}function tt(t,n,e,i,r,s){if(r){const c=w(n,e,i,s);t.p(c,r)}}function nt(t){if(t.ctx.length>32){const n=[],e=t.ctx.length/32;for(let i=0;i<e;i++)n[i]=-1;return n}return-1}let p=!1;function et(){p=!0}function it(){p=!1}function P(t,n,e,i){for(;t<n;){const r=t+(n-t>>1);e(r)<=i?t=r+1:n=r}return t}function B(t){if(t.hydrate_init)return;t.hydrate_init=!0;let n=t.childNodes;if(t.nodeName==="HEAD"){const l=[];for(let o=0;o<n.length;o++){const a=n[o];a.claim_order!==void 0&&l.push(a)}n=l}const e=new Int32Array(n.length+1),i=new Int32Array(n.length);e[0]=-1;let r=0;for(let l=0;l<n.length;l++){const o=n[l].claim_order,a=(r>0&&n[e[r]].claim_order<=o?r+1:P(1,r,S=>n[e[S]].claim_order,o))-1;i[l]=e[a]+1;const k=a+1;e[k]=l,r=Math.max(k,r)}const s=[],c=[];let u=n.length-1;for(let l=e[r]+1;l!=0;l=i[l-1]){for(s.push(n[l-1]);u>=l;u--)c.push(n[u]);u--}for(;u>=0;u--)c.push(n[u]);s.reverse(),c.sort((l,o)=>l.claim_order-o.claim_order);for(let l=0,o=0;l<c.length;l++){for(;o<s.length&&c[l].claim_order>=s[o].claim_order;)o++;const a=o<s.length?s[o]:null;t.insertBefore(c[l],a)}}function M(t,n){if(p){for(B(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;n!==t.actual_end_child?(n.claim_order!==void 0||n.parentNode!==t)&&t.insertBefore(n,t.actual_end_child):t.actual_end_child=n.nextSibling}else(n.parentNode!==t||n.nextSibling!==null)&&t.appendChild(n)}function rt(t,n,e){p&&!e?M(t,n):(n.parentNode!==t||n.nextSibling!=e)&&t.insertBefore(n,e||null)}function ct(t){t.parentNode&&t.parentNode.removeChild(t)}function O(t){return document.createElement(t)}function v(t){return document.createTextNode(t)}function lt(){return v(" ")}function ut(){return v("")}function st(t,n,e,i){return t.addEventListener(n,e,i),()=>t.removeEventListener(n,e,i)}function ot(t,n,e){e==null?t.removeAttribute(n):t.getAttribute(n)!==e&&t.setAttribute(n,e)}function at(t){return t.dataset.svelteH}function ft(t){return Array.from(t.childNodes)}function L(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function A(t,n,e,i,r=!1){L(t);const s=(()=>{for(let c=t.claim_info.last_index;c<t.length;c++){const u=t[c];if(n(u)){const l=e(u);return l===void 0?t.splice(c,1):t[c]=l,r||(t.claim_info.last_index=c),u}}for(let c=t.claim_info.last_index-1;c>=0;c--){const u=t[c];if(n(u)){const l=e(u);return l===void 0?t.splice(c,1):t[c]=l,r?l===void 0&&t.claim_info.last_index--:t.claim_info.last_index=c,u}}return i()})();return s.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,s}function z(t,n,e,i){return A(t,r=>r.nodeName===n,r=>{const s=[];for(let c=0;c<r.attributes.length;c++){const u=r.attributes[c];e[u.name]||s.push(u.name)}s.forEach(c=>r.removeAttribute(c))},()=>i(n))}function _t(t,n,e){return z(t,n,e,O)}function F(t,n){return A(t,e=>e.nodeType===3,e=>{const i=""+n;if(e.data.startsWith(i)){if(e.data.length!==i.length)return e.splitText(i.length)}else e.data=i},()=>v(n),!0)}function dt(t){return F(t," ")}function ht(t,n){n=""+n,t.data!==n&&(t.data=n)}function mt(t,n){t.value=n??""}function pt(t,n,e,i){e==null?t.style.removeProperty(n):t.style.setProperty(n,e,"")}function I(t,n,{bubbles:e=!1,cancelable:i=!1}={}){return new CustomEvent(t,{detail:n,bubbles:e,cancelable:i})}function bt(t,n){const e=[];let i=0;for(const r of n.childNodes)if(r.nodeType===8){const s=r.textContent.trim();s===`HEAD_${t}_END`?(i-=1,e.push(r)):s===`HEAD_${t}_START`&&(i+=1,e.push(r))}else i>0&&e.push(r);return e}function yt(t,n){return new t(n)}let m;function b(t){m=t}function E(){if(!m)throw new Error("Function called outside component initialization");return m}function xt(t){E().$$.on_mount.push(t)}function gt(t){E().$$.after_update.push(t)}function vt(){const t=E();return(n,e,{cancelable:i=!1}={})=>{const r=t.$$.callbacks[n];if(r){const s=I(n,e,{cancelable:i});return r.slice().forEach(c=>{c.call(t,s)}),!s.defaultPrevented}return!0}}const d=[],N=[];let _=[];const x=[],j=Promise.resolve();let g=!1;function R(){g||(g=!0,j.then(G))}function Et(){return R(),j}function U(t){_.push(t)}function kt(t){x.push(t)}const y=new Set;let f=0;function G(){if(f!==0)return;const t=m;do{try{for(;f<d.length;){const n=d[f];f++,b(n),J(n.$$)}}catch(n){throw d.length=0,f=0,n}for(b(null),d.length=0,f=0;N.length;)N.pop()();for(let n=0;n<_.length;n+=1){const e=_[n];y.has(e)||(y.add(e),e())}_.length=0}while(d.length);for(;x.length;)x.pop()();g=!1,y.clear(),b(t)}function J(t){if(t.fragment!==null){t.update(),q(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(U)}}function Nt(t){const n=[],e=[];_.forEach(i=>t.indexOf(i)===-1?n.push(i):e.push(i)),e.forEach(i=>i()),_=n}export{X as A,U as B,Nt as C,m as D,b as E,D as F,d as G,R as H,et as I,it as J,st as K,at as L,Z as M,tt as N,nt as O,$ as P,bt as Q,mt as R,V as S,vt as T,kt as U,lt as a,ft as b,_t as c,F as d,O as e,ct as f,dt as g,M as h,rt as i,ht as j,Y as k,ut as l,gt as m,T as n,xt as o,ot as p,pt as q,N as r,W as s,v as t,yt as u,Et as v,q as w,K as x,G as y,Q as z};