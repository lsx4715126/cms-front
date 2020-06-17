import React, { Component } from 'react'
import { Table, Card, Button, Modal, Form, Input, Radio, message, Popconfirm, Tree, Transfer } from 'antd'
import { connect } from 'dva';
import { routerRedux } from 'dva/router'
import { ENTITY } from './const'
import { PAGE_SIZE } from '@/utils/const'
import PermissionButton from '@/components/PermissionButton'

const TreeNode = Tree.TreeNode;

@connect(
    state => state[ENTITY]
)
export default class extends Component {
    save = (payload) => {
        //console.log(payload)
        this.props.dispatch({
            type: `${ENTITY}/save`,
            payload
        })
    }
    handleAdd = () => {
        //console.log(123)
        this.save({ editVisible: true, record: { gender: 1 } })
    }
    handleSave = () => {
        this.editForm.props.form.validateFields((err, values) => {
            if (err) {
                return message.warn('表单数据不合法')
            }

            console.log(values)
            this.props.dispatch({
                type: `${ENTITY}/addOrEdit`,
                payload: values
            })
        })
    }
    handleEdit = (record) => {
        this.save({ editVisible: true, record })
    }
    handleDel = id => {
        this.props.dispatch({
            type: `${ENTITY}/del`,
            payload: id
        })
    }
    handleDelAll = () => {
        if (this.props.selectedRowKeys.length < 1) {
            message.warning('请至少选中一行')
            return
        }
        this.props.dispatch({
            type: `${ENTITY}/delAll`,
            payload: this.props.selectedRowKeys
        })
    }
    hadnleSearch = () => {
        let values = this.searchForm.props.form.getFieldsValue()
        let where = Object.entries(values).reduce((memo, [key, value]) => {
            if (value) {
                memo[key] = value
            }

            return memo
        }, {})

        console.log(where)
        this.props.dispatch({
            type: `${ENTITY}/getList`,
            payload: { where }
        })
    }


    /*---------------设置权限----------------*/
    setResource = () => {
        if (this.props.selectedRowKeys.length < 1) {
            message.warning('请至少选中一行')
            return
        }
        this.save({ setResourceVisible: true })
    }
    setResourceOk = () => {
        this.props.dispatch({
            type: `${ENTITY}/setResource`,
        })
    }
    //树的checkbox选中事件
    onSetResourceCheck = (checkedKeys, info) => {
        console.log(checkedKeys, info, '----------')// info.halfCheckedKeys: 半选的父节点
        this.save({ checkedKeys, halfCheckedKeys: info.halfCheckedKeys })
    }


    /*----------------设置用户---------------*/
    setUser = () => {
        if (this.props.selectedRowKeys.length < 1) {
            message.warning('请至少选中一行')
            return
        }
        this.save({ setUserVisible: true, targetKeys: this.props.record.userIds })
    }
    setUserOk = () => {
        this.props.dispatch({
            type: `${ENTITY}/setUser`,
        })
    }
    onSetUserChange = (targetKeys) => {
        //console.log(checkedKeys)
        this.save({ targetKeys })
    }

    // 过滤掉 tree中 半选的父节点id。因为tree是联动的，父节点被选中时，子节点会自动被选中
    // 过滤点所有非叶子节点即可
    filterHalfCheckedKeys = (resourceIds) => {
        let { resource } =  this.props

        // 1.获取所有叶子节点ID
        let leafNode = []
        function findLeafNode(node){
            if(node.children.length > 0){
                node.children.forEach(item => findLeafNode(item))
            }else{
                leafNode.push(node)
            }
        }

        resource.forEach(item => findLeafNode(item))
        // console.log(leafNode, '---leafNode---')

        let leafNodeIds = leafNode.map(item => item.id)

        // 2.把resourceIds中不是叶子节点的ID过滤掉
        let ids = resourceIds.filter(item => leafNodeIds.indexOf(item) != -1)

        return ids
    }

    render() {
        let { list, editVisible, record, selectedRowKeys, pageNum, total,
            setResourceVisible, checkedKeys, resource,
            setUserVisible, users, targetKeys } = this.props

        const columns = [
            {
                title: '名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '操作',
                width: '200px',
                render: (value, record, index) => {
                    return (
                        <Button.Group>
                            <PermissionButton permission={["/admin/role/edit"]} type="warning" disabled={record.name == '超级管理员'} onClick={() => this.handleEdit(record)}>编辑</PermissionButton>
                            <Popconfirm title="确定删除吗？" onConfirm={() => this.handleDel(record.id)}>
                                <PermissionButton permission={["/admin/role/del"]} type="warning" disabled={record.name == '超级管理员'}>删除</PermissionButton>
                            </Popconfirm>
                        </Button.Group>
                    )
                }
            }
        ];

        let rowSelection = {
            type: 'radio',
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(selectedRowKeys, selectedRows)

                let resourceIds = selectedRows[0].resourceIds
                let ids = this.filterHalfCheckedKeys(resourceIds)
                console.log(ids)
                
                this.save({ selectedRowKeys, selectedRows, record: selectedRows[0], checkedKeys: ids })
            }
        }

        let pagination = {
            current: pageNum,
            total,
            pageSize: PAGE_SIZE,
            showTotal: total => `共${total}条`,
            onChange: (pageNum, pageSize) => {
                //console.log(routerRedux)
                this.props.dispatch(
                    routerRedux.push(`/admin/${ENTITY}?pageNum=${pageNum}`)
                )
            }
        }

