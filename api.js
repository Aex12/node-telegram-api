"use strict";

const axios = require("axios");

const DEFAULT_API_ENDPOINTS = [
       "getUpdates",
       "setWebhook",
       "deleteWebhook",
       "getWebhookInfo",
       "getMe",
       "sendMessage",
       "options",
       "forwardMessage",
       "sendPhoto",
       "sendAudio",
       "sendDocument",
       "sendVideo",
       "sendAnimation",
       "sendVoice",
       "sendVideoNote",
       "sendMediaGroup",
       "sendLocation",
       "editMessageLiveLocation",
       "stopMessageLiveLocation",
       "sendVenue",
       "sendContact",
       "sendChatAction",
       "getUserProfilePhotos",
       "getFile",
       "kickChatMember",
       "unbanChatMember",
       "restrictChatMember",
       "promoteChatMember",
       "exportChatInviteLink",
       "setChatPhoto",
       "deleteChatPhoto",
       "setChatTitle",
       "setChatDescription",
       "pinChatMessage",
       "unpinChatMessage",
       "leaveChat",
       "getChat",
       "getChatAdministrators",
       "getChatMembersCount",
       "getChatMember",
       "setChatStickerSet",
       "deleteChatStickerSet",
       "answerCallbackQuery",
       "editMessageText",
       "editMessageCaption",
       "editMessageMedia",
       "editMessageReplyMarkup",
       "deleteMessage",
       "sendSticker",
       "getStickerSet",
       "uploadStickerFile",
       "createNewStickerSet",
       "addStickerToSet",
       "setStickerPositionInSet",
       "deleteStickerFromSet",
       "answerInlineQuery",
       "sendInvoice",
       "answerShippingQuery",
       "answerPreCheckoutQuery",
       "setPassportDataErrors",
       "sendGame",
       "setGameScore",
       "getGameHighScores",
];

class TelegramAPI {
	constructor (API_KEY, API_ENDPOINTS) {
		if (!API_KEY)
			throw new Error("You must supply an API_KEY argument");

		this.API_KEY = API_KEY;
		this.API_URL = `https://api.telegram.org/bot${API_KEY}/`;
		
		
		(API_ENDPOINTS || DEFAULT_API_ENDPOINTS).forEach(endpoint => {
			if (!this[endpoint])
				this[endpoint] = (options) => this.request.call(this, endpoint, options);
		});
	}

	request (endpoint, options) {
		return axios.request({
			method: "GET",
			baseURL: this.API_URL,
			url: endpoint,
			params: options,
			timeout: (options && options.timeout) ? ((options.timeout + 2) * 1000) : (5*1000),
		})
		.then((res) => res.data);
	}
}

module.exports = TelegramAPI;
