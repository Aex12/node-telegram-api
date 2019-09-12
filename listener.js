const TelegramAPI = require('./api');

class TelegramListener {
	constructor (API_KEY, { timeout, after_error_wait_time }) {
		if (!API_KEY) throw new TypeError('You must supply an API_KEY argument');

		this.API_KEY = API_KEY;
		this.api = new TelegramAPI(API_KEY);
		this.last_update_id = 0;

		this.update_handlers = [];

		this.ctx = { api: this.api };

		this.timeout = timeout || 5;
		this.after_error_wait_time = after_error_wait_time || 3 * 1000;
	}

	listen () {
		this.api
			.getUpdates({ timeout: this.timeout, offset: this.last_update_id })
			.then((res) => {
				if (res.ok && res.result.length !== 0) {
					res.result.forEach(this.processUpdate.bind(this));
					this.last_update_id = res.result.slice(-1)[0].update_id + 1;
				}
				setTimeout(this.listen.bind(this), 0);
			})
			.catch((err) => {
				console.error('Error while getting updates: ', err);
				setTimeout(this.listen.bind(this), this.after_error_wait_time);
			});

		return this;
	}

	processUpdate (update) {
		const ctx = { ...this.ctx, update };

		this.update_handlers.forEach((h) => {
			if (!h.validate || h.validate(update)) {
				const extra = h.helper && h.helper(update);
				h.callback({ ...ctx, extra });
			}
		});
	}

	on (handler_object) {
		this.update_handlers.push(handler_object);
		return this;
	}

	onValidateFn (validate, callback) {
		return this.on({ validate, callback });
	}

	onUpdate (callback) {
		return this.on({ callback });
	}

	onText (regex, callback) {
		const validate = (update) => update.message
			&& regex.test((update.message.text || update.message.caption));
		const helper = (update) => (update.message.text || update.message.caption).match(regex);
		return this.on({ validate, helper, callback });
	}

	onCallbackQuery (regex, callback) {
		const validate = (update) => update.callback_query && regex.test(update.callback_query.data);
		const helper = (update) => update.callback_query.data.match(regex);
		return this.on({ validate, helper, callback });
	}
}

module.exports = TelegramListener;
