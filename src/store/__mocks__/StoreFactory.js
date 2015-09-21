import Store from '../Store';

let StoreFactoryMock = jest.genMockFromModule('../StoreFactory.js');
StoreFactoryMock.prototype.register.mockImpl(() => new Store());

module.exports = StoreFactoryMock;
