
import conf from './const'







let debug = (color = '') => (name, msg) => {
    if(conf.mode == 'development'){
        console.log(`%c ${name}`, `color:${color}`, msg);
    }
}


export default debug
