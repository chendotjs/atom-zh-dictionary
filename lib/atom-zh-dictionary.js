'use babel';

import url from 'url';
import {
  CompositeDisposable
} from 'atom';

import osx_manager from './OSX-Manager';

export default {

  subscriptions: null,
  dictResultRootElement: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command mean
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-zh-dictionary:mean': () => this.mean()
    }));

    this.subscriptions.add(atom.workspace.addOpener((uriToOpen) => {
      let urlObj = url.parse(uriToOpen, true);
      if (urlObj.protocol == 'atom-zh-dict:') {
        let dict = urlObj.query.dict;
        let wd = urlObj.query.wd;

        //create root HTMLElement for newly created result tab
        //it turns out that returning an HTMLElement with a getTitle() method is sufficient for creating a new tab
        let rootElement = document.createElement('div');
        rootElement.classList.add('zh-dict-result');
        rootElement.getTitle = () => `${wd}-${dict}`;

        this.dictResultRootElement = rootElement;
        return this.dictResultRootElement;
      }
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  mean() {
    //get selectedText
    let editor = atom.workspace.getActiveTextEditor();
    if (!editor) return;
    let selectedText = editor.getSelectedText() != '' ? editor.getSelectedText() : editor.getWordUnderCursor();

    //get which dictionary to be used
    let dictionary = atom.config.get('atom-zh-dictionary.defaultDictionary');
    let uri = `atom-zh-dict://search?wd=${selectedText}&dict=${dictionary}`;

    //handle os x dictionary.app explicitly
    if (dictionary == 'OS X') {
      osx_manager.run(selectedText)
      return;
    }

    //other web-based dictionary
    atom.workspace.open(uri, {
      split: 'down',
      activatePane: true,
      activateItem: true
    }).then((textEditor) => {
      //textEditor here is dictResultRootElement
      //sample for showing results returned by AJAX requests
      let e = document.createElement('div')
      e.innerHTML = `${selectedText} by ${dictionary}`
      this.dictResultRootElement.appendChild(e)
    }).catch((error) => {
      console.error(error);
      atom.notifications.addError(error.reason);
    })
  }
};
