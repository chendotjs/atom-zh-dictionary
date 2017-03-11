'use babel';

import url from 'url';
import {
  CompositeDisposable,
  Disposable
} from 'atom';

import osx_manager from './OSX-Manager';
import shanbay_manager from './shanbay-Manager'
import youdao_manager from './youdao-Manager'

const managerMap = {
  'Shanbay': shanbay_manager,
  'Youdao': youdao_manager
}

export default {

  subscriptions: null,
  dictResultRootElement: null,
  dictManager: null,
  dictPane: null,

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

    let handleBlur = (event) => {
      if (event.target == window) return;
      let dictItems = event.target.getElementsByClassName("zh-dict-result");
      if (dictItems.length > 0) {
        for (let i = 0; i < dictItems.length; i++) {
          //filter event.target
          if (event.target.contains(dictItems[i])) {
            //`event.target.getModel()` here is just `this.dictPane`
            //I prefer to use `event.target.getModel()` here
            event.target.getModel().destroyItem(dictItems[i]);
          }
        }
      }
    }

    let handleKeyup = (event) => {
        // press esc key
        if (event.keyCode === 27 || event.which === 27) {
            atom.workspace.getActivePane().destroyItems();
        }
    }

    window.addEventListener('keyup', handleKeyup, true);

    if (atom.config.get('atom-zh-dictionary.closeWhenLoseFocus')) {
      window.addEventListener('blur', handleBlur, true);
    }
    atom.config.onDidChange('atom-zh-dictionary.closeWhenLoseFocus', (changed) => {
      if (changed.newValue) {
        window.addEventListener('blur', handleBlur, true);
      } else {
        window.removeEventListener('blur', handleBlur, true);
      }
    });
    this.subscriptions.add(new Disposable(() => window.removeEventListener('blur', handleBlur, true)));
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
    }).catch((error) => {
      console.error(error);
      atom.notifications.addError(error);
    }).then((textEditor) => {
      //get the default dict manager
      this.dictManager = managerMap[dictionary];
      this.dictPane = atom.workspace.getActivePane();
      return this.dictManager.fetch(selectedText);
    }).then((wordMeaning) => {
      let element = this.dictManager.illustrate(wordMeaning);
      this.dictResultRootElement.appendChild(element);
    }).catch((error) => {
      console.error(error);
      atom.notifications.addWarning(error.message);
    });
  }
};
