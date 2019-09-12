const TelegramListener = require('./listener');

const bot = new TelegramListener('BOTTOKEN');

bot.onUpdate((u) => console.log(u.update));

bot.listen();
