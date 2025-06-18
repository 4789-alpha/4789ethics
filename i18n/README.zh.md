# Ethicom – 人机伦理评估系统

**Ethicom** 是一个用于人类对数字来源或系统行为进行结构化伦理评估的平台（SRC-0 到 SRC-8+）。  
每次评估都有签名、时间戳和哈希校验 – 起始签名为 `4789`。


### 摘要

4789ethics 仓库提供了一套结构化的伦理框架，旨在支持负责任的数字项目。所有功能可在 [bsvrb.ch](https://www.bsvrb.ch) 使用，建议先阅读 `GET_STARTED.md`，然后打开 `index.html`。该框架包含完整的运营模型（OP 0–9.x）、自我反思系统（签名 9874）以及“伦理优先”的方法。关键目录 `app`、`ethics_modules`、`interface`、`i18n` 和 `tools` 提供核心模块。使用遵循 Open‑Ethics 许可证。幽默可以，但需保持责任与清晰。仓库不提供任何担保；可选的登录数据会在本地散列存储。安装依赖后请运行 `node --test`、`node tools/check-translations.js` 和 `node tools/check-file-integrity.js`.
本仓库包括：
- 多语言界面定义
- 伦理等级定义（`ethikscale`）
- 验证模块（如 `structure_9874`）
- 来源评估与声明

界面：`ethicom.html`  
语言：见 `i18n/ui-text.json`  
