import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage, Alert, TextInput, Button, Keyboard } from 'react-native'
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
    this.listenUserMobile = this.listenUserMobile.bind(this);
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
    Keyboard.dismiss();
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

  // async logout() {
  //   try {
  //       await firebase.auth().signOut();
  //       // Navigate to login view
  //
  //   } catch (error) {
  //       console.log(error);
  //   }
  // }

  setUserMobile(){
    Keyboard.dismiss();
    if(this.state.uid!=null){
      let userMobilePath = "/user/" + this.state.uid + "/details";
      //ref: https://firebase.google.com/docs/database/web/read-and-write?authuser=0
      firebase.database().ref(userMobilePath).set({mobile: this.state.mobile})
      alert("Done!");
    }
    else{
      alert("login first");
    }
  }

  listenUserMobile() {
    let userMobilePath = "/user/" + this.state.uid + "/details";
    firebase.database().ref(userMobilePath).on('value', (snapshot) => {
      var mobile = "";
      if (snapshot.val()) {
        mobile = snapshot.val().mobile
      }
      this.setState({mobile:mobile});
    });
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
            readPermissions={["public_profile","email","pages_show_list","instagram_basic","instagram_manage_insights"]}
            onLoginFinished={
              (error, result) => {
                if (error) {
                  alert("login has error: " + result.error);
                } else if (result.isCancelled) {
                  alert("login is cancelled.");
                } else {
                  console.log("Result: "+JSON.stringify(result));
                  // permission object - https://developers.facebook.com/docs/facebook-login/permissions#reference-public_profile
                  AccessToken.getCurrentAccessToken().then(
                    (data) => {
                      console.log("Data: "+JSON.stringify(data));
                      let accessToken = data.accessToken;
                      console.log("fb token: "+accessToken);
                      // Build Firebase credential with the Facebook access token.
                      var credential = firebase.auth.FacebookAuthProvider.credential(accessToken);
                      // alert(credential.toString());
                      // Sign in with credential from the Google user.
                      firebase.auth().signInWithCredential(credential).catch(function(error) {
                        // Handle Errors here.
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        alert(errorMessage);
                        // The email of the user's account used.
                        var email = error.email;
                        // The firebase.auth.AuthCredential type that was used.
                        var credential = error.credential;
                        // ...
                      });

                      let user = firebase.auth().currentUser;
                      this.setState(
                        {uid:user.uid}
                      );
                      console.log("firebase user id: "+user.uid);
                      AsyncStorage.setItem("uid", user.uid);

                      // console.log("here1");
                      //FB Graph API :- https://stackoverflow.com/questions/37383888/how-to-use-graph-api-with-react-native-fbsdk
                      const responseFunc = (error, result) => {
                        if (error) {
                          console.log(error)
                          alert('Error fetching data: ' + error.toString());
                        } else {
                          console.log(result)
                          this.setState({email:result.email});
                          // alert(json.email);
                          AsyncStorage.setItem("email", result.email);
                          // console.log("here2");

                          // alert('Success fetching data: ' + JSON.stringify(result));
                        }
                      }
                      const infoRequest = new GraphRequest(
                        '/me',
                        {
                          parameters: {
                            fields: {
                              string: 'email,gender,name'
                            }
                          }
                        },
                        responseFunc
                      );
                      // Start the graph request.
                      new GraphRequestManager().addRequest(infoRequest).start();

                      // console.log("here3");

                      const responseFunc2 = (error, result) => {
                        if (error) {
                          console.log(error)
                          alert('Error fetching data: ' + error.toString());
                        } else {
                          console.log(result);
                          // console.log("here4");


                          const responseFunc = (error, result) => {
                            if (error) {
                              console.log(error)
                              alert('Error fetching data: ' + error.toString());
                            } else {
                              console.log(result);

                              const responseFunc = (error, result) => {
                                if (error) {
                                  console.log(error)
                                  alert('Error fetching data: ' + error.toString());
                                } else {
                                  console.log(result);

                                  const responseFunc = (error, result) => {
                                    if (error) {
                                      console.log(error)
                                      alert('Error fetching data: ' + error.toString());
                                    } else {
                                      console.log(result);
                                      // media and insight datas
                                    }
                                  }

                                  let urll = '/'+result.id;
                                  const infoRequest = new GraphRequest(
                                    urll,
                                    {
                                      parameters: {
                                        fields: {
                                          string: 'media{media_url,media_type},media_count'
                                        }
                                      }
                                    },
                                    responseFunc
                                  );
                                  // Start the graph request.
                                  new GraphRequestManager().addRequest(infoRequest).start()
                                }
                              }

                              let urll = '/'+result.instagram_business_account.id;
                              const infoRequest = new GraphRequest(
                                urll,
                                {
                                  parameters: {
                                    fields: {
                                      string: 'username,name'
                                    }
                                  }
                                },
                                responseFunc
                              );
                              // Start the graph request.
                              new GraphRequestManager().addRequest(infoRequest).start()
                            }
                          }

                          let urll = '/'+result.data[0].id;
                          const infoRequest = new GraphRequest(
                            urll,
                            {
                              parameters: {
                                fields: {
                                  string: 'instagram_business_account,name'
                                }
                              }
                            },
                            responseFunc
                          );
                          // Start the graph request.
                          new GraphRequestManager().addRequest(infoRequest).start();

                        }
                      }
                      const infoRequest2 = new GraphRequest(
                        '/me/accounts',
                        null,
                        responseFunc2
                      );
                      // Start the graph request.
                      new GraphRequestManager().addRequest(infoRequest2).start();
                      // console.log("here5");

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
          <Button onPress={this.listenUserMobile} textStyle={{fontSize: 18}} title = "Load" >
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
