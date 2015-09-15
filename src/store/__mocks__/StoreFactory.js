import Store from '../Store';

var StoreFactoryMock = jest.genMockFromModule('../StoreFactory.js');
StoreFactoryMock.prototype.register.mockImpl(() => new Store());

module.exports = StoreFactoryMock;
