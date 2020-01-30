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

// 修改文件名
if (!name) return;
async function changePackage() {
  const data = fs.readFileSync(path.resolve(__dirname, `./${category}/package.json`));
  console.log(JSON.parse(data))
}
changePackage();