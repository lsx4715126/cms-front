import { pendingRequest } from '../utils/request';
import { get } from 'lodash'
import { getSocketList } from '../services/socket'


window.$get = get


export default {

	namespace: 'global',

	state: {
		test: '',
		socket: null
	},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(({ pathname, query }) => {
				//取消请求
				pendingRequest.forEach(item => {
					item.routeChangeCancel && item.cancel();
				});
			})

			dispatch({ type: 'save', payload: { test: 123 } })
		},
	},

	effects: {
		*fetch({ payload }, { call, put }) {
			yield put({ type: 'save' });
		},
		*socketConnect({ payload }, { call, put }) {
			let io = require('socket.io-client')
			let socket = io('http://127.0.0.1:7001', {
				query: {
					room: 'default_room',
					username: `client_xxx`,
					jwt: 'xxx'
				},
				transports: ['websocket']
			});

			// 连接服务端
			socket.on('connect', () => {
				const id = socket.id;
				console.log('connect!');
				// socket.emit('chat', 'hello world!');

				// 监听自身 id 以实现 p2p 通讯
				socket.on(id, msg => {
					console.log('#receive,', msg);
				});
			});

			//接收消息通知
			socket.on('res', msg => {
				console.log('res from server:', msg);
			});

			// 接收上线通知
			socket.on('online', msg => {
				console.log('online from server: %s!', msg);
			});

			yield put({ type: 'save', payload: { socket } })
		},
		*getSocketList({ payload }, { call, put }){
			let list = yield call(getSocketList)
			console.log(list)
		}
	},

	reducers: {
		save(state, action) {
			return { ...state, ...action.payload };
		},
	},

};
