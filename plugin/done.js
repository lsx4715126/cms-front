
function done(api, opts={}){
    api.register('buildSuccess', (...args) => {
        console.log('buildSuccess')
    })
}



module.exports = done