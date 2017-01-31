'use babel';

import request from 'request'

export default {
  word: null,
  requestURL: null,

  init(word) {
    this.word = word;
    this.requestURL = `https://rest.shanbay.com/api/v1/wechat/app/vocabulary/defn/?word=${word}`;
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
          'User-Agent': 'MicroMessenger/6.5.3.980 NetType/WIFI Language/zh_CN'
        }
      };
      request(options, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error('Failed to fetch data from shanbay.com'));
        }
      })
    })
  },


};
