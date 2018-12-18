import EventEmitter from 'events';
import type { NavData } from './index';

export type period = AFTER | BEFORE;

export type Listener = {
  when: period,
  screen: string,
  callback: (data: NavData) => void
};

export type ListenerFunc = {
  when: period,
  func: Function
};

export const AFTER = 'after';
export const BEFORE = 'before';

export default class EventHandler extends EventEmitter {
  _externalListeners: Array<Listener> = [];

  registerEvent = (
    when: period,
    screen: string,
    callback: (data: NavData) => void
  ): ListenerFunc => {
    this._externalListeners.push({ when, screen, callback });

    const listenerFunc = data => {
      if (data.screen === screen) {
        callback(data);
      }
    };

    this.on(when, listenerFunc);

    return {
      when,
      func: data => {
        if (data.screen === screen) {
          callback(data);
        }
      }
    };
  };

  removeExternalListener = (listenerFunc: ListenerFunc) => {
    this.removeListener(listenerFunc.when, listenerFunc.func);
  };

  removeExternalListeners = () => {
    this._externalListeners = [];
    this.removeAllListeners();
  };
}
