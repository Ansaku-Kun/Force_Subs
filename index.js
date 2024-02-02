const { Bot, webhookCallback } = require("grammy");
const express = require("express");
const TelegramBot = require('node-telegram-bot-api');

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

require("dotenv").config();

const bot = new Bot(process.env.BOT_TOKEN);

// Fungsi untuk mengecek apakah pengguna sudah bergabung dengan channel
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  bot.getChatMember(CHANNEL_ID, userId).then((chatMember) => {
    if (chatMember.status === 'member' || chatMember.status === 'administrator' || chatMember.status === 'creator') {
      bot.sendMessage(chatId, 'Anda sudah bergabung dengan channel. Sekarang Anda dapat menggunakan bot.');
    } else {
      bot.sendMessage(chatId, 'Silakan bergabung dengan channel terlebih dahulu untuk menggunakan bot.');
    }
  });
});

// Logika untuk perintah lainnya dapat ditambahkan sesuai kebutuhan

if (process.env.NODE_ENV === "production") {
  const app = express();
  app.use(express.json());
  app.use(webhookCallback(bot, "express"));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Bot listening on port ${PORT}`);
  });
} else {
  bot.start();
}

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
