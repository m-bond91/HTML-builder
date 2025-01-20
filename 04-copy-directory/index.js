const fs = require('fs').promises;
const path = require('path');

const dirPath = path.join(__dirname, 'files');
const dirPathCopy = path.join(__dirname, 'files-copy');

async function copyDir(src, dest) {
  try {
    await fs.rm(dest, { recursive: true, force: true });

    await fs.mkdir(dest, { recursive: true });

    const items = await fs.readdir(src, { withFileTypes: true });

    for (const item of items) {
      const srcPath = path.join(src, item.name);
      const destPath = path.join(dest, item.name);

      if (item.isFile()) {
        await fs.copyFile(srcPath, destPath);
      } else if (item.isDirectory()) {
        await copyDir(srcPath, destPath);
      }
    }
  } catch (error) {
    console.error('Ошибка: ', error);
  }
}
copyDir(dirPath, dirPathCopy);
