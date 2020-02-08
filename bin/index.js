#!/usr/bin/env node

const minimist = require('minimist');
const shell = require('shelljs');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

// 解析脚手架地址
const argv = minimist(process.argv.slice(2))
const { c: category, n: name } = argv;
const depot = `https://github.com/duanyuanping/page-construct-template/trunk/${category}`;

// 下载脚手架文件
shell.echo('开始下载脚手架文件');
if (!shell.which('svn')) {
  console.log(chalk.red('请确保svn命令已安装'));
  shell.exit(1);
}
let code = shell.exec(`svn co ${depot}`).code;
if (code !== 0) {
  console.log(chalk.red('脚手架文件下载失败'));
  shell.exit(1);
}
shell.echo('脚手架文件下载成功');

// 修改文件内容
shell.echo('开始修改脚手架文件内容');
if (!name) return;
const packagePath = path.resolve(process.cwd(), `./${category}/package.json`);
const dataBuf = fs.readFileSync(packagePath);
const data = JSON.parse(dataBuf);
data.name = `page-construct-template_${category}_${name}`;
fs.writeFileSync(packagePath, JSON.stringify(data, null, 2), 'utf8');
shell.echo('脚手架文件内容修改成功');

// 修改文件夹名
shell.echo('开始修改脚手架文件名');
let retry = 0;
function changeFileName() {
  code = shell.exec(`mv ${category} ${name}`).code;
  if (code !== 0) {
    if (retry < 3) {
      retry += 1;
      changeFileName();
    } else {
      console.log(chalk.yellow('请手动修改项目文件夹名'));
    }
  } else {
    shell.echo('脚手架文件名修改成功');
  }
}
changeFileName();

// 安装依赖
if (category === 'component') {
  let npm = 'npm';
  if (shell.which('cnpm')) {
    npm = 'cnpm';
  }
  shell.echo(`开始安装脚手架依赖，工具：${npm}`);
  if (retry < 3) {
    shell.exec(`cd ${name} && ${npm} i`);
  } else {
    shell.exec(`cd ${category} && ${npm} i`);
  }
  shell.echo('脚手架依赖安装成功');
}

console.log(chalk.green('项目初始化成功'));