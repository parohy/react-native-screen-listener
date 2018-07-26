import { NativeAppEventEmitter, DeviceEventEmitter, Platform } from 'react-native';
import EventHandler from './EventHandler';

export const AFTER = 'after';
export const BEFORE = 'before';

type period = AFTER | BEFORE;

type unit = { previous: ?NavData, current: ?NavData };

type status = {
  before: unit,
  after: unit
};

type NavData = {
  commandType: string,
  endTime: string,
  screen: string,
  startTime: number
};

type Receivers = {
  beforeCallback?: (data: NavData) => void,
  afterCallback?: (data: NavData) => void
};

export default class ScreenVisibilityListener {
  _status: status;

  constructor(receivers?: Receivers) {
    this._emitter = Platform.OS === 'android' ? DeviceEventEmitter : NativeAppEventEmitter;

    this._status = {
      before: { previous: null, current: null },
      after: { previous: null, current: null }
    };

    this._eventHandler = new EventHandler();

    if (receivers) {
      this.afterCallback = receivers.afterCallback;
      this.beforeCallback = receivers.beforeCallback;
    }
  }

  _willAppear = (data: NavData): void => {
    this._status.before.current = data;
    this._fireBeforeCallback();
    this._eventHandler.emit(BEFORE, data);
  };

  _willDisappear = (data: NavData): void => {
    this._status.before.previous = data;
    this._eventHandler.emit(BEFORE, data);
  };

  _didAppear = (data: NavData): void => {
    this._status.after.current = data;
    this._fireAfterCallback();
    this._eventHandler.emit(AFTER, data);
  };

  _didDisappear = (data: NavData): void => {
    this._status.after.previous = data;
    this._eventHandler.emit(AFTER, data);
  };

  _fireBeforeCallback = (): void => {
    if (this.beforeCallback) {
      this.beforeCallback(this._status.before);
    }
  };

  _fireAfterCallback = (): void => {
    if (this.afterCallback) {
      this.afterCallback(this._status.after);
    }
  };

  getStatus = (statusPeriod?: period): unit | status => {
    switch (statusPeriod) {
      case BEFORE:
        return this._status.before;
      case AFTER:
        return this._status.after;
      default:
        return this._status;
    }
  };

  registerEventCallback = (
    when: period,
    screen: string,
    callback: (data: NavData) => void
  ): void => {
    this._eventHandler.registerEvent(when, screen, callback);
  };

  register(): void {
    this.willAppearSubscription = this._emitter.addListener('willAppear', this._willAppear);
    this.didAppearSubscription = this._emitter.addListener('didAppear', this._didAppear);
    this.willDisappearSubscription = this._emitter.addListener(
      'willDisappear',
      this._willDisappear
    );
    this.didDisappearSubscription = this._emitter.addListener('didDisappear', this._didDisappear);
  }

  unregister(): void {
    if (this.willAppearSubscription) {
      this.willAppearSubscription.remove();
    }
    if (this.didAppearSubscription) {
      this.didAppearSubscription.remove();
    }
    if (this.willDisappearSubscription) {
      this.willDisappearSubscription.remove();
    }
    if (this.didDisappearSubscription) {
      this.didDisappearSubscription.remove();
    }

    this._eventHandler.unregisterListeners();
  }
}
