# B 项目 · 语义层（MDL）与指标口径设计

> 这是 AI PM 在 WrenAI 项目里**最值钱的交付**：不是写 SQL，而是**定义"业务口径"并把它治理化、版本化**。
> 本文档 = 6 个核心指标的"口径锁定"定义 + 在 WrenAI 界面落地的操作流 + 治理规则。
> 配套：方案设计文档、PRD、测试用例。数据：1 万模拟投资者 + 持仓/订单/定投约 12 万行（合成，已脱敏）。

---

## 0. 为什么一定要有语义层（给面试官讲的故事）

WrenAI 这类 GenBI 工具，天然能"用大白话问数"。但**没有语义层时，同一个指标会被不同的人算出不同的数**——这叫"同指标不同数"，是企业最怕的数据治理事故。

AI PM 的价值 = 把"养老规模到底含不含某类资产""渗透率分母是谁"这些**业务判断**固化成唯一口径，写进语义层，谁问都一样。

**实测证据（未治理前，直接用自然语言问，2026-10-20 基线测试）：**

| 指标 | WrenAI 自然语言直答表现 | 原因 |
|---|---|---|
| 养老资产规模 AUM | ❌ 失败 | 模型说"AUM 不是列，与 schema 无关"——没有列叫 AUM |
| 个人养老账户渗透率 | ✅ 能答 | 映射到 `open_yanglao_account` 列 |
| 定投留存率 | ⚠️ 含糊 | "缺时间范围/用户群/计算方法"——复合口径无法自动推断 |
| 近一年年化收益率 | ❌ 失败 | "无清晰 schema 引用"——当前表无净值/收益列 |
| 月度申购/赎回额 | ✅ 能答 | 映射到 `fact_order.amount/order_type` |
| 用户画像分布 | ✅ 能答 | 映射到 `city_tier/age` |

→ **结论**：简单口径能答，复合/派生口径必须靠"指标治理"才能稳定答对。这正是本文档要锁定的 6 个口径。

---

## 1. 数据模型（已连库，WrenAI 模型名 = `public_<表名>`）

| WrenAI 模型名 | 真实表 | 关键字段 |
|---|---|---|
| `public_dim_fund` | dim_fund | fund_code, fund_name, fund_type(养老/非养老), risk_level, launch_date |
| `public_dim_user` | dim_user | user_id, age, city_tier, open_yanglao_account(0/1), reg_date |
| `public_fact_position` | fact_position | user_id, fund_code, market_value, cost_value, date |
| `public_fact_order` | fact_order | order_id, user_id, fund_code, amount, order_type(申购/赎回), date |
| `public_fact_dingtou` | fact_dingtou | plan_id, user_id, fund_code, amount, frequency(月/双周/周), status(进行中/已终止/已暂停), start_date |

> 注：WrenAI 生成的 SQL 用 `public_*` 作表名（模型引用名），下文锁定 SQL 统一用此写法，与工具一致。

---

## 2. 六个指标口径（已实测，数字为当前合成数据结果）

### 指标 1 · 养老资产规模 AUM
- **业务定义**：所有"养老"类基金的持仓市值之和（取最新快照日）。
- **锁定 SQL**（在 WrenAI 视图 SQL 编辑器粘贴）：
```sql
SELECT SUM(p.market_value) AS yanglao_aum
FROM public_fact_position p
JOIN public_dim_fund f ON p.fund_code = f.fund_code
WHERE f.fund_type = '养老'
  AND p.date = (SELECT MAX(date) FROM public_fact_position);
```
- **实测值**：**8.73 亿元**（2025-12-31 快照）。
- **治理要点**：必须 `JOIN dim_fund` 用 `fund_type='养老'` 过滤，否则会把非养老基金也算进去。

### 指标 2 · 个人养老账户渗透率
- **业务定义**：已开通个人养老账户的用户占比（分母=全体用户）。
- **锁定 SQL**：
```sql
SELECT COUNT(*) FILTER (WHERE open_yanglao_account = 1) * 1.0
       / NULLIF(COUNT(*), 0) AS penetration_rate
FROM public_dim_user;
```
- **实测值**：**45.15%**。
- **治理要点**：分母是全体用户（不是已开通者），分子用 `FILTER` 精准计数。

### 指标 3 · 定投留存率（活跃率口径）
- **原方案定义**：连续定投 ≥3 期的用户数 / 开启定投的用户数。
- **⚠️ Schema 缺口**：当前 `fact_dingtou` 只有"计划级"记录（状态/频率/起投日），**没有每期扣款明细**，无法严格算"连续≥3期"。
- **本次替代口径（可计算，已在文档与 Demo 中标注为简化版）**：
  定投留存率 = 状态为"进行中"的定投用户数 / 开启定投的用户总数。
