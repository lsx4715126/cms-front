import ss from '../cache/ss'
import { PERMISSION } from '../const'


let checkPermission = function(p){
    let permission = ss.get(PERMISSION)
    if(!Array.isArray(permission)) return false

    let is = permission.some(per => per.key === p)

    return is
}

export default checkPermission