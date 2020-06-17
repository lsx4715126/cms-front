//类型检测
export function type(obj) {
	var toString = Object.prototype.toString;
	var map = {
	    '[object Boolean]'  : 'boolean', 
	    '[object Number]'   : 'number', 
	    '[object String]'   : 'string', 
	    '[object Function]' : 'function', 
	    '[object Array]'    : 'array', 
	    '[object Date]'     : 'date', 
	    '[object RegExp]'   : 'regExp', 
	    '[object Undefined]': 'undefined',
	    '[object Null]'     : 'null', 
	    '[object Object]'   : 'object'
	};
	// if(obj instanceof Element) {
    //     return 'element';
	// }
	return map[toString.call(obj)];
}

export default type