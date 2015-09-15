import StoreFacade from '../StoreFacade';

var StoreFactoryMock = jest.genMockFromModule('../StoreFactory.js');
StoreFactoryMock.prototype.register.mockImpl(() => new StoreFacade());

module.exports = StoreFactoryMock;
