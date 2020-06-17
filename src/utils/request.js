import fetch from 'dva/fetch';
import axios from 'axios'
import { message } from 'antd'
import conf from './const'
import debug from './debug'




let one = debug('red')
let two = debug('green')

function parseJSON(response) {
	return response.json();// 返回的是字符串的话解析会报错
}

function checkStatus(response) {
	if (response.status >= 200 && response.status < 300) {
		return response;
	}

	const error = new Error(response.statusText);
	error.response = response;
	throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
	return fetch(url, options)
		.then(checkStatus)
		.then(parseJSON)
		//.then(data => ({ data }))
		.catch(err => ({ err }));
}























// 用于存储目前状态为pending的请求标识信息
export let pendingRequest = [];
//路由切换时是否取消ajax
let routeChangeCancel = true

/**
 * 请求的拦截处理
 * @param config - 请求的配置项
 */
const handleRequestIntercept = config => {
	// 区别请求的唯一标识，这里用方法名+请求路径
	// 如果一个项目里有多个不同baseURL的请求
	// 可以改成`${config.method} ${config.baseURL}${config.url}`
	const requestMark = `${config.method} ${config.url}`;
	// 找当前请求的标识是否存在pendingRequest中，即是否重复请求了
	const markIndex = pendingRequest.findIndex(item => {
		return item.name === requestMark;
	});
	// 存在，即重复了
	if (markIndex > -1) {
		// 取消上个重复的请求
		pendingRequest[markIndex].cancel();//会触发axios.interceptors.response.err
		// 删掉在pendingRequest中的请求标识
		pendingRequest.splice(markIndex, 1);
	}
	// （重新）新建针对这次请求的axios的cancelToken标识
	const CancelToken = axios.CancelToken;
	const source = CancelToken.source();
	config.cancelToken = source.token;
	// 设置自定义配置requestMark项，主要用于响应拦截中
	config.requestMark = requestMark;
	// 记录本次请求的标识
	pendingRequest.push({
		name: requestMark,
		cancel: source.cancel,
		// routeChangeCancel: config.routeChangeCancel // 可能会有优先级高于默认设置的routeChangeCancel项值
		routeChangeCancel: routeChangeCancel // 可能会有优先级高于默认设置的routeChangeCancel项值
	});

	return config;
};

/**
 * 响应的拦截处理
 * @param config - 请求的配置项
 */
const handleResponseIntercept = config => {
	// 根据请求拦截里设置的requestMark配置来寻找对应pendingRequest里对应的请求标识
	const markIndex = pendingRequest.findIndex(item => {
		return item.name === config.requestMark;
	});

	// console.log(markIndex, 'markIndex')
	// 找到了就删除该标识
	if (markIndex > -1) {
		hideLoadingMessage()
		pendingRequest.splice(markIndex, 1);
	}
}






let loadingMessage = null
let errMessage = null
function hideLoadingMessage() {
	if (loadingMessage) {
		loadingMessage()//隐藏loading
		setTimeout(() => loadingMessage = null, 500)//清空loadingMessage
	}
}


function checkErrStatus(err) {
	if (errMessage) return

	// console.log(err, 'err')
	if (err.status === 0) {
		errMessage = message.error('连接超时', 5, () => { errMessage = null });
	} else if (err.status === 500) {
		errMessage = message.error('服务器出错，请联系管理员', 5, () => { errMessage = null });
	} else if (err.status === 404) {
		errMessage = message.error('请求失败，未找到请求地址', 5, () => { errMessage = null });
	} else if (err.status === 504) {
		errMessage = message.error('请求失败，服务器出错', 5, () => { errMessage = null });
	} else if (err.status === 601) {
		errMessage = message.error('异常', 5, () => { errMessage = null });
	} else if (err.status === 602) {
		errMessage = message.error('Invalid token!', 5, () => { errMessage = null });
	} else if (err.status === 603) {
		errMessage = message.error('没有权限', 5, () => { errMessage = null });
	} else if (err.status === 604) {
		errMessage = message.error('失败', 5, () => { errMessage = null });
	} else if (err.status === 605) {
		errMessage = message.error('修改失败', 5, () => { errMessage = null });
	} else {
		errMessage = message.error('错误状态：' + err.status, 5, () => { errMessage = null });
	}
}



// console.log(conf, 'conf')
axios.defaults.baseURL = conf.host;
axios.defaults.crossDomain = true;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.withCredentials = true;
// axios.defaults.timeout =  conf.TIME_OUT;
axios.interceptors.request.use(
	config => {
		config = handleRequestIntercept(config)
		// console.log(config, 'config')
		if (!loadingMessage) {
			loadingMessage = message.loading('loading...', 0)
		}

		return config;
	},
	err => {
		return Promise.reject(err);
	}
);

axios.interceptors.response.use(
	response => {
		// hideLoadingMessage()
		two('response:', response.data)
		handleResponseIntercept(response.config)

		return response.data;
	},
	err => {
		// console.dir(err.toString())
		if (err.toString() !== 'Cancel') {
			hideLoadingMessage()
		}
		checkErrStatus(err.request)

		return Promise.reject(err);
	}
);




/**
 *  用法
 *  http.post({
		url: 'my-url',
		headers: {

		},
		routeChangeCancel: true,
		data: ''
	}).then((xhr) => {
		alert('Success');
	}, (xhr) => {
		alert('Fail');
	});
 */
export const http = new Proxy({}, {
	get(target, key, context) {
		return target[key] || ['get', 'post'].reduce((acc, key) => {
			acc[key] = (config) => {
				if (!config && !config.url || config.url === '') throw new Error('Url cannot be empty.');
				let isPost = key === 'post' || key === 'POST';

				if (isPost && !config.data) throw new Error('Please provide data in JSON format when using POST request.');

				one('request:', config.url)
				one('method:', isPost ? 'POST' : 'GET')
				one('opts:', isPost ? config.data : '')

				if (config.routeChangeCancel === undefined) {
					routeChangeCancel = true
				} else {
					routeChangeCancel = config.routeChangeCancel
				}

				if (isPost) {
					config.headers = !config.headers || {}
					axios.defaults.headers = { ...axios.defaults.headers, ...config.headers }
				}

				// return axios[isPost ? 'post' : 'get'](config.url, isPost ? querystring.stringify(config.data) : null).catch(err => {})
				return axios[isPost ? 'post' : 'get'](config.url, isPost ? JSON.stringify(config.data) : null).catch(err => { })
			};

			return acc;
		}, target)[key];
	},
	set() {
		throw new Error('API methods are readonly');
	},
	deleteProperty() {
		throw new Error('API methods cannot be deleted!');
	}
});

