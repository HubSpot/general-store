jest.dontMock('../uniqueID.js');

describe('uniqueId', () => {

  var uniqueId;

  beforeEach(() => {
    uniqueId = require('../uniqueID.js');
  });

  it('always returns a unique number', () => {
    var testCount = 100;
    var next;
    var uids = [];
    for (var i = 0; i < testCount; i++) {
      next = uniqueId();
      expect(uids.indexOf(next)).toBe(-1);
      uids.push(next);
    }
  });

});
