#! /usr/local/bin/node
const fs = require('fs');
const { JSDOM } = require('jsdom');

// 从标准输入读取文件路径
let filePath = process.argv[2] || '';
if (!!!filePath) {
  console.error('文件路径:', filePath);
  console.error('文件路径:', filePath);
  console.error('文件路径:', filePath);
  process.exit(0); // 如果通过命令行参数传递了文件路径，则直接退出
}

fs.readFile(filePath, 'utf8', (err, html) => {
  if (err) {
    console.error('读取文件失败:', err.message);
    process.exit(1);
  }

  const dom = new JSDOM(html);
  const document = dom.window.document;

  // 添加 <meta http-equiv="Content-Language">
  const head = document.querySelector('head') || document.createElement('head');
  if (!document.querySelector('meta[http-equiv=Content-Language]')) {
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
  images.forEach((img, index) => {
    if (!!!img.getAttribute('alt')) {
      img.setAttribute('alt', `{{alt(${index})}}`);
    }
  });
  fs.writeFileSync(filePath, dom.serialize(), 'utf8');
  // 输出修改后的 HTML
  process.stdout.write(document.documentElement.outerHTML);
  process.stdout.write(dom.serialize());
});
