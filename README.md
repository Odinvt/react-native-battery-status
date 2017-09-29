# React Native BatteryStatus
A cordova battery status listener for react-native, support for ios and android. Fork of react-native-battery-status by remobile. Added an update method to force battery stats fetch whenever the user wants.

## Installation
```sh
npm install react-native-battery-stats --save
```
### Installation (iOS)
* Drag RCTBatteryStatus.xcodeproj to your project on Xcode.
* Click on your main project file (the one that represents the .xcodeproj) select Build Phases and drag libRCTBatteryStatus.a from the Products folder inside the RCTBatteryStatus.xcodeproj.
* Look for Header Search Paths and make sure it contains both $(SRCROOT)/../../../react-native/React as recursive.

### Installation (Android)
```gradle
...
include ':react-native-battery-stats'
project(':react-native-battery-stats').projectDir = new File(settingsDir, '../node_modules/react-native-battery-stats/android')
```

* In `android/app/build.gradle`

```gradle
...
dependencies {
    ...
    compile project(':react-native-battery-stats')
}
```

* register module (in MainApplication.java)

```java
......
import com.remobile.batteryStatus.RCTBatteryStatusPackage;  // <--- import

......

@Override
protected List<ReactPackage> getPackages() {
   ......
   new RCTBatteryStatusPackage(),            // <------ add here
   ......
}

```

## Usage

### Example
```js
var React = require('react');
var ReactNative = require('react-native');
var {
    StyleSheet,
    View,
    Image
} = ReactNative;

var BatteryStatus = require('react-native-battery-stats');
var Button = require('react-native-simple-button');

module.exports = React.createClass({
    getInitialState () {
        return {
            status: '',
        };
    },
    onBatteryStatus(info) {
        this.setState({status: JSON.stringify({onBatteryStatus: info})});
    },
    onBatteryLow(info) {
        this.setState({status: JSON.stringify({onBatteryLow: info})});
    },
    onBatteryCritical(info) {
        this.setState({status: JSON.stringify({onBatteryCritical: info})});
    },
    register() {
        BatteryStatus.register({
            onBatteryStatus: this.onBatteryStatus,
            onBatteryLow: this.onBatteryLow,
            onBatteryCritical: this.onBatteryCritical,
        }, () => {
            BatteryStatus.update(); // You can call the update method whenever u want. we're calling it here on the success callback of register to force a first fetch of battery status
        }, () => {
            // error callback
        });
    },
    unregister() {
        BatteryStatus.unregister();
    },
    render() {
        return (
            <View style={styles.container}>
                <Button onPress={this.register}>
                    register
                </Button>
                <Button onPress={this.unregister}>
                    unregister
                </Button>
                <Text>
                    {this.state.status}
                </Text>
            </View>
        );
    },
});


var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
});
```

### HELP
* look https://github.com/apache/cordova-plugin-battery-status


### thanks
* this project come from https://github.com/apache/cordova-plugin-battery-status

### see detail use
* https://github.com/remobile/react-native-template
