const { ipcRenderer, app, session } = require('electron')
const path = require('path');
const fse = require('fs-extra');
const fs = require('fs');
const { findIndex } = require('lodash');
// const { getIssueNotice } = require('./service')

let filedir = '';


//监听主进程，设置环境变量、记住密码
ipcRenderer.on('page-loaded', (event, json) => {
  filedir = path.join(json.homePath, '/cdeFiles/news.json'); // 存放文件的位置
  if (location.href.indexOf('9cd8db3b7530c6fa0c86485e563f93c7') > -1) { // 指导原则
    setTimeout(getGuidPrinciple, 2000)
    setTimeout(() => {
      window.location.href = 'https://www.cde.org.cn/zdyz/listpage/2853510d929253719601db17b8a9fd81';
    }, 20000)
  } else if (location.href.indexOf('2853510d929253719601db17b8a9fd81') > -1) { // 发布通告
    setTimeout(getIssueNotice, 2000)
    setTimeout(() => {
      window.location.href = 'https://www.cde.org.cn/zdyz/listpage/3c49fad55caad7a034c263cfc2b6eb9c';
    }, 20000)
  } else if (location.href.indexOf('3c49fad55caad7a034c263cfc2b6eb9c') > -1) { // 征求意见
    setTimeout(getIssueNotice, 2000)
  }
  
  
  setInterval(() => { // 1小时定时器
    window.location.href = 'https://www.cde.org.cn/zdyz/listpage/9cd8db3b7530c6fa0c86485e563f93c7';
  }, 1000 * 60 * 60 * 1)
});

const saveData = async (newsList) => { // 数组新老对比

  try {
    // const dataStr = await fse.readFile(filedir, 'utf8')
    const dataStr = fs.readFileSync(filedir, 'utf8');
    const oldNewsListJSON = JSON.parse(dataStr)
    const oldNewsListArr = jsonManager(oldNewsListJSON)
    let hasNew = false;
    for (let i = 0; i < newsList.length; i++) {
      console.log(findIndex(oldNewsListArr, ['link', newsList[i].link]))
      if (findIndex(oldNewsListArr, ['link', newsList[i].link]) === -1) {
        oldNewsListArr.unshift(newsList[i])
        hasNew = true
      } else {
        break
      }
    }
    if (hasNew) {
      const newsListJSON = arrayManager(oldNewsListArr)
      fse.outputFileSync(filedir, JSON.stringify(newsListJSON))
    }
  } catch (err) {
    const newsListJSON = arrayManager(newsList)
    fse.outputFileSync(filedir, JSON.stringify(newsListJSON))
  }
}

function getIssueNotice() { // 获取发布通告和征求意见的内容
  const newslistNode = document.getElementsByClassName('news_content_title');
  const newsDate = document.getElementsByClassName('news_date');
  const links = document.getElementsByClassName('right_default');

  const list = Array.from(newslistNode).map((i, index) => {
    return { text:newslistNode[index].innerText, link: links[index].href, time: newsDate[index].innerText }
  })
  saveData(list);
}

function getGuidPrinciple() { // 获取指导原则
  const newslistNode = document.getElementsByClassName('layui-table')[1].children[0].children;
  const links = document.getElementsByClassName('a-link');

  const list = Array.from(newslistNode).map((i, index) => {
    const textArr = i.innerText?.split('\n') || [];
    return { text:textArr[2], link: links[index].href, time: textArr[textArr.length - 1] }
  })
  saveData(list);
}



function arrayManager (data, pKey) { // 数组转json
  const obj = {};
  const keys = [];
  data.forEach((item, i) => {
    const key = (pKey && item[pKey]) || i;
    obj[key] = item;
    keys.push(key);
  });
  return obj
};

function jsonManager (json) { // json转数组
  const arr = [];
  for (var i in json) {
    arr.push(json[i])
  }
  return arr
};