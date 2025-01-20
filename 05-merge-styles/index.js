const fs = require('fs');
const path = require('path');

const stylesPath = path.join(__dirname, 'styles');
const projectPath = path.join(__dirname, 'project-dist');
const bundleStylesPath = path.join(projectPath, 'bundle.css');

const writeStream = fs.createWriteStream(bundleStylesPath, { flags: 'w' });

fs.promises
  .readdir(stylesPath, { withFileTypes: true })
  .then((files) => {
    const filePromises = files
      .filter((file) => file.isFile() && path.extname(file.name) === '.css')
      .map((file) => {
        const filePath = path.join(stylesPath, file.name);
        return fs.promises.readFile(filePath, 'utf-8');
      });
    return Promise.all(filePromises).then((contents) => {
      contents.forEach((content) => writeStream.write(content + '\n'));
    });
  })
  .then(() => {
    writeStream.end();
  });
