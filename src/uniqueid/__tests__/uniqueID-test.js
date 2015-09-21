jest.dontMock('../uniqueID.js');

describe('uniqueId', () => {

  let uniqueId;

  beforeEach(() => {
    uniqueId = require('../uniqueID.js');
  });

  it('always returns a unique number', () => {
    const testCount = 100;
    let next;
    let uids = [];
    for (let i = 0; i < testCount; i++) {
      next = uniqueId();
      expect(uids.indexOf(next)).toBe(-1);
      uids.push(next);
    }
  });

});
