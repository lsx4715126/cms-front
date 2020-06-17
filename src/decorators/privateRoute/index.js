import React, { Component } from 'react'
import Redreict from 'umi/redirect'

export default function(target){
    function root(props){
        return <Redreict to="/" />
    }

    return localStorage.getItem('logined') ? target : root
}


