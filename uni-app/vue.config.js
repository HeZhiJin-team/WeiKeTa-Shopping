module.exports = {
	productionSourceMap: false, // 生产打包时不输出map文件，增加打包速度
	devServer: {
		disableHostCheck: true,
		proxy: {
			'/pay': {
				target: 'http://101.33.220.113',
				changeOrigin: true,
				secure: false,
				pathRewrite: {
					'^/pay': '/cgi/main'
				}
			}
		}
	},
	configureWebpack: config => {
		if (process.env.NODE_ENV === 'production') {
			config.optimization.minimizer[0].options.terserOptions.compress.warnings = false
			config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
			config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true
			config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = ['console.log']
		}
	}
}
