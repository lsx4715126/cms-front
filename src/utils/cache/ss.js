let cache = {
	set(key, value) {
		if (value) {
			value = JSON.stringify(value);
		}
		sessionStorage.setItem(key, value);
	},
	get(key) {
		let value = sessionStorage.getItem(key);
		if (value && value != "undefined" && value != "null") {
			return JSON.parse(value);
		}
		return null;
	},
	remove(key) {
		sessionStorage.removeItem(key);
	},
	clear() {
		sessionStorage.clear();
	}
};

export default cache;