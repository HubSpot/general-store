import Store from '../Store';

const StoreFactoryMock = jest.genMockFromModule('../StoreFactory.js').default;
StoreFactoryMock.prototype.register.mockImpl(() => new Store());

module.exports = StoreFactoryMock;
