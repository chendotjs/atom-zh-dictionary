'use babel';

import request from 'request';
import querystring from 'querystring';
import xml2js from 'xml2js';

const parseString = xml2js.parseString;

export default {
  word: null,
  requestURL: null,

  init(word) {
    this.word = word;
    this.requestURL = `http://dict.youdao.com/fsearch?client=deskdict&keyfrom=chrome.extension&q=${querystring.escape(word)}&pos=-1&doctype=xml&xmlVersion=3.2&dogVersion=1.0&vendor=unknown&appVer=3.1.17.4208&le=eng%2520HTTP/1.1%5Cr%5Cn`;
  },

  fetch(word) {
    this.init(word);
    return this.download(this.requestURL);
  },

  download(url) {
    return new Promise((resolve, reject) => {
      let options = {
        url: url,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36'
        }
      };
      request(options, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          parseString(body, (err, result) => {
            if (!err)
              resolve(result);
            else
              reject(new Error('Failed to parse data from youdao.com'));
          });
        } else {
          reject(new Error('Failed to fetch data from youdao.com'));
        }
      });
    })
  },

  illustrate(wordMeaning) {
    let root_ele = document.createElement('div');
    root_ele.classList.add('youdao-result');

    //title
    let word_ele = document.createElement('div');
    word_ele.innerHTML = this.word;
    root_ele.appendChild(word_ele);

    //TODO: 
    console.warn(wordMeaning);
    return root_ele;
  }
};
