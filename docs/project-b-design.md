# B 项目方案设计 · WrenAI 自助问数助手（华夏基金养老场景）

> 定位：用 WrenAI（受治理的 GenBI）搭建一个"养老理财业务线 · 内部自助问数助手"，让不懂 SQL 的业务/投研/客服人员用自然语言查经营数据。
> 核心价值：**AI PM 不是写 SQL 的人，而是定义"业务口径"的人**——语义层（MDL）就是你的主战场。

---

## 1. 业务场景定位
- **产品原型**：华夏基金「养老理财」业务线 · 内部自助问数助手
- **目标用户**：业务运营、投研、客服/投顾人员（非技术岗），想随时查养老业务经营数据
- **痛点**：原先每次取数要提需求给数据团队、排队等 T+1；口径易混（"养老规模"到底含不含税延？）
- **为什么用 AI**：维度多、口径乱，需要"受治理"的语义层统一指标定义，而不是让人各算各的

## 2. 你作为 AI PM 的核心交付：语义层（MDL）设计

### 2.1 实体（表）与关系
| 表 | 作用 | 关键字段 |
|---|---|---|
| `dim_fund` 基金产品维表 | 区分养老/非养老 | fund_code, fund_name, fund_type(养老/非养老), risk_level, launch_date |
| `dim_user` 投资者维表 | 用户画像 | user_id, age, city_tier, open_yanglao_account(0/1), reg_date |
| `fact_position` 持仓事实表 | 规模/收益来源 | user_id, fund_code, market_value, cost_value, date |
| `fact_order` 交易订单表 | 申购/赎回 | order_id, user_id, fund_code, amount, order_type(申购/赎回), date |
| `fact_dingtou` 定投计划表 | 定投行为 | user_id, fund_code, frequency, amount, status, start_date |

关系：`fact_*`.user_id → dim_user.user_id；`fact_*`.fund_code → dim_fund.fund_code

### 2.2 指标口径（PM 定义，最值钱的部分）
- **养老资产规模 AUM** = SUM(market_value) WHERE fund_type='养老'
- **个人养老账户渗透率** = COUNT(open_yanglao_account=1) / COUNT(*)
- **定投留存率** = 连续定投 ≥3 期的用户数 / 开启定投的用户数
- **近一年年化收益率** = 基于 fact_position 净值序列计算
- **月度申购/赎回额** = SUM(amount) GROUP BY month, order_type
- **用户画像分布** = 按 age / city_tier 分组聚合

### 2.3 治理规则（体现企业级思维）
- **行级权限**：客服角色只能看聚合结果，不能下钻到单用户明细
- **口径锁定**：AUM 等定义写进 MDL 版本化文件，改口径要走评审（防止"同指标不同数"）

## 3. 数据来源方案（关键现实问题）
你手上没有华夏基金真实数据库，两种合规做法：
- **方案甲（推荐）**：用**合成数据**——照上面 schema 造约 1 万条模拟投资者 + 对应持仓/订单，脱敏且能跑通问数演示。口径由你定义，演示照样成立。
- 方案乙：用 WrenAI 自带 sample——但那样就跟你背景无关，不推荐。

## 4. 技术架构（WrenAI 组件）
- Wren UI（提问界面，localhost:3000）
- Wren AI Service（语义层解析 + Text-to-SQL + 治理）
- 数据源：PostgreSQL（装合成数据）
- MDL 文件：定义上面的实体 / 指标 / 关系 / 权限

## 5. 落地步骤（路线）
1. 环境：fork + docker 起 WrenAI（见第 6 节命令）
2. 造合成数据 + 导入 PostgreSQL
3. 在 WrenAI 里建模语义层（MDL）
4. 提问验证（覆盖各指标，约 20 条用例）
5. 写 PRD + 指标表（Text2SQL 准确率等）
6. 录 Demo
7. 写 fork / PR 说明（署名上游，合规）

## 6. 立即可以做的第一步：起环境
先确认装了 Docker：
```
docker --version
```
没有就去 https://www.docker.com/products/docker-desktop 装。
然后：
```
git clone https://github.com/Canner/WrenAI.git
cd WrenAI
docker compose up -d
```
启动后浏览器开 http://localhost:3000 。首次需在设置里配置大模型（LLM）Key——建议用你已有的**阿里百炼**或 DeepSeek Key（和 A 项目技术栈统一）。

> ⚠️ 这一步在你自己电脑上跑，我读不到。起不来就把报错截图发我，我帮你排错。
