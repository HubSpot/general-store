/* @flow */

var EventManager = require('../core/events/EventManager.js');
var StoreFacade = require('../store/StoreFacade.js');

var StoreListenerMixin = {

  componentWillMount(): void {
    if (process.env.NODE_ENV !== 'production') {
      if (typeof this.getStoreState !== 'function') {
        throw new Error(
          'StoreListenerMixin: expected this.getStoreState to be a function.'
        )
      }
    }
    this.handleStoreChange = this.handleStoreChange.bind(this);
    this.stores.forEach(
      store => store.addOnChange(this.handleStoreChange)
    );
    this.handleStoreChange();
  },

  componentWillUnmount(): void {
    this.stores.forEach(
      store => store.removeOnChange(this._handleStoreChange)
    );
  },

  handleStoreChange(): void {
    this.setState(
      this.getStoreState()
    );
  }

  /**
   * // an array of StoreFacades
   * stores: [
   *   ExampleStore
   * ],
   */

  /**
   * // the return value of getStoreState will be merged
   * // into the component state
   * getStoreState(): Object {
   *   return {
   *     exampleData: ExampleStore.get()
   *   };
   * }
   */

};

module.exports = StoreListenerMixin;
