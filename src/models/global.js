import { pendingRequest } from '../utils/request';
import { get } from 'lodash'

window.$get = get


export default {

	namespace: 'global',

	state: {
		test: ''
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
	},

	reducers: {
		save(state, action) {
			return { ...state, ...action.payload };
		},
	},

};
