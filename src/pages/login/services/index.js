import request, { http } from '@/utils/request';
import { ENTITY } from '../const'
import querystring from 'querystring'


export function login(values) {
	return http.post({
		url: `/${ENTITY}`,
		data: values
	})
}



