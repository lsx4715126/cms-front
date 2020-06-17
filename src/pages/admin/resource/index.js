import React, { Component } from 'react'
import { Table, Card, Button } from 'antd'
import router from 'umi/router'
import { bounce, flash, wobble } from 'react-animations';
import Radium, { StyleRoot } from 'radium';
import styled, { keyframes } from 'styled-components';
// import { CSSTransition } from 'react-transition-group'
import withLocal from '@/decorators/withLocal'

import TweenOne from 'rc-tween-one';
var TweenOneGroup = TweenOne.TweenOneGroup;

const styles = {
    bounce: {
        animation: 'x 1s',
        animationName: Radium.keyframes(bounce, 'bounce')
    },
    flash: {
        animation: 'x 1s',
        animationName: Radium.keyframes(flash, 'flash')
    },
    wobble: {
        animation: 'x 1s',
        animationName: Radium.keyframes(wobble, 'wobble')
    },
}

const Bounce = styled.div`
    animation: 1s ${keyframes`${bounce}`};
`;


@withLocal('user')
export default class extends Component {
    state = {
        show: false
    }
    toggleState = () => {
        this.setState({show: false})
    }
    render() {
        console.log(this.props.user)

        const dataSource = [
            {
                key: '1',
                name: 'resource',
                age: 32,
                address: '西湖区湖底公园1号',
            },
            {
                key: '2',
                name: '胡彦祖',
                age: 42,
                address: '西湖区湖底公园1号',
            },
        ];

        const columns = [
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '年龄',
                dataIndex: 'age',
                key: 'age',
            },
            {
                title: '住址',
                dataIndex: 'address',
                key: 'address',
            },
            {
                title: '操作',
                render: (value, record, index) => {
                    return (
                        <Button.Group>
                            <Button type="warning">编辑</Button>
                            <Button type="warning">删除</Button>
                        </Button.Group>
                    )
                }
            }
        ];
        // console.log(bounce, 'bounce')
        // console.log(keyframes, 'keyframes')
        return <Card>
            <Table dataSource={dataSource} columns={columns} />
            <StyleRoot>
                <div style={styles.bounce}>
                    111
                </div>
                <span style={styles.flash}>
                    222
                </span>
                <span style={styles.wobble}>
                    {/*有些动画容器必须是div*/}
                    333
                </span>
                <Bounce><span>444</span></Bounce>
            </StyleRoot>


            <TweenOneGroup>
                <div key="0">demo</div>
            </TweenOneGroup>



            {/* <button onClick={this.toggleState}>click</button>
            <CSSTransition
                in={this.state.show}
                classNames={{
                    enter: 'animated',
                    enterActive: 'bounceIn',
                    exit: 'animated',
                    exitActive: 'bounceOut'
                }}
                timeout={500}
                mountOnEnter={true}
                unmountOnExit={true}
            >
                <div className="box" />
            </CSSTransition> */}
        </Card>
    }
}
