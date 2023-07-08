const fs = require('fs');

function getFilesAndFoldersInDir(path) {
  const items = fs.readdirSync(path);
  const result = [];
  items.forEach(item => {
    const itemPath = `${path}/${item}`;
    const stat = fs.statSync(itemPath);
    if (stat.isDirectory()) {
      let data = {
        // 文件夹
        type: 'folder',
        name: item
      }
      let children = getFilesAndFoldersInDir(itemPath)
      if (children && children.length) {
        data.children = children
      }
      result.push(data);
    } else {
      // 文件
      result.push({
        type: 'file',
        name: item
      });
    }
  });
  return result;
}

export default getFilesAndFoldersInDir