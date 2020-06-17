import React, { Component } from 'react'
import { Table, Card, Button, Modal, Form, Input, Radio, message, Popconfirm, DatePicker } from 'antd'
import { connect } from 'dva';
import { routerRedux } from 'dva/router'
import { ENTITY } from './const'
import { PAGE_SIZE } from '@/utils/const'
import moment from 'moment'
import privateRoute from '@/decorators/privateRoute'
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import PermissionButton from '@/components/PermissionButton'

const { MonthPicker } = DatePicker;


// @privateRoute
@connect(
    state => ({
        ...state[ENTITY],
        test: state.global.test,
        loading: state.loading.models[ENTITY]
    })
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

            console.log(values, '+++++++++++++++')
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
            console.log(key, value, '---')
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
    render() {
        let { list, editVisible, record, selectedRowKeys, pageNum, total, test } = this.props
        console.log(test)
        const columns = [
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '性别',
                dataIndex: 'gender',
                key: 'gender',
            },
            {
                title: '邮箱',
                dataIndex: 'email',
                key: 'email',
            },
            {
                title: '操作',
                render: (value, record, index) => {
                    return (
                        <Button.Group>
                            <PermissionButton permission={["/admin/user/edit"]} type="warning" onClick={() => this.handleEdit(record)}>编辑</PermissionButton>
                            <Popconfirm title="确定删除吗？" onConfirm={() => this.handleDel(record.id)}>
                                <PermissionButton permission={["/admin/user/del"]} type="warning">删除</PermissionButton>
                            </Popconfirm>
                        </Button.Group>
                    )
                }
            }
        ];

        let rowSelection = {
            type: 'checkbox',
            onChange: (selectedRowKeys, selectedRows) => {
                this.save({ selectedRowKeys, selectedRows })
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
                    {/* <LocaleProvider locale={zh_CN}>
                        <DatePicker onChange={() => {}} />
                    </LocaleProvider> */}
                </Card>

                <Card>
                    <Button.Group>
                        <PermissionButton permission={["/admin/user/add"]} type="warning" onClick={this.handleAdd}>添加</PermissionButton>
                        <PermissionButton permission={["/admin/user/del"]} type="warning" onClick={this.handleDelAll}>批量删除</PermissionButton>
                    </Button.Group>
                    <Table
                        dataSource={list}
                        columns={columns}
                        selectedRowKeys={selectedRowKeys}
                        rowKey={record => record.id}
                        rowSelection={rowSelection}
                        pagination={pagination}
                        onRow={(record, index) => {
                            return {
                                onClick: event => { console.log('点击行') }, // 点击行
                                onDoubleClick: event => { },
                                onContextMenu: event => { },
                                onMouseEnter: event => { }, // 鼠标移入行
                                onMouseLeave: event => { },
                            };
                        }}
                        onHeaderRow={column => {
                            return {
                                onClick: () => { }, // 点击表头行
                            };
                        }}
                    />
                </Card>


                <EditModal
                    wrappedComponentRef={inst => this.editForm = inst}
                    visible={editVisible}
                    record={record}
                    onCancel={() => this.save({ editVisible: false })}
                    onOk={this.handleSave}
                />
            </>
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
                        getFieldDecorator('name', {})(
                            <Input 
                                onBlur={() => console.log('onBlur')} 
                                onFocus={() => console.log('onFocus')} 
                                onPressEnter={() => console.log('onPressEnter')} 
                                placeholder="用户名" 
                            />
                        )
                    }
                </Form.Item>
                <Form.Item>
                    {
                        getFieldDecorator('email', {})(<Input placeholder="邮箱" autoComplete='off' />)
                    }
                </Form.Item>
                {/* <Form.Item>
                    {
                        getFieldDecorator('month', {
                            initialValue: moment('2015-08', 'YYYY-MM')
                        })(<MonthPicker />)
                    }
                </Form.Item> */}
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
                title={`${record.id ? '编辑' : '新增'}用户`}
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
                    <Form.Item label="username">
                        {
                            getFieldDecorator('username', {
                                initialValue: record.username,
                                rules: [
                                    { required: true, message: '请输入username' }
                                ]
                            })(<Input />)
                        }
                    </Form.Item>
                    <Form.Item label="password">
                        {
                            getFieldDecorator('password', {
                                initialValue: record.password,
                                rules: [
                                    { required: true, message: '请输入password' }
                                ]
                            })(<Input />)
                        }
                    </Form.Item>
                    <Form.Item label="用户名">
                        {
                            getFieldDecorator('name', {
                                initialValue: record.name,
                                rules: [
                                    { required: true, message: '请输入用户名' }
                                ]
                            })(<Input />)
                        }
                    </Form.Item>
                    <Form.Item label="邮箱">
                        {
                            getFieldDecorator('email', {
                                initialValue: record.email,
                                rules: [
                                    { required: true, message: '请输入邮箱' }
                                ]
                            })(<Input />)
                        }
                    </Form.Item>
                    <Form.Item label="性别">
                        {
                            getFieldDecorator('gender', {
                                initialValue: record.gender,
                                rules: [
                                    { required: true, message: '请输入邮箱' }
                                ]
                            })(
                                <Radio.Group>
                                    <Radio value={1}>男</Radio>
                                    <Radio value={0}>女</Radio>
                                </Radio.Group>
                            )
                        }
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}
