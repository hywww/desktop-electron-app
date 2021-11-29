"use strict";

// 服务端地址
var fetch = require('node-fetch');

var serviceUrl = 'https://www.cde.org.cn';


const fetchPost = async (url, params) => {
	const response = await fetch(serviceUrl + url, {
		method: 'post',
		body: typeof data === 'string' ? params : objectToStrParams(resolveParams(params)),
		headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
	});
  if (response.status >= 200 && response.status < 300) {
    const o = await response['json']();
    return o;
  }
  console.log('error response', response);
  const error = new Error(response.statusText);
  error.response = response;
  console.log('fetch error', error, url);
  return error;
}

function resolveParams(params) {
  if (!params) {
    return;
  }
  const data = {};
  Object.keys(params).forEach((key) => {
    if ([undefined, null].indexOf(params[key]) === -1) {
      data[key] = typeof params[key] === 'string' ? encodeURIComponent(params[key]) : params[key];
    }
  });
  return data;
}

function objectToStrParams(data) {
  if (!data) return '';

  const params = [];
  Object.keys(data).forEach((key) => {
    params.push(`${key}=${data[key]}`);
  });

  return params.join('&');
}

module.exports.getIssueNotice = async (params) => {
  return fetchPost('https://www.cde.org.cn/zdyz/getDomesticGuideList?MmEwMD=3xGxwmXEsWtn4RQ4ybYY8zBiPY1Vjq5BAiicidoBdblEQRPMlQunQztyKTAiLdGlDkIR1K2YqIwhY22LqEvfzBcIHU8uIt14CmKSDbmpjnLCUpEEgBwtsJiRxIn9C2_JbhC62qC9g9bKPwKje8k106P2nt_ejJ7RFvZvW90NSIR8OV1_1GyqpjjOj4au.xZYXtuX2m8LzMnUX.pp6PHOW7o8ZIdRuR8nMY7tP72jVp7MOjdNQL0sN5l0f0DyDjkDjyYwgJZpo6NG7euv8oosGfkYhwRLrXSsblOs8P5EtRVKxFQQzwQz0lG3QDeh1_Z6w4xlelhDXIH7FwzO.7Mos7XfBhKh4hcwh45x5BlyTDUBD5wFUPsyd72q9RraL1.tNnZY', {
    pageNum: 1,
    pageSize: 20,
    isFbtg: 1,
    classid: '2853510d929253719601db17b8a9fd81',
  })
}

