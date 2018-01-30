import * as firebase from "firebase";

const config = {
    apiKey: "AIzaSyCjhEnquAoo0QhRlZ0RGXrrC0qgLCVIj5g",
    authDomain: "intelmark-9519d.firebaseapp.com",
    databaseURL: "https://intelmark-9519d.firebaseio.com",
    projectId: "intelmark-9519d",
    storageBucket: "intelmark-9519d.appspot.com",
    messagingSenderId: "423067770690"
  };

firebase.initializeApp(config);
export default firebase;
