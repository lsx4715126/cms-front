// import _ from 'lodash'
import * as service from '../services'
import { ENTITY } from '../const'
import { PAGE_SIZE } from '@/utils/const'

let initData = {
	list: [],
	total: 0,
	pageNum: 1,
	where: {},
}

export default {

	namespace: `${ENTITY}`,

	state: {
		// list: [],
		// total: 0,
		// pageNum: 1,
		// where: {},
		...initData,
		//编辑框是否显示
		editVisible: false,
		record: { gender: 1 },
		selectedRowKeys: [],
		selectedRows: []
	},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(({ pathname, query }) => {
				if (pathname === `/admin/${ENTITY}`) {
					dispatch({ type: 'save', payload: { ...initData } })//清空查询条件
					dispatch({ type: 'getList', payload: query })
				}
			})
		},
	},

	effects: {
		*getList({ payload: { pageNum = 1, pageSize = PAGE_SIZE, where = {} } }, { call, put, select }) {
			if (!pageNum) {
				//select   获取仓库中的某个属性
				pageNum = yield select(state => state[ENTITY].pageNum)
			}

			// if (!Object.keys(where).length) {
			// 	where = yield select(state => state[ENTITY].where)
			// }

			console.log('where', where)
			let result = yield call(service.getList, pageNum, pageSize, where)
			console.log(result, 'result')
			// if (!result) return
			yield put({ type: 'save', payload: { list: window.$get(result, 'list', []), total: window.$get(result, 'total', 0), pageNum: parseInt(pageNum), where } });
		},
		*addOrEdit({ payload }, { call, put }) {
			let list = yield call(payload.id ? service.update : service.add, payload)
			console.log(list)
			yield put({ type: 'getList', payload: {} });
			// yield put({ type: 'save', payload: { editVisible: false } });
		},
		*del({ payload }, { call, put }) {
			let list = yield call(service.del, payload)
			console.log(list)
			yield put({ type: 'getList', payload: {} });
			yield put({ type: 'save', payload: { editVisible: false } });
		},
		*delAll({ payload }, { call, put }) {
			//console.log(payload)
			yield call(service.delAll, payload)
			console.log('delAll')
			yield put({ type: 'getList', payload: {} });
			yield put({ type: 'save', payload: { editVisible: false } });
		},
	},

	reducers: {
		save(state, action) {
			return { ...state, ...action.payload };
		},
	},

};
