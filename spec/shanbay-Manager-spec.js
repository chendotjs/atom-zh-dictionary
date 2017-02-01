'use babel';

import shanbay_manager from '../lib/shanbay-Manager';


describe('shanbay-Manager', () => {
  describe('when query "hello"', () => {
    let wordMeaning = null;
    let error = null;
    beforeEach(() => {
      waitsForPromise(() => {
        return shanbay_manager.fetch('hello').then((data) => {
          wordMeaning = data;
        }).catch((err) => {
          error = err;
        });
      })
    });

    it('should be success', () => {
      expect(wordMeaning.msg).toEqual('SUCCESS');
      expect(wordMeaning.status_code).toEqual(0);
    });

    it('should have defns', () => {
      expect(wordMeaning.data.defns).not.toBeNull();
      expect(wordMeaning.data.defns).toBeDefined();
    });
  });

  describe('when query "你好"', () => {
    let wordMeaning = null;
    let error = null;
    beforeEach(() => {
      waitsForPromise(() => {
        return shanbay_manager.fetch('你好').then((data) => {
          wordMeaning = data;
        }).catch((err) => {
          error = err;
        });
      });
    });

    it('should be success', () => {
      expect(wordMeaning.msg).toEqual('SUCCESS');
      expect(wordMeaning.status_code).toEqual(0);
    });

    it('should have defns', () => {
      expect(wordMeaning.data.defns).not.toBeNull();
      expect(wordMeaning.data.defns).toBeDefined();
      expect(wordMeaning.data.defns.length).toBeGreaterThan(1);
    });
  });

  describe('when query non-exist words', () => {
    let wordMeaning = null;
    let error = null;
    beforeEach(() => {
      waitsForPromise(() => {
        return shanbay_manager.fetch('jafladffehw').then((data) => {
          wordMeaning = data;
        }).catch((err) => {
          error = err;
        });
      });
    });

    it('should be success', () => {
      expect(wordMeaning.msg).toEqual('SUCCESS');
      expect(wordMeaning.status_code).toEqual(0);
    });

    it('should not have defns', () => {
      expect(wordMeaning.data.defns).toBeNull();
    });
  });

});
