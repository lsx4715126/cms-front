import request, { http } from '@/utils/request';
import { ENTITY } from '../const'
import querystring from 'querystring'
export function getList(pageNum, pageSize, where) {
	let whereString = querystring.stringify(where)
	// return request(`/api/${ENTITY}?pageNum=${pageNum}&pageSize=${pageSize}&${whereString}`);
	return http.get({ url: `/${ENTITY}?pageNum=${pageNum}&pageSize=${pageSize}&${whereString}`, routeChangeCancel: true });
}

export function add(values) {
	return request(`/api/${ENTITY}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(values)
	});
}

export function update(values) {
	return request(`/api/${ENTITY}/${values.id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(values)
	});
}

export function del(id) {
	return request(`/api/${ENTITY}/${id}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	});
}

export function delAll(ids) {
	return request(`/api/${ENTITY}/${ids[0]}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(ids)
	});
}

export function getResource() {
	return request(`/api/${ENTITY}/getResource`);
}


export function setResource(values) {
	return request(`/api/${ENTITY}/setResource`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(values)
	});
}


export function getUser() {
	return request(`/api/${ENTITY}/getUser`);
}

export function setUser(values) {
	return request(`/api/${ENTITY}/setUser`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(values)
	});
}