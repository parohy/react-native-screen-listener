
# react-native-react-native-screen-listener

## Getting started

`$ npm install react-native-react-native-screen-listener --save`

### Mostly automatic installation

`$ react-native link react-native-react-native-screen-listener`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-react-native-screen-listener` and add `RNReactNativeScreenListener.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNReactNativeScreenListener.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNReactNativeScreenListenerPackage;` to the imports at the top of the file
  - Add `new RNReactNativeScreenListenerPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-react-native-screen-listener'
  	project(':react-native-react-native-screen-listener').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-react-native-screen-listener/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-react-native-screen-listener')
  	```


## Usage
```javascript
import RNReactNativeScreenListener from 'react-native-react-native-screen-listener';

// TODO: What to do with the module?
RNReactNativeScreenListener;
```
  