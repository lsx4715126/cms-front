import request, { http } from '@/utils/request';

export function query() {
	return request('/api/users');
}



export function getSocketList() {
	return http.get({
		url: `/getSocketList`,
	})
}