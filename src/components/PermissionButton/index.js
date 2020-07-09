import React from 'react';
import { Button } from 'antd';
import checkPermission from '@/utils/permission'
import type from '../../utils/type';

export default (props) => {
    let permission = props.permission
    // 1.未传permission参数
    if(!permission) return <Button {...props} />
    

    // 2.传了permission参数
    let isPer = false

    if(Array.isArray(permission)){
        isPer = permission.some(p => checkPermission(p))
    }

    if(type(permission) === 'string'){
        isPer = checkPermission(permission)
    }


    if(isPer){
        return <Button {...props} />
    }else{
        return null
    }
}

