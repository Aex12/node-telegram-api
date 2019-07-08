"use strict";

var TelegramListener = require("./listener");

var bot = new TelegramListener("BOTTOKEN");

bot.onUpdate(u => console.log(u.update));

bot.listen();
