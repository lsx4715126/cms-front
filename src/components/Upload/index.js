import React, { Component } from 'react'
import PropTypes from 'prop-types';




export default class Upload extends Component {
    render() {
        let { name } = this.props
        return (
            <div>
                { name }
            </div>
        )
    }
}


Upload.propTypes = {
    name: PropTypes.string.isRequired,
}








