import { NativeAppEventEmitter, DeviceEventEmitter, Platform } from 'react-native';

type period = 'after' | 'before';

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
  _registered: boolean;

  constructor(receivers?: Receivers) {
    this._emitter = Platform.OS === 'android' ? DeviceEventEmitter : NativeAppEventEmitter;

    this._status = {
      before: { previous: null, current: null },
      after: { previous: null, current: null }
    };

    this._registered = false;

    if (receivers) {
      this.afterCallback = receivers.afterCallback;
      this.beforeCallback = receivers.beforeCallback;
    }
  }

  _willAppear = (data: NavData): void => {
    this._status.before.current = data;
  };

  _willDisappear = (data: NavData): void => {
    this._status.before.previous = data;
    this._fireBeforeCallback();
  };

  _didAppear = (data: NavData): void => {
    this._status.after.current = data;
  };

  _didDisappear = (data: NavData): void => {
    this._status.after.previous = data;
    this._fireAfterCallback();
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
      case 'before':
        return this._status.before;
      case 'after':
        return this._status.after;
      default:
        return this._status;
    }
  };

  register(): void {
    this.willAppearSubscription = this._emitter.addListener('willAppear', this._willAppear);
    this.didAppearSubscription = this._emitter.addListener('didAppear', this._didAppear);
    this.willDisappearSubscription = this._emitter.addListener(
      'willDisappear',
      this._willDisappear
    );
    this.didDisappearSubscription = this._emitter.addListener('didDisappear', this._didDisappear);
    this._registered = true;
  }

  unregister(): void {
    if (this._registered) {
      this.willAppearSubscription.remove();
      this.didAppearSubscription.remove();
      this.willDisappearSubscription.remove();
      this.didDisappearSubscription.remove();
      this._registered = false;
    } else {
      throw new Error('First you have to call register!');
    }
  }
}
