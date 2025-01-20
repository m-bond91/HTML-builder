const fs = require('fs');
const path = require('path');

const projectPath = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');
const outputHTMLPath = path.join(projectPath, 'index.html');
const outputStylesPath = path.join(projectPath, 'style.css');
const outputAssetsPath = path.join(projectPath, 'assets');

async function buildHTML() {
  try {
    await fs.promises.mkdir(projectPath, { recursive: true });

    let template = await fs.promises.readFile(templatePath, 'utf-8');

    const tagRegExp = /\{\{(\w+)\}\}/g;
    const tags = [...template.matchAll(tagRegExp).map((match) => match[1])];

    for (const tag of tags) {
      const componentPath = path.join(componentsPath, `${tag}.html`);

      try {
        const componentContent = await fs.promises.readFile(
          componentPath,
          'utf-8',
        );
        template = template.replace(`{{${tag}}}`, componentContent);
      } catch {
        console.log(`Компонент ${tag} не найден`);
      }
    }

    await fs.promises.writeFile(outputHTMLPath, template, 'utf-8');
  } catch {
    console.log('Необходимо проверить сборку.');
  }
}

async function buildStyles() {
  const writeStream = fs.createWriteStream(outputStylesPath, { flags: 'w' });
  await fs.promises
    .readdir(stylesPath, {
      withFileTypes: true,
    })
    .then((files) => {
      const cssFiles = files
        .filter((file) => file.isFile() && path.extname(file.name) === '.css')
        .map((file) => {
          const filePath = path.join(stylesPath, file.name);
          return fs.promises.readFile(filePath, 'utf-8');
        });
      return Promise.all(cssFiles).then((contents) => {
        contents.forEach((content) => writeStream.write(content + '\n'));
      });
    })
    .then(() => {
      writeStream.end();
    });
}

async function copyAssets(src, dest) {
  try {
    await fs.promises.mkdir(dest, { recursive: true });
    const entries = await fs.promises.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await copyAssets(srcPath, destPath);
      } else {
        await fs.promises.copyFile(srcPath, destPath);
      }
    }
  } catch (error) {
    console.log('Ошибка при копировании assets', error);
  }
}
async function buildPage() {
  await buildHTML();
  await buildStyles();
  await copyAssets(assetsPath, outputAssetsPath);
}

buildPage();
