import EventEmitter from 'events';
import type { NavData } from './index';

export type period = AFTER | BEFORE;

export type Listener = {
  when: period,
  screen: string,
  callback: (data: NavData) => void,
  listenerFunc: Function
};

export type MapListeners = {
  [string]: Listener
};

export const AFTER = 'after';
export const BEFORE = 'before';

export default class EventHandler extends EventEmitter {
  _externalListeners: MapListeners = {};

  registerEvent = (when: period, screen: string, callback: (data: NavData) => void): string => {
    const listenerFunc = data => {
      if (data.screen === screen) {
        callback(data);
      }
    };

    this.on(when, listenerFunc);

    const identifier = `${Object.keys(this._externalListeners).length - 1}-${when}`;

    this._externalListeners[identifier] = { when, screen, callback, listenerFunc };

    return identifier;
  };

  removeExternalListener = (identifier: string) => {
    const toRem = _this._externalListeners[identifier];
    if (!toRem) {
      throw new Error(`No listener found under identifier: ${identidier}`);
    }

    this.removeListener(toRem.when, toRem.listenerFunc);
    delete this._externalListeners[identifier];
  };

  removeExternalListeners = () => {
    this._externalListeners = [];
    this.removeAllListeners();
  };
}
