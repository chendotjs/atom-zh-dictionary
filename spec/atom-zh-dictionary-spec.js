'use babel';

import AtomZhDictionary from '../lib/atom-zh-dictionary';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('AtomZhDictionary', () => {
  let workspaceElement, activationPromise, editor;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('atom-zh-dictionary');
  });

  describe('when the atom-zh-dictionary:mean event is triggered', () => {
    beforeEach(() => {
      waitsForPromise(() => {
        return atom.workspace.open().then((e) => {
          editor = e;
        });
      });
    });
    it('shows the newly created tab', () => {
      editor.setText('hello');
      editor.setCursorBufferPosition([0, 0]);
      editor.selectToEndOfLine();

      // Before the activation event the view is not on the DOM, and no panel
      // has been created
      expect(workspaceElement.querySelector('.zh-dict-result')).not.toExist();

      // This is an activation event, triggering it will cause the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'atom-zh-dictionary:mean');

      waitsForPromise(() => {
        return activationPromise;
      });

      runs(() => {
        let atomZhDictionaryElement = workspaceElement.querySelector('.zh-dict-result');
        expect(atomZhDictionaryElement).toExist();
        expect(AtomZhDictionary.dictPane).toBeDefined();
      });
    });
  });
});
