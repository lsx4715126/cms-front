import React, { Component } from 'react'
import { Layout } from 'antd'

import NavLeft from '@/components/NavLeft'

// import TweenOne from 'rc-tween-one';
// var TweenOneGroup = TweenOne.TweenOneGroup;

let { Header, Sider, Content, Footer } = Layout

export default class extends Component {
    render() {
        return (
            <Layout>
                <Header>Header</Header>
                <Layout>
                    <Sider><NavLeft /></Sider>
                    {/* <TweenOneGroup><Content>{this.props.children}</Content></TweenOneGroup> */}
                    <Content>{this.props.children}</Content>
                </Layout>
                <Footer>Footer</Footer>
            </Layout>
        )
    }
}
