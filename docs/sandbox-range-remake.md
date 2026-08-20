# Sandbox 练习场复刻方案

对照来源：[Ricardo de Zoete @RicardoDeZoete, 2026-08-19](https://x.com/RicardoDeZoete/status/2090072957561266473)（约 82 秒实机）。  
前序预告：[同账号 2026-08-14](https://x.com/RicardoDeZoete/status/2088260001789784503)（往山上画脸）。  
Jam 背景：The Sandbox Beta Game Jam，主题 **Overgrown**，工具链是 Sandbox Studio + three.js。作者明确说这段还不是正式关卡，只是「武器 + 移动」的练习场，并顺手测地形破坏。

本仓库现有游戏是剪纸风北京跑酷。这份方案不替换现有关卡，而是给出一条 **three.js 浏览器垂直切片** 的落地路径：把帖子里看得见的玩法做成可玩原型。正式 Overgrown 关（植被、山脸、多人对射）放在切片通过之后。

---

## 1. 原片拆解（只记画面里有的）

### 1.1 镜头与角色

- 第三人称过肩，准星钉在屏幕中心，鼠标转镜头，角色朝向跟瞄准方向。
- 角色是体素人：棕牛仔帽、棕上衣、蓝裤、棕靴、灰背包。块状拼装，不是平滑低模，也不是本仓库现有的卡通球熊猫。
- 移动：WASD 走跑、跳跃、短距离冲刺。冲刺会在脚下喷白色体素粉尘，空中也能冲（片中约 0:43、0:49、1:15）。

### 1.2 武器（底栏 4 格，数字键切换）

从 HUD 截到的名称按 `VX-*` 记（个别帧可能被读成 `V2-*`，以 HUD 字形为准）。

| 槽 | 名称 | 射速 / 弹道 | 弹匣（片中出现过） | 命中反馈 |
|---|---|---|---|---|
| 1 | VX-9 Hand Cannon | 半自动，近似 hitscan | `10`，例如 `7/10`、`1/10` | 橙枪口焰；假人闪白 + 飘字 |
| 2 | VX-24 Autogun | 全自动，红激光拖尾 | `24`，例如 `22/24`、`16/24` | 连续 hitscan；假人被打成碎块 |
| 3 | VX-8 Scattergun | 霰弹散射（多弹丸） | `6`，例如 `5/6` | 大范围打掉假人块 |
| 4 | VX-R7 Blockbuster | 可见慢弹，落地爆炸 | `3`，例如 `1/3`、`2/3`、`3/3` | 橙黄火球；打穿墙、在地板挖坑 |

空弹或手动换弹时，准星周围出现圆形进度条，下方字 `RELOADING`。

### 1.3 靶人

- 人形剪影，体素搭的，颜色是青 / 品红 / 黄，脚下有同色光圈底座。
- 命中：整身闪白，飘白色伤害数字（片中见过 `1`、`4`、`11`、`12`、`18`）。
- 血量打空后碎成同色物理小方块，落在网格地板上。
- 片后段靶人会再刷出来（约 0:53），练习场有重生。

### 1.4 地形破坏

- 世界是体素网格，不是 CSG 挖洞，也不是蒙皮碎裂。
- Blockbuster 命中后，地板和深灰墙被挖掉一圈立方块，边缘呈锯齿弹坑；飞出深色碎块，稍后消失。
- 部分深色墙用 Autogun / Scattergun 打不动（约 0:17–0:33），说明有 **可破坏 / 不可破坏** 材质层。
- 地板是深色底 + 发光青网格；后墙有一圈粗青线框。远处漂浮青 / 品红 / 黄发光方块，偏训练室而不是户外 Overgrown。

### 1.5 HUD（Play Mode）

- 左上：FPS、`VITALS 100/100` + 橙黄血条。
- 顶栏：编辑器态标题（片中像 `VoxEdit - Play Mode` / 同类 Play Mode 字样）。复刻时做成游戏内标题即可，不必仿编辑器壳。
- 右上：当前武器名 + 弹数 + 武器剪影。
- 底中：4 格热键栏，选中格橙框。
- 中心：准星随武器变形状。

### 1.6 前序预告里还没进本切片的东西

8/14 那条是户外体素山崖、草地、方块云，作者在往山体「画脸」。Jam 主题 Overgrown。那是正式关方向，不是这段练习场。方案里标成 P2。

---

## 2. 复刻目标

**P0 垂直切片（对标这条 82 秒视频）**

能在浏览器里完成同一套动作：过肩瞄准、四把枪、打靶碎裂、火箭挖坑、跳 + 冲刺、换弹 HUD。画风用程序体素，不依赖 MagicaVoxel 外部资源。

**刻意不做（本切片）**

- Sandbox Studio / VoxEdit 编辑器 UI、账号、暂停菜单真功能。
- 多人、队伍分（Azure / Ember）、计时积分。
- 户外 Overgrown 大世界、往山上画脸。
- 真实弹道掉落、后坐力相机、掩体 AI。

**成功标准**

1. 60fps 目标：练习场约 `48×12×48` 体素、同时不超过 ~400 块碎片。
2. 手感：冲刺有明显位移和脚底粉尘；火箭弹坑一眼能认。
3. 冒烟测试能断言：切枪、开火扣弹、靶人碎裂、地形被挖、换弹结束回满。

---

## 3. 和本仓库的关系

现有 `beijing-platformer` 可复用的只有骨架，玩法层要新写。

| 现有 | 复用方式 |
|---|---|
| Vite + three r169 | 原样。切片作为第二入口，不拆掉跑酷。 |
| `src/toon.js` 两阶 toon | 角色/枪可用；体素地形改用 Lambert + emissive，否则网格灯带不亮。 |
| `src/player.js` AABB + 土狼 + 二段跳 | 水平移动、重力、碰撞思路可抄；改成鼠标朝向、加冲刺、去掉二段跳（片中没看到）。 |
| `src/paper.js` 剪纸描边 | 不用。体素世界靠 greedy mesh 的硬边，不靠 `EdgesGeometry`。 |
| `src/level.js` 天安门线 | 不复用。练习场单独 `src/range/arena.js`。 |
| `tools/smoke.mjs` + `window.__game` | 模式照搬：注入输入、传送、读状态。 |

入口建议：`index.html` 保持跑酷；切片走 `range.html` + `src/range/main.js`。避免一上来把熊猫关卡改没。

---

## 4. 技术选型

```
range.html
  └─ src/range/main.js          循环、输入、HUD
       ├─ voxel/world.js        稀疏体素 + chunk 网格
       ├─ voxel/mesher.js       greedy meshing
       ├─ voxel/carve.js        球/盒挖洞 + 碎片
       ├─ player/controller.js  TPS 移动 / 跳 / 冲刺
       ├─ player/camera.js      过肩相机 + 准星射线
       ├─ player/cowboy.js      程序体素牛仔
       ├─ combat/weapons.js     四把枪数据
       ├─ combat/projectiles.js hitscan / 霰弹 / 火箭
       ├─ combat/dummies.js     靶人血量、闪白、碎裂、重生
       └─ fx/debris.js          InstancedMesh 碎片 + 枪焰
```

**体素**

- 世界坐标 1 单位 = 1 体素。练习场地板约 48×48，墙高 8–12。
- 分块 `16³`。改一格只重网格所在 chunk（边界再刷邻居）。
- 存储：`Map<chunkId, Uint8Array>`，0=空，1=地板，2=可毁墙，3=不可毁墙，4=灯带。
- 网格：greedy mesh，同材质合并。灯带用 emissive 材质。
- 挖洞：火箭用半径 2.5 的球形 `carveSphere`；霰弹/手枪只对「靶人体素」抠块，不对地板（和片子一致：小枪打墙无坑）。

**命中**

- Cannon / Autogun：从相机中心 `Raycaster`，先打靶人 AABB，再打体素 DDA。
- Scattergun：一次 8 根锥形射线，每根伤害低。
- Blockbuster：`Mesh` 弹体 + 速度，命中后 `carveSphere` + 爆炸光 + 碎片。

**碎片**

- `InstancedMesh`（方块几何 × N）。初速沿法线随机，简单欧拉积分 + 地面 y=0 反弹衰减，0.8–1.4s 后回收。不上 Rapier，练习场量级不需要。

**角色控制器**

- 胶囊（半径 0.4，高 1.6）对体素做轴分离，复用现有 AABB 推出，但碰撞源改成「脚底下 3×3 实心体素」。
- 冲刺：0.18s 内沿水平朝向加速到约 `runSpeed * 2.6`，冷却 0.7s。空中可冲一次，落地重置。
- 相机：目标 = 角色位置 + `(0.55, 1.45, 0)` 右肩偏移，再沿视线后退 4.2。墙体用相机射线缩短，避免穿墙。

**后处理**

- `EffectComposer` + `UnrealBloomPass`（弱，只托网格灯带和爆炸）。现仓库没用 composer，切片里单加。

**不引入**

- cannon-es / rapier3d：碎片用自写积分即可。
- 网络库：P0 单机。
- 外部体素文件：角色和枪都用 `BoxGeometry` 堆。

---

## 5. 手感参数（第一版可调表）

实施时把这些放进 `src/range/config.js`，对着原片微调，不要散落魔法数。

```js
export const PLAYER = {
  runSpeed: 7.2,
  gravity: 28,
  jumpV: 8.8,
  dashSpeed: 18,
  dashTime: 0.18,
  dashCooldown: 0.7,
  coyote: 0.1,
}

export const WEAPONS = {
  cannon:     { mag: 10, rpm: 140, dmg: 34, spread: 0.004, hitscan: true, pellets: 1 },
  autogun:    { mag: 24, rpm: 720, dmg: 8,  spread: 0.012, hitscan: true, pellets: 1, tracer: 0xff3a2a },
  scattergun: { mag: 6,  rpm: 90,  dmg: 7,  spread: 0.08,  hitscan: true, pellets: 8 },
  blockbuster:{ mag: 3,  rpm: 48,  dmg: 90, speed: 28, radius: 2.5, projectile: true },
}

export const DUMMY = {
  hp: 40,
  flashMs: 80,
  respawnS: 6,
  voxelSize: 0.18, // 靶人用更小体素，碎裂才像片子
}
```

Autogun 的红拖尾用短寿命 `Line` 或细长 `InstancedMesh`，每发一条，80ms 淡出。  
飘字用 CSS 2D 或 `Sprite`，世界坐标 → 屏幕，0.5s 上浮消失。

---

## 6. 练习场布局

俯视（Z 向前为射击方向）：

```
        cyan frame (emissive)
   #############################
   #  [C]   [M]   [Y]   [C]    #   ← 靶人，间距 ~3
   #                           #
   #                           #
   #                           #
   #            ★ spawn        #
   #############################
        cyan grid floor
```

- 地板：深青材质 + UV 网格 emissive（或每 N 个体素一条灯带体素，后者更「体素」）。
- 三面矮墙：材质 2（可毁）。后墙中段材质 3（不可毁），对应片子里 Autogun 打火花但不挖坑。
- 四周漂浮 1³ 发光方块（青/品红/黄），纯装饰。
- 出生点在场地南侧，面朝靶人。

靶人用独立的小体素体积（约 6×14×2 的扁剪影），不要并进大地块——碎裂时整坨变成实例方块，主世界 chunk 不用为靶人频繁重网格。

---

## 7. 角色与枪的美术（程序生成）

对标片子，不追求 VoxEdit 原模 1:1。

- 身体：箱子堆。头 6×6×6、帽檐扁平加宽、躯干棕、腿蓝、靴棕、背后灰包。
- 手臂 IK 不需要：持枪时右臂抬到枪位，冲刺时身体前倾 8°。
- 四把枪各一个 `Group`：Cannon 短粗、Autogun 长、Scattergun 宽口、Blockbuster 肩射筒。选中时切 mesh，未选中的可以背在后背（片子里火箭筒常露在肩后）。

本仓库熊猫是球拼的，牛仔改用箱拼，才能和体素世界咬合。

---

## 8. HUD 结构（`range.html`）

```
[FPS]                         RANGE · PLAY
VITALS ████████ 100/100                    VX-24 AUTOGUN   16/24

                         +  (准星)

              [1枪] [2枪*] [3枪] [4枪]
```

样式：深色半透明底、圆角、橙选中、无衬线。复刻 HUD 信息架构，不复刻 Sandbox 顶栏头像按钮。

`window.__game` 最少暴露：

```js
{
  ready, start,
  input: { x, z, jump, dash, fire, reload, slot },
  look: { yaw, pitch },
  teleport(x,y,z),
  state() → { hp, slot, ammo, dummyAlive, carvedVoxels, grounded, dashing }
}
```

---

## 9. 实施顺序

### 阶段 A — 空房间能跑（先提交可玩骨架）

1. `range.html` + 暗色 renderer、bloom、网格地板（可以先用 shader 网格，体素后接）。
2. TPS 控制器：鼠标锁、过肩相机、跳、冲刺粉尘。
3. 程序牛仔 + 准星。

验收：锁鼠标后能围着空地跑、跳、冲，镜头不穿地。

### 阶段 B — 体素世界与挖坑

1. chunk 存储 + greedy mesh。
2. 练习场墙/地板体素化。
3. 相机中心射线 + `carveSphere`。
4. 碎片 InstancedMesh。

验收：按键（临时）在准星处炸坑，墙出现锯齿洞，邻居 chunk 接缝正确。

### 阶段 C — 四把枪

1. 热键栏、弹匣、换弹环。
2. Cannon / Autogun hitscan + 枪焰 + Autogun 红线。
3. Scattergun 多射线。
4. Blockbuster 弹体 + 爆炸挖坑。不可毁墙只播火花、不 carve。

验收：四把枪手感可区分；火箭改地形，手枪不改地形。

### 阶段 D — 靶人

1. 三色剪影 + 光圈底座。
2. 闪白、飘字、碎裂、6s 重生。
3. 伤害按武器表走。

验收：能按片子顺序「手枪 → 步枪打碎 → 霰弹打碎 → 火箭炸墙」。

### 阶段 E — 打磨与冒烟

1. `tools/smoke-range.mjs`：切枪、扣弹、杀靶、carve 计数、换弹回满。
2. 音效用现有 `beep()` 思路：枪声频率不同，爆炸用短噪波。
3. README 加「练习场」入口说明。

每阶段都要保持跑酷入口可玩，互不覆盖。

---

## 10. 关键算法（实施时按此写，避免返工）

**体素 DDA（hitscan 打地形）**

从相机位置沿 `dir` 步进，取 `floor` 格，直到 `t > maxDist` 或碰到非 0 体素。返回格坐标与进入面法线，供火花和 Blockbuster 引爆点。

**球形挖洞**

```
for x,y,z in AABB(center, radius):
  if |cell+0.5 - center| <= radius and material is destructible:
    set 0, spawnDebris(cell)
dirtyChunks.add(chunkOf(cell) and neighbors)
```

**靶人碎裂**

靶人存活时是一个合并 mesh（或小 greedy mesh）。死亡：隐藏 mesh，对每个实心局部体素 `debris.spawn(worldPos, color, outwardVel)`。不要把靶人写进大地块，否则重生还得填回去。

**Greedy meshing**

标准 MagicaVoxel 那套：每轴扫面，合并同材质矩形。练习场体量小，每帧脏 chunk 个位数，JS 足够。

---

## 11. 风险

| 风险 | 处理 |
|---|---|
| Bloom 过亮，网格地板发糊 | bloom 半径小、只让 emissive 材质进高亮层 |
| 碎片过多掉帧 | 池上限 400，超出则最早的直接回收 |
| 挖坑后角色掉进洞 | 控制器脚底探测多 1 格；洞太深则卡在洞沿（片子里人站坑边） |
| 准星与枪口不一致 | 伤害/弹道一律从相机中心打，枪口只播 VFX |
| 和跑酷物理互相污染 | 切片独立目录，不改 `src/player.js` 的 `P` 常量 |

---

## 12. P2（视频之后，不在本切片）

来自 8/14 预告和 Jam 主题，确认练习场手感后再做：

1. 户外 Overgrown：草地顶、灰石崖、方块云、稀疏植物。
2. 体素「画脸」：准星在山体表面绘制/雕刻表情（破坏的对偶操作）。
3. 若要对标某些 HUD 出现的 Azure / Ember：再加队伍、计时、击杀，而不是一上来上网。

---

## 13. 建议的文件增补（实施时）

```
range.html
src/range/main.js
src/range/config.js
src/range/voxel/{world,mesher,carve}.js
src/range/player/{controller,camera,cowboy}.js
src/range/combat/{weapons,projectiles,dummies}.js
src/range/fx/debris.js
tools/smoke-range.mjs
```

现有 `src/main.js`、`src/level.js`、`src/paper.js` 不动。

---

## 14. 一句话

原片是 **Sandbox Studio 里的体素 TPS 射击场**：牛仔过肩、四把枪、彩色靶人碎成立方、火箭挖体素坑。在本仓库用 three.js 复刻时，先做独立 `range` 入口把这一套打准，再考虑 Overgrown 大世界；不要把北京跑酷改成射击游戏，也不要一上来上多人。
