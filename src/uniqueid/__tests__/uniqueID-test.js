jest.unmock('../uniqueID.js');

describe('uniqueId', () => {
  let uniqueId;

  beforeEach(() => {
    uniqueId = require('../uniqueID.js').default;
  });

  it('always returns a unique number', () => {
    const testCount = 100;
    let next;
    const uids = [];
    for (let i = 0; i < testCount; i++) {
      next = uniqueId();
      expect(uids.indexOf(next)).toBe(-1);
      uids.push(next);
    }
  });
});
