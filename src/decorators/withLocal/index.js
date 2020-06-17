import React, { Component } from 'react'


export default function(name = 'user'){
    return function(Com){
        
    
        return class extends Component{
            constructor(){
                super()
                this.state = {
                    value: ''
                }
            }

            componentDidMount(){
                this.setState({
                    // value: localStorage.getItem(name),
                    value: 123
                })
            }
            
            render(){
                let o = {
                    ...this.props,
                    [name]: this.state.value
                }
                return <Com {...o} />
            }
        }
    }
}

