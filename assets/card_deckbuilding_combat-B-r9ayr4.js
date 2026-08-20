import{r as X,g as N,b as k,p as C,d as R,s as S}from"./engine-BM5FKrgs.js";import"./three.module-CFuR-rp5.js";import"./main-B69Iltkn.js";import"./modulepreload-polyfill-B5Qt9EMX.js";const m={attack:{key:"attack",name:"Attack",cost:1,text:"造成 6 点伤害",damage:6},defend:{key:"defend",name:"Defend",cost:1,text:"获得 5 点格挡",block:5},heavy:{key:"heavy",name:"Heavy",cost:2,text:"造成 14 点伤害",damage:14},quick:{key:"quick",name:"Quick Strike",cost:0,text:"造成 4 点伤害",damage:4},fortress:{key:"fortress",name:"Fortify",cost:1,text:"获得 9 点格挡",block:9},crush:{key:"crush",name:"Crush",cost:2,text:"造成 18 点伤害",damage:18}};function K(){return X("card_deckbuilding_combat",{bg:1512230,camPos:[0,9,15],lookAt:[0,1.8,0]},O=>{const{scene:o,hud:a}=O;N(o,{s:32,color:3352899});const q=k(o,{w:2,h:3,d:2,color:3968255,x:-5,y:.4,z:0,y0:!0}),r=k(o,{w:3.2,h:4.2,d:2.8,color:14239573,x:5,y:.4,z:0,y0:!0,rough:.45});k(o,{w:1,h:1,d:1,color:16766571,x:4.1,y:4.9,z:0}),k(o,{w:1,h:1,d:1,color:16766571,x:5.9,y:4.9,z:0});const M=C("","top:62px;left:50%;transform:translateX(-50%);min-width:460px;text-align:center"),i=C("","left:50%;bottom:54px;transform:translateX(-50%);width:min(760px,94vw);text-align:center"),H=S(12648430),g=["attack","attack","attack","attack","defend","defend","defend","defend","heavy","heavy"];let f=50,h=0,y=40,v=40,x=10,p=3,$=1,s="fight",u=[],c=[],l=[],n=null,b=0;function L(t){for(let e=t.length-1;e>0;e--){const d=Math.floor(H()*(e+1));[t[e],t[d]]=[t[d],t[e]]}return t}function T(){var t;x=8+Math.floor(H()*7),n&&(o.remove(n),(t=n.material.map)==null||t.dispose(),n.material.dispose()),n=R(`NEXT: ${x} DMG`,{color:"#ffd36c",scale:3.4}),n.position.set(5,7.2,0),o.add(n)}function A(){!u.length&&c.length&&(u=L(c.splice(0)),a.flash("洗回弃牌堆"));const t=u.pop();t&&l.push(t)}function P(){h=0,p=3;for(let t=0;t<5;t++)A();w()}function z(t){$=t,s="fight",v=t===1?40:70,y=v,r.visible=!0,r.scale.set(1,1,1),r.material.color.set(t===1?14239573:10308054),u=L(g.map(e=>m[e])),c=[],l=[],T(),P(),a.hideOverlay(),a.flash(`战斗 ${t}`)}function B(t,e){return`
        <button class="card-tile${p<t.cost?" off":""}" data-card="${e}">
          <div class="cost">⚡ ${t.cost}</div>
          <h3>${t.name}</h3>
          <p style="margin-top:12px;color:#cbd8f7">${t.text}</p>
        </button>`}function w(){M.innerHTML=`
        <div style="display:flex;gap:44px;justify-content:center;font-weight:800">
          <span style="color:#78b5ff">玩家 HP ${f}/50 · 格挡 ${h}</span>
          <span style="color:#ff7d88">敌人 HP ${Math.max(0,y)}/${v}</span>
        </div>
        <div style="margin-top:5px;color:#b9c8ea">战斗 ${$}/2 · 能量 ⚡ ${p}/3 · 牌组 ${g.length}</div>`,s==="fight"&&(i.innerHTML=`
          <div class="hand">${l.map(B).join("")}</div>
          <button data-action="end" style="margin-top:9px;background:#9d4b35">结束回合</button>
          <div style="font-size:11px;color:#94a7d0;margin-top:6px">
            抽牌堆 ${u.length} · 弃牌堆 ${c.length}
          </div>`)}function D(){s="reward",r.visible=!1;const t=[m.quick,m.fortress,m.crush];i.innerHTML=`
        <h2 style="margin-bottom:8px">选择一张奖励牌加入牌组</h2>
        <div class="hand">
          ${t.map(e=>`
            <button class="card-tile" data-reward="${e.key}">
              <div class="cost">⚡ ${e.cost}</div>
              <h3>${e.name}</h3>
              <p style="margin-top:12px;color:#cbd8f7">${e.text}</p>
            </button>`).join("")}
        </div>`,a.flash("敌人被击败！")}function E(){r.visible=!1,$===1?D():(s="won",i.innerHTML="<h2>全部战斗胜利</h2>",a.showOverlay("胜利",`剩余生命 ${f}/50 · 最终牌组 ${g.length} 张`))}function F(t){if(s!=="fight")return;const e=l[t];if(e){if(p<e.cost){a.flash("能量不足");return}p-=e.cost,l.splice(t,1),c.push(e),e.damage&&(y-=e.damage,b=.18,a.flash(`${e.name} 造成 ${e.damage} 伤害`)),e.block&&(h+=e.block,a.flash(`${e.name} 获得 ${e.block} 格挡`)),y<=0?E():w()}}function U(){if(s!=="fight")return;c.push(...l.splice(0));const t=Math.min(h,x),e=x-t;if(h-=t,f-=e,e?a.flash(`敌人造成 ${e} 伤害`):a.flash("格挡了全部伤害"),f<=0){f=0,s="lost",i.innerHTML="<h2>战斗失败</h2>",w(),a.showOverlay("失败","牌组没能撑过敌人的攻击");return}T(),P()}const I=t=>{const e=t.target.closest("[data-card]");if(e){F(Number(e.dataset.card));return}if(t.target.closest('[data-action="end"]')){U();return}const d=t.target.closest("[data-reward]");if(d&&s==="reward"){const j=d.dataset.reward;g.push(j),a.flash(`${m[j].name} 已加入牌组`),z(2)}};return i.addEventListener("click",I),z(1),{update(t){b>0?(b-=t,r.rotation.z=Math.sin(b*75)*.09):r.rotation.z*=Math.exp(-14*t),q.rotation.y=Math.sin(performance.now()*.001)*.08},cleanup(){var t;i.removeEventListener("click",I),M.remove(),i.remove(),n&&(o.remove(n),(t=n.material.map)==null||t.dispose(),n.material.dispose())}}})}export{K as start};
