import EventEmitter from 'events';
import type { NavData } from './index';

export type period = AFTER | BEFORE;

export type Listener = {
  when: period,
  screen: string,
  callback: (data: NavData) => void
};

export const AFTER = 'after';
export const BEFORE = 'before';

export default class EventHandler extends EventEmitter {
  _externalListeners: Array<Listener> = [];

  registerEvent = (when: period, screen: string, callback: (data: NavData) => void) => {
    this._externalListeners.push({ when, screen, callback });

    this.on(when, data => {
      if (data.screen === screen) {
        callback(data);
      }
    });
  };

  unregisterListeners = () => this.removeAllListeners();
}
