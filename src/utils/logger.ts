import log from 'loglevel'

// 根据环境设置日志级别
const isProduction = import.meta.env.PROD
const isDevelopment = import.meta.env.DEV

if (isProduction) {
  log.setLevel('error') // 生产环境只显示错误
} else if (isDevelopment) {
  log.setLevel('debug') // 开发环境显示所有日志
} else {
  log.setLevel('warn') // 其他环境显示警告和错误
}

// 导出日志实例
export const logger = log

// 导出便捷方法
export const { trace, debug, info, warn, error } = log

// 默认导出
export default logger
