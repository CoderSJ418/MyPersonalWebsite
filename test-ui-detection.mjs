/**
 * UI 检测脚本 - 检测项目列表页和详情页的 UI 问题
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = 'E:/work/AI/assets/screenshots/ui-testing';

async function main() {
  // 确保输出目录存在
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('第一步：检测项目列表页');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // 1. 访问项目列表页
  await page.goto('http://localhost:5173/projects', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // 截取项目列表页
  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'projects-list-desktop.png'),
    fullPage: true
  });
  console.log('✅ 项目列表页截图已保存');

  // 检测布局问题
  const layoutIssues = await page.evaluate(() => {
    const issues = [];

    // 1. 检测水平溢出
    document.querySelectorAll('*').forEach(el => {
      if (el.scrollWidth > window.innerWidth + 10) {
        issues.push({
          type: 'horizontal-overflow',
          tag: el.tagName,
          class: el.className?.substring(0, 50) || '',
          scrollWidth: el.scrollWidth,
          viewport: window.innerWidth
        });
      }
    });

    // 2. 检测内容区域
    const contentAreas = document.querySelectorAll('main, .content, .container, [class*="project"]');
    const contentInfo = [];
    contentAreas.forEach(el => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      contentInfo.push({
        class: el.className?.substring(0, 50) || '',
        width: rect.width,
        padding: style.padding,
        maxWidth: style.maxWidth
      });
    });

    // 3. 检测卡片样式
    const cards = document.querySelectorAll('[class*="card"], [class*="Card"]');
    const cardInfo = [];
    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const style = window.getComputedStyle(card);
      cardInfo.push({
        index,
        class: card.className?.substring(0, 80) || '',
        width: rect.width,
        height: rect.height,
        padding: style.padding,
        margin: style.margin,
        borderRadius: style.borderRadius,
        boxShadow: style.boxShadow?.substring(0, 50) || ''
      });
    });

    // 4. 检测标题样式
    const headings = document.querySelectorAll('h1, h2, h3');
    const headingInfo = [];
    headings.forEach(h => {
      const style = window.getComputedStyle(h);
      headingInfo.push({
        tag: h.tagName,
        text: h.textContent?.substring(0, 30) || '',
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        color: style.color,
        margin: style.margin
      });
    });

    return {
      overflowIssues: issues.slice(0, 10),
      contentAreas: contentInfo.slice(0, 5),
      cards: cardInfo.slice(0, 5),
      headings: headingInfo
    };
  });

  console.log('\n📊 布局检测结果：');
  console.log('水平溢出问题:', layoutIssues.overflowIssues.length);
  console.log('内容区域:', layoutIssues.contentAreas.length);
  console.log('卡片数量:', layoutIssues.cards.length);
  console.log('标题数量:', layoutIssues.headings.length);

  // 保存检测结果
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'projects-list-analysis.json'),
    JSON.stringify(layoutIssues, null, 2)
  );

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('第二步：检测项目详情页');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // 点击第一个项目卡片
  const projectCards = await page.locator('[class*="card"], [class*="Card"]').all();
  let detailUrl = '';

  if (projectCards.length > 0) {
    // 获取第一个卡片的链接
    const firstCard = projectCards[0];
    const link = await firstCard.locator('a').first();
    if (await link.count() > 0) {
      detailUrl = await link.getAttribute('href') || '';
      await link.click();
    } else {
      // 直接尝试访问详情页
      detailUrl = '/projects/1';
      await page.goto(`http://localhost:5173${detailUrl}`, { waitUntil: 'networkidle' });
    }
  } else {
    detailUrl = '/projects/1';
    await page.goto(`http://localhost:5173${detailUrl}`, { waitUntil: 'networkidle' });
  }

  await page.waitForTimeout(2000);

  // 截取项目详情页
  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'project-detail-desktop.png'),
    fullPage: true
  });
  console.log('✅ 项目详情页截图已保存');

  // 检测详情页布局
  const detailLayout = await page.evaluate(() => {
    const issues = [];

    // 1. 检测水平溢出
    document.querySelectorAll('*').forEach(el => {
      if (el.scrollWidth > window.innerWidth + 10) {
        issues.push({
          type: 'horizontal-overflow',
          tag: el.tagName,
          class: el.className?.substring(0, 50) || '',
          scrollWidth: el.scrollWidth,
          viewport: window.innerWidth
        });
      }
    });

    // 2. 检测详情页内容区域
    const detailAreas = document.querySelectorAll('[class*="detail"], main, .content, .container');
    const detailInfo = [];
    detailAreas.forEach(el => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      detailInfo.push({
        class: el.className?.substring(0, 80) || '',
        width: rect.width,
        height: rect.height,
        padding: style.padding,
        maxWidth: style.maxWidth,
        backgroundColor: style.backgroundColor
      });
    });

    // 3. 检测标题样式
    const headings = document.querySelectorAll('h1, h2, h3');
    const headingInfo = [];
    headings.forEach(h => {
      const style = window.getComputedStyle(h);
      headingInfo.push({
        tag: h.tagName,
        text: h.textContent?.substring(0, 50) || '',
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        color: style.color,
        margin: style.margin,
        lineHeight: style.lineHeight
      });
    });

    // 4. 检测图片
    const images = document.querySelectorAll('img');
    const imageInfo = [];
    images.forEach((img, index) => {
      imageInfo.push({
        index,
        src: img.src?.substring(0, 50) || '',
        alt: img.alt,
        width: img.width,
        height: img.height,
        objectFit: window.getComputedStyle(img).objectFit
      });
    });

    // 5. 检测按钮
    const buttons = document.querySelectorAll('button, a[class*="btn"], [role="button"]');
    const buttonInfo = [];
    buttons.forEach((btn, index) => {
      const style = window.getComputedStyle(btn);
      buttonInfo.push({
        index,
        text: btn.textContent?.substring(0, 30) || '',
        class: btn.className?.substring(0, 50) || '',
        padding: style.padding,
        borderRadius: style.borderRadius,
        backgroundColor: style.backgroundColor,
        color: style.color
      });
    });

    // 6. 检测标签/徽章
    const tags = document.querySelectorAll('[class*="tag"], [class*="badge"], [class*="Badge"], [class*="Tag"]');
    const tagInfo = [];
    tags.forEach((tag, index) => {
      const style = window.getComputedStyle(tag);
      tagInfo.push({
        index,
        text: tag.textContent?.substring(0, 20) || '',
        class: tag.className?.substring(0, 50) || '',
        padding: style.padding,
        borderRadius: style.borderRadius,
        backgroundColor: style.backgroundColor,
        fontSize: style.fontSize
      });
    });

    return {
      overflowIssues: issues.slice(0, 10),
      detailAreas: detailInfo.slice(0, 5),
      headings: headingInfo,
      images: imageInfo.slice(0, 5),
      buttons: buttonInfo.slice(0, 5),
      tags: tagInfo.slice(0, 10)
    };
  });

  console.log('\n📊 详情页检测结果：');
  console.log('水平溢出问题:', detailLayout.overflowIssues.length);
  console.log('内容区域:', detailLayout.detailAreas.length);
  console.log('标题数量:', detailLayout.headings.length);
  console.log('图片数量:', detailLayout.images.length);
  console.log('按钮数量:', detailLayout.buttons.length);
  console.log('标签数量:', detailLayout.tags.length);

  // 保存检测结果
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'project-detail-analysis.json'),
    JSON.stringify(detailLayout, null, 2)
  );

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('第三步：响应式检测');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // 移动端视图
  await page.setViewportSize({ width: 375, height: 667 });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'project-detail-mobile.png'),
    fullPage: true
  });
  console.log('✅ 移动端截图已保存');

  // 平板视图
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'project-detail-tablet.png'),
    fullPage: true
  });
  console.log('✅ 平板截图已保存');

  await browser.close();

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ UI 检测完成！');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`截图保存在: ${OUTPUT_DIR}`);
}

main().catch(console.error);
