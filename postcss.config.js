module.exports = {
    plugins: {
        'autoprefixer': {
            browsers: ['Android >= 4.0', 'iOS >= 8']
        },
        'postcss-pxtorem': {
            rootValue: 37.5,// 设置的字体大小 = 设计图的宽度 / 10
            propList: ['*']
        }
    }
}