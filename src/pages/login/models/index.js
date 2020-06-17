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
			let result = yield call(service.login, payload)
			console.log(result)
			if(result.code > 0 && result.permission){
				ss.set(PERMISSION, result.permission)
				router.push('/admin/user')
			}
		},
	},

	reducers: {
		save(state, action) {
			return { ...state, ...action.payload };
		},
	},

};
