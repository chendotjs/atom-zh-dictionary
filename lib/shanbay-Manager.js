'use babel';

import request from 'request';
import querystring from 'querystring';

export default {
  word: null,
  requestURL: null,

  init(word) {
    this.word = word;
    this.requestURL = `https://rest.shanbay.com/api/v1/wechat/app/vocabulary/defn/?word=${querystring.escape(word)}`;

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

  illustrate(wordMeaning) {
    let root_ele = document.createElement('div');
    root_ele.classList.add('shanbay-result');

    //title
    let word_ele = document.createElement('div');
    word_ele.innerHTML = this.word;
    root_ele.appendChild(word_ele);

    let defns = wordMeaning.data.defns;
    if (wordMeaning.msg == 'SUCCESS' && wordMeaning.status_code == 0 && wordMeaning.data.defns != null) {
      defns.forEach((defn) => {
        let singleword_ele = document.createElement('div');
        singleword_ele.classList.add('single-word');

        //content
        let content_ele = document.createElement('div');
        content_ele.classList.add('content');
        content_ele.innerHTML = defn.content;
        singleword_ele.appendChild(content_ele);

        //pronunciations
        let pronunce_ele = document.createElement('div');
        let pronunce_ul_ele = document.createElement('ul');
        let pronunce_ul_us_ele = document.createElement('li');
        let pronunce_ul_uk_ele = document.createElement('li');
        pronunce_ul_us_ele.innerHTML = `美\/${defn.pronunciations.us}\/`;
        pronunce_ul_uk_ele.innerHTML = `英\/${defn.pronunciations.uk}\/`;
        pronunce_ul_ele.appendChild(pronunce_ul_us_ele);
        pronunce_ul_ele.appendChild(pronunce_ul_uk_ele);
        pronunce_ele.appendChild(pronunce_ul_ele);
        singleword_ele.appendChild(pronunce_ele);

        //definitions cn only
        let definitions_cn = defn.definitions.cn;
        let definition_cn_ele = document.createElement('div');
        let definition_cn_ul_ele = document.createElement('ul');
        definitions_cn.forEach((definition) => {
          let definition_text_ele = document.createElement('li');
          definition_text_ele.innerHTML = `<span class="definition-pos">${definition.pos}</span><span>${definition.defn}</span>`;
          definition_cn_ul_ele.appendChild(definition_text_ele);
        });
        definition_cn_ele.appendChild(definition_cn_ul_ele);
        singleword_ele.appendChild(definition_cn_ele);

        root_ele.appendChild(singleword_ele);
      })
    }

    return root_ele;
  }
};
