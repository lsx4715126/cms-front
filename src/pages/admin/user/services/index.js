import request, { http } from '@/utils/request';
import { ENTITY } from '../const'
import querystring from 'querystring'
export function getList(pageNum, pageSize, where) {
	let whereString = querystring.stringify(where)

	return http.get(`/${ENTITY}?pageNum=${pageNum}&pageSize=${pageSize}&${whereString}`, { routeChangeCancel: true });
}

export function add(values) {
	return http.post(`/${ENTITY}`, values)
}

export function update(values) {
	return http.put(`/${ENTITY}/${values.id}`, values)
}

export function del(id) {
	return http.delete(`/${ENTITY}/${id}`)
}

export function delAll(ids=[]) {
	return http.delete(`/${ENTITY}/${ids[0]}`, { data: ids })
}

