/**
 * 日期格式化工具
 */

type DateFormatStyle = 'long' | 'short' | 'numeric'

/**
 * 格式化日期字符串
 * @param date ISO 日期字符串
 * @param style 格式风格：long=2026年6月30日, short=2026/06/30, numeric=2026年6月30日
 */
export const formatDate = (date: string, style: DateFormatStyle = 'short'): string => {
  const options: Record<DateFormatStyle, Intl.DateTimeFormatOptions> = {
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    short: { year: 'numeric', month: '2-digit', day: '2-digit' },
    numeric: { year: 'numeric', month: 'short', day: 'numeric' }
  }
  return new Date(date).toLocaleDateString('zh-CN', options[style])
}

/**
 * 格式化为年月（如 "2026年6月"）
 * @param date 格式为 "YYYY-MM" 的日期字符串
 */
export const formatYearMonth = (date: string): string => {
  const [year, month] = date.split('-')
  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ]
  return `${year}年${monthNames[parseInt(month) - 1]}`
}