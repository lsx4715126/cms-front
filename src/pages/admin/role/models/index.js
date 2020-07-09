import _ from 'lodash'
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
		selectedRowKeys: [],//被选中的行ID
		selectedRows: [],//被选中的行

		//权限树
		setResourceVisible: false,
		checkedKeys: [],//哪些权限被选中
		resource: [],//权限树
		halfCheckedKeys: [],// 半选的父节点

		//穿梭框
		setUserVisible: false,
		users: [],//所有的用户
		targetKeys: [],//已选用户ID
	},

	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(({ pathname, query }) => {
				if (pathname === `/admin/${ENTITY}`) {
					dispatch({ type: 'save', payload: { ...initData } })//清空查询条件
					dispatch({ type: 'getList', payload: query })
					dispatch({ type: 'getResource', payload: query })
					dispatch({ type: 'getUser', payload: query })
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

			if (!Object.keys(where).length) {
				where = yield select(state => state[ENTITY].where)
			}

			// console.log('where', where)
			let result = yield call(service.getList, pageNum, pageSize, where)
			yield put({ type: 'save', payload: { list: _.get(result, 'list', []), total: _.get(result, 'total', 0), pageNum: parseInt(pageNum), where } });

		},
		*addOrEdit({ payload }, { call, put }) {
			let list = yield call(payload.id ? service.update : service.add, payload)
			// console.log(list)
			yield put({ type: 'getList', payload: {} });
			yield put({ type: 'save', payload: { editVisible: false } });
		},
		*del({ payload }, { call, put }) {
			let list = yield call(service.del, payload)
			// console.log(list)
			yield put({ type: 'getList', payload: {} });
			yield put({ type: 'save', payload: { editVisible: false } });
		},
		*delAll({ payload }, { call, put }) {
			//console.log(payload)
			yield call(service.delAll, payload)
			// console.log('delAll')
			yield put({ type: 'getList', payload: {} });
			yield put({ type: 'save', payload: { editVisible: false } });
		},
		*getResource({ payload }, { call, put }) {
			//console.log(payload)
			let resource = yield call(service.getResource)
			// console.log('getResource', resource)
			yield put({ type: 'save', payload: { resource } });
		},
		*setResource({ payload }, { call, put, select }) {
			let { record, checkedKeys, halfCheckedKeys } = yield select(state => state[ENTITY])
			// console.log([...checkedKeys, ...halfCheckedKeys], '---setResource---')
			yield call(service.setResource, {
				roleId: record.id,
				resourceIds: [...checkedKeys, ...halfCheckedKeys]
			})
			yield put({ type: 'save', payload: { setResourceVisible: false } });
			yield put({ type: 'getList', payload: {} });
		},
		*getUser({ payload }, { call, put }) {
			//console.log(payload)
			let users = yield call(service.getUser)
			//console.log('getResource', resource)
			yield put({ type: 'save', payload: { users } });
		},
		*setUser({ payload }, { call, put, select }) {
			let { record, targetKeys } = yield select(state => state[ENTITY])

			yield call(service.setUser, {
				roleId: record.id,
				userIds: targetKeys
			})
			yield put({ type: 'save', payload: { setUserVisible: false } });
			yield put({ type: 'getList', payload: {} });
		},
	},

	reducers: {
		save(state, action) {
			return { ...state, ...action.payload };
		},
	},

};
