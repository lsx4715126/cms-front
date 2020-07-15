// import _ from 'lodash'
import * as service from '../services'
import { ENTITY } from '../const'
import ss from '@/utils/cache/ss'
import router from 'umi/router'
import { PERMISSION } from '@/utils/const'


export default {

	namespace: `${ENTITY}`,

	state: {

	},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(({ pathname, query }) => {
				if (pathname === `/${ENTITY}`) {
					// dispatch({ type: 'save', payload: { ...initData } })//清空查询条件
					// dispatch({ type: 'getList', payload: query })
				}
			})
		},
	},

	effects: {
		*login({ payload }, { call, put }) {
			let permission = yield call(service.login, payload)

			if (Array.isArray(permission)) {// 登陆成功，并返回了权限列表
				ss.set(PERMISSION, permission)
				router.push('/admin/user')

				yield put({ type: 'global/socketConnect' })
			}
		},
		
	},

	reducers: {
		save(state, action) {
			return { ...state, ...action.payload };
		},
	},

};