```sql
SELECT COUNT(DISTINCT CASE WHEN status = '进行中' THEN user_id END) * 1.0
       / NULLIF(COUNT(DISTINCT user_id), 0) AS dingtou_retention
FROM public_fact_dingtou;
```
- **实测值**：**70.89%**（进行中 2109 / 开启 2975）。
- **严谨版补全建议**：新增 `fact_dingtou_detail(plan_id, dedu_date, amount, status)` 每期扣款表，再用 `COUNT(期数)>=3` 算真实留存。

### 指标 4 · 收益率（持仓收益率口径）
- **原方案定义**：近一年年化收益率（基于净值序列）。
- **⚠️ Schema 缺口**：当前表只有 `market_value`（市值）与 `cost_value`（成本），**没有净值/时间序列收益列**，无法算严格"年化净值收益率"。
- **本次替代口径（可计算，标注为简化版）**：
  持仓收益率 = (最新市值 − 最新成本) / 最新成本，全组合口径。
```sql
SELECT SUM(p.market_value - p.cost_value) * 1.0
       / NULLIF(SUM(p.cost_value), 0) AS book_return_rate
FROM public_fact_position p
WHERE p.date = (SELECT MAX(date) FROM public_fact_position);
```
- **实测值**：**7.87%**。
- **严谨版补全建议**：新增 `fact_nav(fund_code, date, nav)` 净值表，按时间加权算年化。

### 指标 5 · 月度申购 / 赎回额
- **业务定义**：按月份、按申购/赎回类型汇总金额。
- **锁定 SQL**：
```sql
SELECT TO_CHAR(o.date, 'YYYY-MM') AS month,
       o.order_type,
       SUM(o.amount) AS total_amount
FROM public_fact_order o
GROUP BY 1, 2
ORDER BY 1 DESC, 2;
```
- **实测值（近 3 月，单位万元）**：
  2025-12 申购 3112.1 / 赎回 3198.8；2025-11 申购 3050.5 / 赎回 3105.2；2025-10 申购 3107.8 / 赎回 3326.6。
- **治理要点**：`order_type` 取值为「申购/赎回」，需与业务确认枚举一致。

### 指标 6 · 用户画像分布
- **业务定义**：投资者按城市层级 / 年龄段分布。
- **锁定 SQL（城市层级）**：
```sql
SELECT city_tier, COUNT(*) AS user_cnt
FROM public_dim_user GROUP BY city_tier ORDER BY user_cnt DESC;
```
- **锁定 SQL（年龄段，需分箱）**：
```sql
SELECT CASE WHEN age < 25 THEN '25以下'
            WHEN age < 35 THEN '25-34'
            WHEN age < 45 THEN '35-44'
            WHEN age < 55 THEN '45-54'
            ELSE '55+' END AS age_group,
       COUNT(*) AS user_cnt
FROM public_dim_user GROUP BY 1 ORDER BY 1;
```
- **实测值**：城市——二线 3469 / 新一线 2498 / 三线及以下 2448 / 一线 1585；
  年龄——55+ 3271 / 35-44 2049 / 25-34 2033 / 45-54 2027 / 25下 620。

---

## 3. 在 WrenAI 界面落地"指标治理"的操作流（你来执行）

WrenAI 0.29 的视图（View）机制 = **先把问题问出来拿到 SQL，审查/改写成锁定口径，再"存为视图"**。这正是 PM 锁定口径的动作。

对每个指标：
1. 在首页用大白话提问（如"养老资产规模多少"）。
2. 等出 SQL，点开 SQL，对照本文档第 2 节的**锁定 SQL** 核对：
   - 若自动生成的 SQL 与锁定口径一致 → 直接「Save as View」，命名 `m_养老AUM` 等。
   - 若不一致（尤其指标 1/3/4）→ **手动把 SQL 改成锁定口径**，再存为视图。
3. 六个视图都建好后，回 Modeling 页点 **Deploy**（橙色按钮），让语义层生效。
4. 之后任何人问"养老规模"，都会命中治理后的视图，口径一致。

> 指标 1（养老AUM）、指标 3（定投留存）、指标 4（收益率）**必须手动改 SQL**，因为自然语言直答会失败或含糊（见第 0 节证据）。

---

## 4. 治理规则（写进作品集，体现企业级思维）
- **口径锁定 / 版本化**：6 个指标 SQL 以本文档为唯一真源；改口径走评审，不直接改线上视图。
- **行级权限（规划）**：客服角色仅看聚合结果，不下钻单用户明细——WrenAI 的 access-control 规则可配置（schema 已支持 `condition` SQL 表达式）。
- **命名规范**：视图统一前缀 `m_`（metric），便于检索与权限批量管理。

---

## 5. 待补全（让 Demo 更严谨）
1. 新增 `fact_dingtou_detail` 每期扣款表 → 指标 3 升级为严格"连续≥3期"留存。
2. 新增 `fact_nav` 净值表 → 指标 4 升级为严格"年化净值收益率"。
3. 配置 access-control 行级权限规则，演示"客服只看聚合"。