        return (
            <>
                <Card>
                    <SearchForm
                        wrappedComponentRef={inst => this.searchForm = inst}
                        hadnleSearch={this.hadnleSearch}
                    />
                </Card>

                <Card>
                    <Button.Group>
                        <PermissionButton permission={["/admin/role/add"]} type="warning" onClick={this.handleAdd}>添加</PermissionButton>
                        {/* <Button type="warning" onClick={this.handleDelAll}>批量删除</Button> */}
                        <PermissionButton permission={["/admin/distribution/power"]} type="warning" onClick={this.setResource}>分配权限</PermissionButton>
                        <PermissionButton permission={["/admin/distribution/user"]} type="warning" onClick={this.setUser}>分配用户</PermissionButton>
                    </Button.Group>
                    <Table
                        dataSource={list}
                        columns={columns}
                        selectedRowKeys={selectedRowKeys}
                        rowKey={record => record.id}
                        rowSelection={rowSelection}
                        pagination={pagination}
                    />
                </Card>


                <EditModal
                    wrappedComponentRef={inst => this.editForm = inst}
                    visible={editVisible}
                    record={record}
                    onCancel={() => this.save({ editVisible: false })}
                    onOk={this.handleSave}
                />

                <SetResourceModal
                    visible={setResourceVisible}
                    record={record}
                    checkedKeys={checkedKeys}
                    resource={resource}
                    onCancel={() => this.save({ setResourceVisible: false })}
                    onOk={this.setResourceOk}
                    onCheck={this.onSetResourceCheck}
                />

                <SetUserModal
                    visible={setUserVisible}
                    record={record}
                    targetKeys={targetKeys}
                    users={users}
                    onCancel={() => this.save({ setUserVisible: false })}
                    onOk={this.setUserOk}
                    onChange={this.onSetUserChange}
                />
            </>
        )
    }
}


class SetUserModal extends Component {
    render() {
        let { visible, onCancel, record, onOk, targetKeys, onChange, users } = this.props

        return (
            <Modal
                title={`给 ${record.name} 分配用户`}
                visible={visible}
                onOk={onOk}
                onCancel={onCancel}
                destroyOnClose
            >
                <Transfer
                    dataSource={users}
                    titles={['待选', '已选']}
                    targetKeys={targetKeys}
                    onChange={onChange}
                    render={item => item.name}
                    rowKey={item => item.id}
                />
            </Modal>
        )
    }
}


class SetResourceModal extends Component {
    renderTree = (children = []) => {
        return children.map(item => {
            if (item.children && item.children.length > 0) {
                return (
                    <TreeNode title={item.name} key={item.id}>
                        {this.renderTree(item.children)}
                    </TreeNode>
                )
            } else {
                return <TreeNode title={item.name} key={item.id} />
            }
        })
    }

    render() {
        let { visible, onCancel, record, onOk, checkedKeys, onCheck, resource } = this.props
        /*
        let resources = [
            {
                id: 1,
                name: '权限管理',               
                children: [
                    {id:2, name: '用户管理', children:[]},
                    {id:3, name: '资源管理', children:[]},
                    {id:4, name: '角色管理', children:[
                        {id:5, name: '增加用户', children:[]},
                        {id:6, name: '删除用户', children:[]},
                    ]},
                ]
            }
        ]
        */
        return (
            <Modal
                title={`给 ${record.name} 分配权限`}
                visible={visible}
                onOk={onOk}
                onCancel={onCancel}
                destroyOnClose
            >
                <Tree
                    checkable
                    defaultExpandAll
                    checkedKeys={checkedKeys}
                    onCheck={onCheck}
                    destroyOnClose
                >
                    <TreeNode title="平台权限" key={0} disabled>
                        {/*<TreeNode title="权限管理" key={1}>
                            <TreeNode title="用户管理" key={2} />
                            <TreeNode title="资源管理" key={3} />
                            <TreeNode title="角色管理" key={4} />
                        </TreeNode>*/}
                        {this.renderTree(resource)}
                    </TreeNode>
                </Tree>
            </Modal>
        )
    }
}


@Form.create()
class SearchForm extends Component {
    render() {
        let { form: { getFieldDecorator }, hadnleSearch } = this.props
        return (
            <Form layout="inline">
                <Form.Item>
                    {
                        getFieldDecorator('name', {})(<Input placeholder="用户名" />)
                    }
                </Form.Item>
                <Form.Item>
                    {
                        getFieldDecorator('email', {})(<Input placeholder="邮箱" />)
                    }
                </Form.Item>
                <Form.Item>
                    <Button type="search" onClick={hadnleSearch}>搜索</Button>
                </Form.Item>
            </Form>
        )
    }
}


@Form.create()
class EditModal extends Component {
    render() {
        let { visible, form: { getFieldDecorator }, onOk, onCancel, record } = this.props
        console.log(visible)
        return (
            <Modal
                title={`${record.id ? '编辑' : '新增'}角色`}
                visible={visible}
                onOk={onOk}
                onCancel={onCancel}
                destroyOnClose
            >
                <Form>
                    <Form.Item>
                        {
                            getFieldDecorator('id', {
                                initialValue: record.id,
                            })(<Input type="hidden" />)
                        }
                    </Form.Item>
                    <Form.Item label="角色名">
                        {
                            getFieldDecorator('name', {
                                initialValue: record.name,
                                rules: [
                                    { required: true, message: '请输入角色名' }
                                ]
                            })(<Input />)
                        }
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}
