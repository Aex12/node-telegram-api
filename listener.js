"use strict";

const TelegramAPI = require("./api");

class TelegramListener {
	constructor (API_KEY) {
		if (!API_KEY)
			throw new Error("You must supply an API_KEY argument");

		this.API_KEY = API_KEY;
		this.api = new TelegramAPI(API_KEY);
		this.last_update_id = 0;

		this.update_handlers = [];
		
		this.ctx = {api: this.api};
	}

	listen () {
		this.api.getUpdates({timeout: 3600, offset: this.last_update_id})
		.then(res => {
			if (res.ok && res.result.length !== 0) {
				res.result.forEach(this._processUpdate.bind(this));
				this.last_update_id = res.result.slice(-1)[0].update_id + 1;
			}
			setTimeout(this.listen.bind(this), 0);
		})
		.catch(err => {
			console.error("Error while getting updates: ", err);
			setTimeout(this.listen.bind(this), 5*1000);
		});

		return this;
	}

	_processUpdate (update) {
		var ctx = Object.assign({update}, this.ctx);

		this.update_handlers.forEach(h => {
			if (!h.validate || h.validate(update)) {
				var extra = h.helper && h.helper(update);
				return h.callback(Object.assign({extra}, ctx));
			}
		});
	}

	_on (handler_object) {
		this.update_handlers.push(handler_object);
		return this
	}

	on (validate, callback) {
		return this._on({validate, callback});
	}

	onUpdate (callback) {
		return this._on({callback});
	}

	onText (regex, callback) {
		var validate = (update) => update.message && regex.test((update.message.text || update.message.caption));
		var helper   = (update) => (update.message.text || update.message.caption).match(regex);
		return this._on({validate, helper, callback});
	}

	onCallbackQuery (regex, callback) {
		var validate = (update) => update.callback_query && regex.test(update.callback_query.data);
		var helper   = (update) => update.callback_query.data.match(regex);
		return this._on({validate, helper, callback});
	}
}

module.exports = TelegramListener;
