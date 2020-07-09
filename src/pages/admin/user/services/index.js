import request, { http } from '@/utils/request';
import { ENTITY } from '../const'
import querystring from 'querystring'
export function getList(pageNum, pageSize, where) {
	let whereString = querystring.stringify(where)
	// return request(`/api/${ENTITY}?pageNum=${pageNum}&pageSize=${pageSize}&${whereString}`);
	return http.get({ url: `/${ENTITY}?pageNum=${pageNum}&pageSize=${pageSize}&${whereString}` });
}

export function add(values) {
	// return request(`/api/${ENTITY}`, {
	// 	method: 'POST',
	// 	headers: {
	// 		'Content-Type': 'application/json'
	// 	},
	// 	body: JSON.stringify(values)
	// });

	return http.post({
		url: `/${ENTITY}`,
		data: values
	})
}

export function update(values) {
	// return request(`/api/${ENTITY}/${values.id}`, {
	// 	method: 'PUT',
	// 	headers: {
	// 		'Content-Type': 'application/json'
	// 	},
	// 	body: JSON.stringify(values)
	// });

	return http.put({
		url: `/${ENTITY}/${values.id}`,
		data: values
	})
}

export function del(id) {
	// return request(`/api/${ENTITY}/${id}`, {
	// 	method: 'DELETE',
	// 	headers: {
	// 		'Content-Type': 'application/json'
	// 	},
	// 	body: JSON.stringify([id])
	// });

	return http.del({
		url: `/${ENTITY}/${id}`,
	})
}

export function delAll(ids=[]) {
	// return request(`/api/${ENTITY}/${ids[0]}`, {
	// 	method: 'DELETE',
	// 	headers: {
	// 		'Content-Type': 'application/json'
	// 	},
	// 	body: JSON.stringify(ids)
	// });

	return http.del({
		url: `/${ENTITY}/${ids[0]}`,
		data: ids
	})
}

