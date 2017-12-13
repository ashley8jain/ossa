import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage, Alert, TextInput, Button } from 'react-native'
import InstagramLogin from 'react-native-instagram-login';
import * as firebase from "firebase";
import {LoginButton,LoginManager,AccessToken, GraphRequestManager, GraphRequest} from 'react-native-fbsdk'


import TabNav from './tabNav'


const config = {
    apiKey: "AIzaSyCjhEnquAoo0QhRlZ0RGXrrC0qgLCVIj5g",
    authDomain: "intelmark-9519d.firebaseapp.com",
    databaseURL: "https://intelmark-9519d.firebaseio.com",
    projectId: "intelmark-9519d",
    storageBucket: "intelmark-9519d.appspot.com",
    messagingSenderId: "423067770690"
  };
firebase.initializeApp(config);


class MyApp extends Component{

  constructor(props){
    super(props);
    this.state = {
      token: null
    };
    this.signup = this.signup.bind(this);
    this.login = this.login.bind(this);
    this.setUserMobile = this.setUserMobile.bind(this);
  }

  componentDidMount() {
    AsyncStorage.getItem('token').then((value) => {
      this.setState({token: value});
    }).done();
    AsyncStorage.getItem('uid').then((value) => {
      this.setState({uid: value});
    }).done();
    AsyncStorage.getItem('email').then((value) => {
      this.setState({email: value});
    }).done();

    // firebase.auth().createUserWithEmailAndPassword("email@gmail.com", "passsssss");
    // firebase.database().ref('users/ashley8jain').set({
    //   username: 'ashley8jain'
    // });

  }

//ref :- https://developers.facebook.com/docs/react-native/login



  loginSucced(token){
    this.setState({ token });
    AsyncStorage.setItem("token", token);
  }

  async signup() {
    // DismissKeyboard();
    try
    {
      await firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password);
      this.login();
      //go to home page

    }
    catch(error)
    {
      alert(error.toString());
    }

  }

  async login() {
    // DismissKeyboard();
    try
    {
      await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password);
      alert("Logged In!");
      let user = await firebase.auth().currentUser;
      this.setState(
        {uid:user.uid}
      );
      AsyncStorage.setItem("uid", user.uid);
      AsyncStorage.setItem("email", this.state.email);
    }
    catch(error)
    {
      alert(error.toString());
    }
  }

  setUserMobile(userId, mobile){
    if(this.state.uid!=null){
      let userMobilePath = "/user/" + this.state.uid + "/details";
      firebase.database().ref(userMobilePath).set({mobile: this.state.mobile})
      alert("Done!");
    }
    else{
      alert("login first");
    }
  }


  render(){
    // if(this.state.token!=null){
    //   return (
    //     // Alert.alert(this.state.token),
    //     <TabNav token={this.state.token}/>
    //   )
    // }
    // else{
      return(
        <View style={styles.container}>
          <TextInput style = {styles.input}
            onChangeText={(email) => this.setState({email})}
            value={this.state.email}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="email"
          />
          <TextInput style = {styles.input}
            onChangeText={(password) => this.setState({password})}
            value={this.state.password}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            secureTextEntry={true}
            placeholder="password"
          />
          <Button onPress={this.signup} textStyle={{fontSize: 18}} title = "Sign up" >
          </Button>
          <Button onPress={this.login} textStyle={{fontSize: 18}} title = "Login" >
          </Button>
          <TouchableOpacity onPress={()=> this.refs.instagramLogin.show()}>
            <Text style={{color: 'blue'}}>Login with Instagram</Text>
          </TouchableOpacity>
          <InstagramLogin
              ref='instagramLogin'
              clientId='e9cd736246f04098903acf6d3c3e8809'
              scopes={['public_content', 'follower_list']}
              onLoginSuccess={(token) => this.loginSucced(token)}
              redirectUrl='http://localhost:8515/oauth_callback'
          />
          <LoginButton
            readPermissions={["public_profile","email","user_friends"]}
            onLoginFinished={
              (error, result) => {
                if (error) {
                  alert("login has error: " + result.error);
                } else if (result.isCancelled) {
                  alert("login is cancelled.");
                } else {
                  // permission object - https://developers.facebook.com/docs/facebook-login/permissions#reference-public_profile
                  AccessToken.getCurrentAccessToken().then(
                    (data) => {
                      let accessToken = data.accessToken;
                      fetch('https://graph.facebook.com/v2.5/me?fields=email,gender,id,name&access_token=' + accessToken)
                      .then((response) => response.json())
                      .then((json) => {
                        // Some user object has been set up somewhere, build that user here
                        alert(json.email);
                        this.setState({email:json.email});
                      })
                      .catch(() => {
                        reject('ERROR GETTING DATA FROM FACEBOOK')
                      })
                    })
                }
              }
            }
            onLogoutFinished={() => alert("logout.")}
          />
          <TextInput style = {styles.input}
            onChangeText={(mobile) => this.setState({mobile})}
            value={this.state.mobile}
            underlineColorAndroid="transparent"
            keyboardType="phone-pad"
            placeholder="mobile"
          />
          <Button onPress={this.setUserMobile} textStyle={{fontSize: 18}} title = "Save" >
          </Button>
        </View>
      )
    // }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  red: {
    color: 'red',
  },
  input: {
      margin: 15,
      height: 40,
      width: 300,
      borderWidth: 1,
  },
});

export default MyApp;
