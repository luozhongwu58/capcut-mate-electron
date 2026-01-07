// ===== 中文菜单模块 =====
const { Menu, shell } = require('electron');

function createChineseMenu() {
  const template = [
    {
      label: '\u6587\u4EF6',  // 文件
      submenu: [
        { label: '\u9000\u51FA', role: 'quit' }  // 退出
      ]
    },
    {
      label: '\u7F16\u8F91',  // 编辑
      submenu: [
        { label: '\u64A4\u9500', role: 'undo' },      // 撤销
        { label: '\u91CD\u505A', role: 'redo' },      // 重做
        { type: 'separator' },
        { label: '\u526A\u5207', role: 'cut' },       // 剪切
        { label: '\u590D\u5236', role: 'copy' },      // 复制
        { label: '\u7C98\u8D34', role: 'paste' },     // 粘贴
        { label: '\u5168\u9009', role: 'selectAll' }  // 全选
      ]
    },
    {
      label: '\u89C6\u56FE',  // 视图
      submenu: [
        { label: '\u91CD\u65B0\u52A0\u8F7D', role: 'reload' },           // 重新加载
        { label: '\u5F00\u53D1\u8005\u5DE5\u5177', role: 'toggleDevTools' },  // 开发者工具
        { type: 'separator' },
        { label: '\u653E\u5927', role: 'zoomIn' },          // 放大
        { label: '\u7F29\u5C0F', role: 'zoomOut' },         // 缩小
        { label: '\u5B9E\u9645\u5927\u5C0F', role: 'resetZoom' },  // 实际大小
        { type: 'separator' },
        { label: '\u5168\u5C4F', role: 'togglefullscreen' }  // 全屏
      ]
    },
    {
      label: '\u7A97\u53E3',  // 窗口
      submenu: [
        { label: '\u6700\u5C0F\u5316', role: 'minimize' },  // 最小化
        { label: '\u5173\u95ED', role: 'close' }            // 关闭
      ]
    },
    {
      label: '\u5E2E\u52A9',  // 帮助
      submenu: [
        {
          label: '\u524D\u5F80\u5B98\u7F51',  // 前往官网
          click: async () => {
            await shell.openExternal('https://gy.aiznwd.com/');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

module.exports = { createChineseMenu };