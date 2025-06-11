# Telegram Bot Integration

`tools/telegram-bot.js` provides a minimal echo bot for Telegram.

1. Install dependencies with `npm install`.
2. Set `TELEGRAM_TOKEN` and `TELEGRAM_CHAT_ID` as environment variables.
3. Run `npm run telegram-bot` to start polling.

The bot echoes any message sent in the configured chat. Adjust the code to add
further logic. Network access is required for Telegram API calls.
