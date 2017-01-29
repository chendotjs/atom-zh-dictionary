'use babel';

import AtomZhDictionaryView from './atom-zh-dictionary-view';
import { CompositeDisposable } from 'atom';

export default {

  atomZhDictionaryView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.atomZhDictionaryView = new AtomZhDictionaryView(state.atomZhDictionaryViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.atomZhDictionaryView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-zh-dictionary:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.atomZhDictionaryView.destroy();
  },

  serialize() {
    return {
      atomZhDictionaryViewState: this.atomZhDictionaryView.serialize()
    };
  },

  toggle() {
    console.log('AtomZhDictionary was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
