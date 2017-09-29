/**
 * This class contains information about the current battery status.
 * @constructor
 */
import {
  DeviceEventEmitter,
  NativeModules
} from 'react-native'

let { BatteryStatus } = NativeModules;

let exec = require('@remobile/react-native-cordova').exec;

let STATUS_CRITICAL = 5;
let STATUS_LOW = 20;
let subscription = null;

exports.register = function(options, success = null, error = null) {
  let _level = null;
  let _isPlugged = null;
  const {onBatteryStatus, onBatteryLow, onBatteryCritical} = options;
  if (onBatteryStatus||onBatteryLow||onBatteryCritical) {
    subscription = DeviceEventEmitter.addListener('BATTERY_STATUS_EVENT', (info)=>{
      if (info) {
        if (_level !== info.level || _isPlugged !== info.isPlugged) {

          if(info.level === null && _level !== null) {
            return; // special case where callback is called because we stopped listening to the native side.
          }

          // Something changed. Fire batterystatus event
          onBatteryStatus && onBatteryStatus(info);

          if (!info.isPlugged) { // do not fire low/critical if we are charging. issue: CB-4520
            // note the following are NOT exact checks, as we want to catch a transition from
            // above the threshold to below. issue: CB-4519
            if (_level > STATUS_CRITICAL && info.level <= STATUS_CRITICAL) {
              // Fire critical battery event
              onBatteryCritical && onBatteryCritical(info);
            }
            else if (_level > STATUS_LOW && info.level <= STATUS_LOW) {
              // Fire low battery event
              onBatteryCritical && onBatteryCritical(info);
            }
          }
          _level = info.level;
          _isPlugged = info.isPlugged;
        }
      }
    });

    BatteryStatus.addListener('BATTERY_STATUS_EVENT');
  }
  exec(success, error, "BatteryStatus", "start", []);
};

exports.unregister = function(opt) {
  subscription && subscription.remove();
  exec(null, null, "BatteryStatus", "stop", []);
};

exports.update = function(success = null, error = null) {
  exec(success, error, "BatteryStatus", "update", []);
};
