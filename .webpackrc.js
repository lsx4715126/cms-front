let path = require('path')

export default {
    "alias": {
        '@': path.resolve('src'),
    },
    "proxy": {
        "/api": {
            "target": "http://127.0.0.1:7001",
            "changeOrigin": true,
            "pathRewrite": { "^/api": "" }
        }
    },
    "theme": {
        "@primary-color": "#1DA57A"
    },
}