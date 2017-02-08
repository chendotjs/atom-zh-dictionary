'use babel';

import youdao_manager from '../lib/youdao-Manager';


describe('youdao-Manager', () => {
  describe('when query "hello"', () => {
    let wordMeaning = null;
    let error = null;
    beforeEach(() => {
      waitsForPromise(() => {
        return youdao_manager.fetch('hello').then((data) => {
          wordMeaning = data.yodaodict;
        }).catch((err) => {
          error = err;
        });
      })
    });

    it('should be success', () => {
      expect(wordMeaning).toBeDefined();
    });

    it('should have custom-translation', () => {
      expect(wordMeaning['custom-translation']).not.toBeNull();
    });
    it('should have yodao-web-dict', () => {
      expect(wordMeaning['yodao-web-dict']).not.toBeNull();
    });
  });
});
