const fs = require('fs');
const path = require('path');
const dirPath = path.join(__dirname, 'secret-folder');

fs.promises.readdir(dirPath, { withFileTypes: true }).then((files) => {
  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(dirPath, file.name);

      fs.promises.stat(filePath).then((stats) => {
        const fileSizeInKB = (stats.size / 1024).toFixed(3);
        const fileName = path.parse(file.name).name;
        const fileExt = path.extname(file.name).slice(1);
        console.log(`${fileName} - ${fileExt} - ${fileSizeInKB} kb`);
      });
    }
  });
});
