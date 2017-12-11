## OSSA

### Steps to run the app

Clone the repository, then

```
  $ npm install
  $ react-native link
  $ react-native run-android/run-ios
```

#### Option: If app is not run successfully
```
  $ watchman watch-del-all
  $ rm -rf node_modules && npm install
  $ npm start -- --reset-cache
  $ react-native run-android/run-ios
```

### Tutorial for react-native app development

* [Docs](https://facebook.github.io/react-native/docs/getting-started.html) - React-native Documentation
* [Currency Converter App](https://learn.handlebarlabs.com/p/react-native-basics-build-a-currency-converter) - Developed App from scratch
