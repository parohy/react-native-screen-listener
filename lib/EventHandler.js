import EventEmitter from 'events';
import type { period, NavData } from './index';

type Listener = {
  when: period,
  screen: string,
  callback: (data: NavData) => void
};

class EventHandler extends EventEmitter {
  _externalListeners: Array<Listener>;

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
