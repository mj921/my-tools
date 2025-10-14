import fs from 'fs';

const list = fs.readdirSync('.');
const json = {
  all: list.filter((el) => /^\d{8}\.json$/.test(el)).map((el) => el.replace(/\.json$/, '')),
};
let i = 0;
while (i < list.length) {
  if (/^\d{8}\.json$/.test(list[i])) {
    const content = fs.readFileSync(`./${list[i]}`);
    if (content) {
      json[list[i].replace(/\.json$/, '')] = JSON.parse(content);
    }
  }
  i++;
}
fs.writeFileSync('./sum.json', JSON.stringify(json));
