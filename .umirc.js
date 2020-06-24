let path = require('path')
import pxToViewPort from 'postcss-px-to-viewport';


export default {
	// disableCSSModules: true,
	plugins: [
		'umi-plugin-dva',
		'./plugin/done.js',
	],
	hashHistory: true,//路由模式
	// chainWebpack: () => {
	// 	console.log('chainWebpack')
	// },
	// alias: {
	//     $: path.resolve(__dirname, 'src/utils/request.js'),
	// },
	"define": {
		"process.env.MODE": 1,//设置环境变量
	},
	externals: {// 使用cdn减少包的体积
		lodash: '_',
		jquery: 'jQuery'
	},
	extraBabelPlugins: ['@babel/plugin-syntax-optional-chaining'],
	// browserslist: ['> 1%', 'last 20 versions'],//配置浏览器版本
	// extraPostCSSPlugins: [
	// 	pxToViewPort({
	// 		viewportWidth: 375,
	// 		viewportHeight: 667,
	// 		unitPrecision: 5,
	// 		viewportUnit: 'vw',
	// 		selectorBlackList: [],
	// 		minPixelValue: 1,
	// 		mediaQuery: false,
	// 	}),
	// ],
}




/*
"D:\zhufeng\project\06.cms\front\.umirc.js" 中配置的 "chainWebpack" 并非约定的配置项，
请选择 "context, disableDynamicImport, disableHash, disableServiceWorker, exportStatic, loading,
pages, plugins, preact, routes, singular, outputPath, disableFastClick, hd, hashHistory, alias,
babel, browserslist, commons, copy, cssLoaderOptions, cssModulesExcludes, cssModulesWithAffix,
define, devtool, disableCSSModules, disableCSSSourceMap, disableDynamicImport, env,
es5ImcompatibleVersions, externals, extraBabelIncludes, extraBabelPlugins, extraBabelPresets,
extraPostCSSPlugins, extraResolveExtensions, extraResolveModules, html, ignoreMomentLocale,
lessLoaderOptions, manifest, proxy, publicPath, sass, serviceworker, theme, typescript, urlLoaderExcludes" 中的一项
*/