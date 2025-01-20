const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'content.txt');
const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log(
  'Введите текст для записи в файл и нажмите Enter. Для выхода введите "exit" или нажмите Ctrl + C.',
);

rl.on('line', (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    farewell();
  } else {
    writeStream.write(input + '\n');
    console.log('Текст записан. Введите ещё или "exit" для выхода:');
  }
});

rl.on('SIGINT', farewell);

function farewell() {
  console.log('\nСпасибо! Работа успешно завершена.');
  writeStream.end(() => {
    rl.close();
    process.exit(0);
  });
}
