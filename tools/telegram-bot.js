#!/usr/bin/env node
/**
 * Minimal Telegram bot for 4789ethics.
 *
 * Requires TELEGRAM_TOKEN and TELEGRAM_CHAT_ID environment variables.
 * The bot echoes messages from the configured chat.
 */
const TelegramBot = require('node-telegram-bot-api');

function startBot() {
  const token = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error('TELEGRAM_TOKEN and TELEGRAM_CHAT_ID must be set');
    return;
  }
  const bot = new TelegramBot(token, { polling: true });
  console.log('Telegram bot running');
  bot.on('message', msg => {
    if (String(msg.chat.id) !== String(chatId)) return;
    if (msg.text) {
      bot.sendMessage(chatId, `Echo: ${msg.text}`);
    }
  });
}

if (require.main === module) {
  startBot();
} else {
  module.exports = startBot;
}
