'use babel';

import cp from 'child_process';
const spawn = cp.spawn;

export default {
  run(word) {
    if (this.whetherOSX())
      spawn('open', [`dict://${word}`]);
    else {
      atom.notifications.addWarning('You are not using OS X !!!', {
        buttons: [{
          text: 'Switch to another dictionary',
          onDidClick: () => {
            atom.commands.dispatch(atom.views.getView(atom.workspace), 'settings-view:view-installed-packages');
          }
        }]
      })
    }
  },

  whetherOSX() {
    return process.platform == 'darwin';
  }
};
