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

    wordMeaning = wordMeaning.yodaodict;

    let singleword_ele = document.createElement('div');
    singleword_ele.classList.add('single-word');
    //content
    let content_ele = document.createElement('div');
    content_ele.classList.add('content');
    content_ele.innerHTML = wordMeaning['return-phrase'][0];
    singleword_ele.appendChild(content_ele);

    //pronunciations
    if (wordMeaning['uk-phonetic-symbol'] && wordMeaning['us-phonetic-symbol']) {
      let pronunce_ele = document.createElement('div');
      let pronunce_ul_ele = document.createElement('ul');
      let pronunce_ul_us_ele = document.createElement('li');
      let pronunce_ul_uk_ele = document.createElement('li');
      pronunce_ul_us_ele.innerHTML = `美[${wordMeaning['us-phonetic-symbol'][0]}]`;
      pronunce_ul_uk_ele.innerHTML = `英[${wordMeaning['uk-phonetic-symbol'][0]}]`;
      pronunce_ul_ele.appendChild(pronunce_ul_us_ele);
      pronunce_ul_ele.appendChild(pronunce_ul_uk_ele);
      pronunce_ele.appendChild(pronunce_ul_ele);
      singleword_ele.appendChild(pronunce_ele);
    }

    //custom-translation
    if (wordMeaning['custom-translation']) {
      let custom_translation_ele = document.createElement('div');
      let title_ele = document.createElement('div');
      title_ele.innerHTML = '基本翻译';
      custom_translation_ele.appendChild(title_ele);

      let translation = wordMeaning['custom-translation'][0].translation;
      let translation_ul_ele = document.createElement('ul');

      for (let i = 0; i < translation.length; i++) {
        let definition_text_ele = document.createElement('li');
        definition_text_ele.innerHTML = `<span>${translation[i].content[0]}</span>`;
        translation_ul_ele.appendChild(definition_text_ele);
      }
      custom_translation_ele.appendChild(translation_ul_ele);
      singleword_ele.appendChild(custom_translation_ele);
    }

    //yodao-web-dict
    if (wordMeaning['yodao-web-dict']) {
      let yodao_web_dict_ele = document.createElement('div');
      let title_ele = document.createElement('div');
      title_ele.innerHTML = '网络释义';
      yodao_web_dict_ele.appendChild(title_ele);

      let translation = wordMeaning['yodao-web-dict'][0]['web-translation'];
      let translation_ul_ele = document.createElement('ul');

      for (let i = 0; i < translation.length; i++) {
        let definition_text_ele = document.createElement('li');
        definition_text_ele.innerHTML = `<span>${translation[i].trans[0].value[0]}</span>`;
        translation_ul_ele.appendChild(definition_text_ele);
      }
      yodao_web_dict_ele.appendChild(translation_ul_ele);
      singleword_ele.appendChild(yodao_web_dict_ele);
    }

    root_ele.appendChild(singleword_ele);
    return root_ele;
  }
};
