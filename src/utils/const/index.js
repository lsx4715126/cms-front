import dev from './const.dev.js'
import prod from './const.prod.js'
import test from './const.test.js'

export let isDev = process.env.NODE_ENV === 'development'

export const mode = process.env.MODE



export const DEV = 'dev'
export const PROD = 'prod'
export const TEST = 'test'



export const PERMISSION = 'permission'




export const PAGE_SIZE = 3










let config = {}

config.PAGE_SIZE = 3








switch(mode){
    case DEV:
        config = { ...config, ...dev}
        break
    case PROD:
        config = { ...config, ...prod}
        break
    case TEST:
        config = { ...config, ...test}
        break
}
export default config