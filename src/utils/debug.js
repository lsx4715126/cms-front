
import conf from './const'







let debug = (color = '') => (...opts) => {
    if(conf.mode == 'development'){
        let [ name, msg, ...other ] = opts
        console.log(`%c ${name}`, `color:${color}`, msg, ...other);
    }
}


export default debug
