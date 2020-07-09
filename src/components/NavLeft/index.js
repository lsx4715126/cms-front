import React, { Component } from 'react'
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom'
import router from 'umi/router'
import ss from '@/utils/cache/ss'
import { PERMISSION } from '@/utils/const'
const { SubMenu } = Menu;


function listToTree(list = []){
    let rootMenu = [];
    let otherMenu = [];
    let map = {};

    list.forEach(item => {
        item.children = [];
        map[item.id] = item;
        if(item['parent_id'] == 0){
            rootMenu.push(item)
        }else{
            otherMenu.push(item)
        }
    });

    otherMenu.forEach(item=>{
        map[item['parent_id']].children.push(item)
    });

    return rootMenu;
}

function uniqueObj(arr, key='key'){
    return arr.filter((item, index) => {
        let i = 0
        for(let j=0; j<arr.length; j++){
            if(arr[j][key] === item[key]){
                i = j
                break
            }
        }
        return i === index
    })
}

export default class extends Component {
    renderMenus = (children) => {
        return children.map(item => {
            if (item.children.length > 0) {
                return (
                    <Menu.SubMenu key={item.key} title={<span><Icon type={item.icon} />{item.name}</span>}>
                        {this.renderMenus(item.children)}
                    </Menu.SubMenu>
                )
            } else {
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.key} replace><Icon type={item.icon} />{item.name}</Link>
                    </Menu.Item>
                )
            }
        });
    }

    render() {
        let permission = ss.get(PERMISSION)
        console.log(permission)
        let menus = [
            {
                "id": 1,
                "name": "权限管理",
                "key": "/admin/permission",
                "parent_id": 0,
                "icon": "lock",
                "children": [
                    {
                        "id": 2,
                        "name": "用户管理",
                        "key": "/admin/user",
                        "parent_id": 1,
                        "icon": "user",
                        "children": []
                    },
                    {
                        "id": 3,
                        "name": "资源管理",
                        "key": "/admin/resource",
                        "parent_id": 1,
                        "icon": "wallet",
                        "children": []
                    },
                    {
                        "id": 4,
                        "name": "角色管理",
                        "key": "/admin/role",
                        "parent_id": 1,
                        "icon": "solution",
                        "children": [
                            // {
                            //     "id": 5,
                            //     "name": "新增角色",
                            //     "key": "/admin/role/add",
                            //     "parent_id": 4,
                            //     "icon": "gold",
                            //     "children": []
                            // }
                        ]
                    }
                ]
            }
        ]
        let menus2 = permission.filter(item => item.type == 1)// 只要菜单权限
        // console.log(menus2)
        // console.log(listToTree(menus2))
        // 去重
        menus2 = uniqueObj(menus2, 'id')
        menus = listToTree(menus2)

        // console.log(menus, '---menus---')

        
        return (
            <Menu
                defaultSelectedKeys={[router.location.pathname]}
                defaultOpenKeys={['/admin/permission']}
                mode="inline"
                theme="dark"
            >
                {
                    this.renderMenus(menus)
                }
            </Menu>
        )
    }
}
