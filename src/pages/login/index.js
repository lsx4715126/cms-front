import React, { Component } from 'react'
import { Table, Card, Button, Modal, Form, Input, Radio, message, Popconfirm, DatePicker } from 'antd'
import { connect } from 'dva';
import { routerRedux } from 'dva/router'
import { ENTITY } from './const'
import { LocaleProvider } from 'antd';

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
    hadnleLogin = () => {
        let values = this.loginForm.props.form.getFieldsValue()
        let where = Object.entries(values).reduce((memo, [key, value]) => {
            if (value) {
                memo[key] = value
            }

            return memo
        }, {})

        console.log(where)
        this.props.dispatch({
            type: `${ENTITY}/login`,
            payload: where
        })
    }
    render() {


        return (
            <>
                <Card>
                    <LoginForm 
                        wrappedComponentRef={inst => this.loginForm = inst}
                        hadnleLogin={this.hadnleLogin}  
                    />
                </Card>
            </>
        )
    }
}


@Form.create()
class LoginForm extends Component {
    render() {
        let { form: { getFieldDecorator }, hadnleLogin } = this.props
        return (
            <Form layout="inline">
                <Form.Item>
                    {
                        getFieldDecorator('username', {
                            initialValue: 'admin09',
                            rules: [
                                { required: true }
                            ]
                        })(<Input placeholder="账号" autoComplete='off' />)
                    }
                </Form.Item>
                <Form.Item>
                    {
                        getFieldDecorator('password', {
                            initialValue: 'admin',
                            rules: [
                                { required: true }
                            ]
                        })(<Input placeholder="密码" autoComplete='off' />)
                    }
                </Form.Item>
                <Form.Item>
                    <Button onClick={hadnleLogin}>登录</Button>
                </Form.Item>
            </Form>
        )
    }
}
