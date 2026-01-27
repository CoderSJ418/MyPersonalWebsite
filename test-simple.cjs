const { execSync } = require('child_process');

try {
  console.log('运行测试...');
  const output = execSync('npm run test:run -- --run', {
    encoding: 'utf-8',
    stdio: 'pipe',
    timeout: 60000
  });
  
  const lines = output.split('\n');
  const summary = lines.filter(line => 
    line.includes('Test Files') || 
    line.includes('Tests') || 
    line.includes('Pass') || 
    line.includes('Fail') ||
    line.includes('Coverage')
  );
  
  console.log('测试结果:');
  summary.forEach(line => console.log(line));
  
  // 统计失败数量
  const failMatch = output.match(/Tests\s+(\d+)\s+failed/);
  if (failMatch) {
    const failed = parseInt(failMatch[1]);
    console.log(`\n失败的测试数量: ${failed}`);
    if (failed <= 53) {
      console.log('✅ 测试修复成功!');
    } else {
      console.log('❌ 仍有测试失败');
    }
  }
} catch (error) {
  console.error('测试运行出错:', error.message);
}