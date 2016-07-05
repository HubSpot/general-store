import Store from '../Store';

const StoreFactoryMock = jest.genMockFromModule('../StoreFactory.js');
StoreFactoryMock.prototype.register.mockImpl(() => new Store());

module.exports = StoreFactoryMock;
