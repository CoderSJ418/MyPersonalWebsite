import fs from 'fs';

// 读取 Lighthouse 报告文件
const reportContent = fs.readFileSync('lighthouse-report.html', 'utf-8');

// 提取 JSON 部分
const jsonMatch = reportContent.match(/window\.__LIGHTHOUSE_JSON__ = ({[\s\S]*?});/);
if (jsonMatch) {
  const jsonData = JSON.parse(jsonMatch[1]);
  
  console.log('=== Lighthouse 性能报告 ===');
  console.log(`URL: ${jsonData.requestedUrl}`);
  console.log(`时间: ${new Date(jsonData.fetchTime).toLocaleString('zh-CN')}`);
  console.log(`用户代理: ${jsonData.userAgent}`);
  
  console.log('\n=== 核心 Web Vitals ===');
  const coreVitals = [
    'largest-contentful-paint',
    'first-input-delay', 
    'cumulative-layout-shift',
    'first-contentful-paint',
    'time-to-first-byte'
  ];
  
  coreVitals.forEach(metric => {
    const audit = jsonData.audits[metric];
    if (audit) {
      console.log(`${audit.title}: ${audit.displayValue} (评分: ${audit.score})`);
    }
  });
  
  console.log('\n=== 总体评分 ===');
  const categories = jsonData.categories;
  if (categories) {
    Object.entries(categories).forEach(([, category]) => {
      console.log(`${category.title}: ${Math.round(category.score * 100)}%`);
    });
  }
  
  console.log('\n=== 首屏加载时间 ===');
  const ttfb = jsonData.audits['time-to-first-byte'];
  if (ttfb) {
    console.log(`TTFB: ${ttfb.displayValue} (评分: ${ttfb.score})`);
  }
  
  const lcp = jsonData.audits['largest-contentful-paint'];
  if (lcp) {
    console.log(`LCP: ${lcp.displayValue} (评分: ${lcp.score})`);
  }
  
  console.log('\n=== 优化建议 ===');
  const warnings = jsonData.runWarnings;
  if (warnings.length > 0) {
    warnings.forEach(warning => {
      console.log(`⚠️  ${warning}`);
    });
  }
  
  const failingAudits = Object.entries(jsonData.audits).filter(([, audit]) => audit.score < 1);
  if (failingAudits.length > 0) {
    console.log(`\n❌ 发现 ${failingAudits.length} 个需要优化的项目:`);
    failingAudits.slice(0, 10).forEach(([, audit]) => {
      console.log(`  • ${audit.title}: ${audit.description}`);
    });
  }
} else {
  console.log('无法解析 Lighthouse 报告');
}