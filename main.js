const fs = require('fs');
const { JSDOM } = require('jsdom');

// 从标准输入读取文件路径
let filePath = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => filePath += chunk.trim());
process.stdin.on('end', () => {
  fs.readFile(filePath, 'utf8', (err, html) => {
    if (err) {
      console.error('读取文件失败:', err.message);
      process.exit(1);
    }

    const dom = new JSDOM(html);
    const document = dom.window.document;

    // 添加 <meta http-equiv="Content-Language">
    const head = document.querySelector('head') || document.createElement('head');
    if (!document.querySelector('meta[http-equiv="Content-Language"]')) {
      const meta = document.createElement('meta');
      meta.setAttribute('http-equiv', 'Content-Language');
      meta.setAttribute('content', 'zh-CN');
      head.prepend(meta);
      if (!document.querySelector('head')) {
        document.documentElement.prepend(head);
      }
    }

    // 为每个 <img> 添加 alt="{{alt()}}"
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.hasAttribute('alt')) {
        img.setAttribute('alt', '{{alt()}}');
      }
    });

    // 输出修改后的 HTML
    process.stdout.write(dom.serialize());
  });
});