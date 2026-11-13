# C 项目推送 GitHub 详细步骤（纯净原版 + PAT/HTTPS）

> 适用对象：Zia 的 AI 产品经理作品集 —— C 项目 `AI-Test-Case-Generator`
> 方案：只推上游原始代码（start.bat、demo-corpus 暂不包含）；用个人访问令牌（PAT）+ HTTPS 登录推送。
> 当前位置：`E:\WorkBuddy\WorkBuddy\2026-10-11-00-00-27\AI-Test-Case-Generator`

---

## 一、出发前已帮你确认（不用再做）

- ✅ 已是 git 仓库，工作区干净，跟踪 **125 个文件**，不用重新 `git init`
- ✅ **密钥安全**：`.env`（DeepSeek / 阿里百炼 key）已被 `.gitignore` 忽略，不会上传；仓库只跟踪 `.env.example` 空模板
- ✅ git 身份已设好（`zia` / `zialij0515@gmail.com`）
- ⚠️ 当前 `origin` 指向**原作者** `ChiufungLee/AI-Test-Case-Generator` —— 我们不会推到他那，会先改成你自己的仓库

---

## 二、总览（就 4 步）

1. 在 GitHub 网页新建一个**空**仓库
2. 本地把 `origin` 改成你的仓库，原作者设为 `upstream`（留作溯源）
3. 生成 PAT 令牌，推送时当密码用
4. 打开网页验证

---

## 三、详细步骤

### 步骤 1 ｜ 在 GitHub 新建空仓库

1. 打开 https://github.com 并登录
2. 右上角 **＋** → **New repository**
3. Repository name：`AI-Test-Case-Generator`（也可以改成你喜欢的名字，比如 `ai-test-case-portfolio`）
4. Description（可选）：`AI 测试用例生成器 — 我的 AI 产品经理作品集项目（基于 ChiufungLee 开源项目）`
5. 选 **Public**
6. ⚠️ **不要**勾选 "Initialize this repository with a README" / "Add .gitignore" / "Add license" —— 保持**完全空仓库**，否则会和本地历史冲突
7. 点 **Create repository**
8. 创建后页面会显示仓库地址，复制这行：
   ```
   https://github.com/你的用户名/AI-Test-Case-Generator.git
   ```
   （把「你的用户名」换成你 GitHub 的登录名，后面每一步都要用）

---

### 步骤 2 ｜ 本地设置远程地址

打开 **Git Bash**（或你之前用的终端），**逐行**粘贴执行：

```bash
cd "E:/WorkBuddy/WorkBuddy/2026-10-11-00-00-27/AI-Test-Case-Generator"

# 先看一眼，确认 origin 现在指向原作者
git remote -v

# 把 origin 改成你刚建的仓库（替换「你的用户名」）
git remote set-url origin https://github.com/你的用户名/AI-Test-Case-Generator.git

# 把原作者留作 upstream，方便以后溯源/同步（好礼仪）
git remote add upstream https://github.com/ChiufungLee/AI-Test-Case-Generator.git

# 再确认一遍：origin=你的，upstream=原作者
git remote -v
```

看到 `origin` 变成你的地址、`upstream` 是原作者的，就对了。

---

### 步骤 3 ｜ 生成 PAT（个人访问令牌）

1. GitHub 右上头像 → **Settings**
2. 左侧最底部 **Developer settings** → **Personal access tokens** → **Tokens (classic)**
3. **Generate new token (classic)**
4. Note：随便写，如 `push C portfolio`
5. Expiration：选 `30 days` 或自定义（短期够用就行）
6. Scopes：**只勾 ☑ repo**（这一项就包含全部仓库读写权限）
7. 最底部 **Generate token**
8. ⚠️ 页面**只显示这一次**这串 `ghp_xxx...` 令牌，立刻复制存到记事本

> 安全提示：令牌 = 密码级别，别发群里、别截图外传。用完可随时在 Developer settings 里删掉。

---

### 步骤 4 ｜ 推送

```bash
git push -u origin main
```

- 会弹出登录框（这是 Windows 自带的 Git 凭据管理器）：
  - **Username**：填你的 GitHub 用户名
  - **Password**：**粘贴刚才的 PAT**（不是你的 GitHub 登录密码！粘贴时屏幕不显示字符，属正常）
- 第一次成功后会记住，以后推送不用再填
- 看到 `main -> main` 和 `done` / `writing objects` 完成即成功

> **备用方案（若没弹框）**：把令牌直接写进地址（会暂存到 git 配置里，不如上面安全，仅作兜底）：
> ```bash
> git remote set-url origin https://你的用户名:你的PAT@github.com/你的用户名/AI-Test-Case-Generator.git
> git push -u origin main
> ```

---

### 步骤 5 ｜ 网页验证

1. 打开 `https://github.com/你的用户名/AI-Test-Case-Generator`
2. 应看到 **125 个文件**、`README.md`、以及原作者的 commit 历史
3. 在文件列表里**确认没有 `.env` 文件**（有就说明泄露了，立刻删仓库重来）
4. 点进 `README.md` 能看到项目说明，即大功告成

---

## 四、常见翻车点（对照自查）

| 现象 | 原因 / 解决 |
|---|---|
| `failed to push some refs` | 建仓库时勾了 README，本地和远程历史对不上。最省事：删了重建**空**仓库再 push；或先 `git pull origin main --allow-unrelated-histories` 再 push |
| `Authentication failed` | 密码框粘的是**登录密码**不是 PAT；或 token 没勾 `repo` 权限。重新生成带 repo 的 PAT |
| 弹出浏览器授权而不是填框 | 正常的 GCM 行为，按提示点 Authorize 即可 |
| 忘了 PAT | Developer settings 里删掉旧的，重新生成一个 |
| 推送太慢/超时 | 125 个文件不大，一般几秒；卡住就 `Ctrl+C` 重跑 `git push -u origin main` |

---

## 五、加分项（可选，不做也行）

- **尊重原作者**：在仓库 `README.md` 顶部加一行：
  > 本仓库基于 [@ChiufungLee/AI-Test-Case-Generator](https://github.com/ChiufungLee/AI-Test-Case-Generator)，作为我的 AI 产品经理作品集项目复用。
- **以后更新代码**：`git add . && git commit -m "说明" && git push`
- **同步原作者更新**（可选）：`git fetch upstream` → `git merge upstream/main`

---

## 六、下一步（属于你的「C 展示另有想法」部分）

仓库上线后，C 在作品集里就是一个**可访问的 GitHub 链接**了。你之前说 C 的展示另有想法 —— 无论你打算用截图、架构图还是别的载体，这个仓库链接都能直接放进去当「源码佐证」。需要我帮你写 C 项目的 README 作品集说明，或做 C 的展示页，随时说。
