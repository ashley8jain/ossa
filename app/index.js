import React, { Component } from 'react'
import { Text, View, TouchableOpacity, AsyncStorage, Alert, TextInput, Keyboard, Image, Dimensions } from 'react-native'
import InstagramLogin from 'react-native-instagram-login';
import firebase from './firebase';
import {LoginButton,LoginManager,AccessToken, GraphRequestManager, GraphRequest} from 'react-native-fbsdk'
import { Button,Card,Avatar } from 'react-native-elements'
import {
  RkButton,
  RkText,
  RkTextInput,
  RkAvoidKeyboard,
  RkStyleSheet,
  RkTheme
} from 'react-native-ui-kitten';
import {FontAwesome} from './assets/icons';
// import {GradientButton} from './components/gradientButton';
import {scale, scaleModerate, scaleVertical} from './utils/scale';

import signup from './signup'
import { StackNavigator } from 'react-navigation';
import TabNav from './tabNav'

import {bootstrap} from './config/bootstrap';
bootstrap();

class LoginV extends Component{
  static navigationOptions = {
    header: null,
  };

  constructor(props){
    super(props);
    this.state = {
      instaToken: null,
      uid: null,
      email: null,
      password: null
    };
    this.logout = this.logout.bind(this);
    this.signup = this.signup.bind(this);
    this.login = this.login.bind(this);
    this.setUserMobile = this.setUserMobile.bind(this);
    this.listenUserMobile = this.listenUserMobile.bind(this);
    this.loginFirebase_usingFB = this.loginFirebase_usingFB.bind(this);
    this.loginInWithFB = this.loginInWithFB.bind(this);
    this.loginSucced = this.loginSucced.bind(this);
  }


  componentDidMount() {
    AsyncStorage.getItem('instaToken').then((value) => {
      this.setState({instaToken: value});
    }).done();
    AsyncStorage.getItem('uid').then((value) => {
      this.setState({uid: value});
    }).done();
    AsyncStorage.getItem('email').then((value) => {
      this.setState({email: value});
    }).done();
    AsyncStorage.getItem('fbID').then((value) => {
      this.setState({fbID: value});
    }).done();

    // firebase.auth().createUserWithEmailAndPassword("email@gmail.com", "passsssss");
    // firebase.database().ref('users/ashley8jain').set({
    //   username: 'ashley8jain'
    // });

  }

//ref :- https://developers.facebook.com/docs/react-native/login



  loginSucced(instaToken){
    this.setState({ instaToken: instaToken});
    AsyncStorage.setItem("instaToken", instaToken);
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

  async loginFirebase_usingFB(credential){
    await firebase.auth().signInWithCredential(credential).catch(function(error) {
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

    let user = await firebase.auth().currentUser;
    this.setState(
      {uid:user.uid}
    );
    console.log("firebase user id: "+user.uid);
    AsyncStorage.setItem("uid", user.uid);
  }

  logout() {

    firebase.auth().signOut();
    LoginManager.logOut();

    this.setState({uid:null,email:null,instaToken:null,fbID:null});
    let keys = ['uid','email','instaToken','fbID'];
    AsyncStorage.multiRemove(keys, (err) => {
    });

    alert("logout.");
    // Navigate to login view

  }

  setUserMobile(){
    Keyboard.dismiss();
    // if(this.state.instaToken!=null && this.state.fbID!=null){
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

  loginInWithFB(){

    LoginManager.logInWithPublishPermissions(['manage_pages']).then(

      function(result) {
        if (result.isCancelled) {
          alert('Login cancelled');
        } else {

          LoginManager.logInWithReadPermissions(["public_profile","email","instagram_basic","instagram_manage_insights"]).then(
            function(result) {
              if (result.isCancelled) {
                alert('Login cancelled');
              } else {
                AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    console.log("Data: "+JSON.stringify(data));
                    let accessToken = data.accessToken;
                    console.log("fb token: "+accessToken);
                    // Build Firebase credential with the Facebook access token.
                    var credential = firebase.auth.FacebookAuthProvider.credential(accessToken);
                    // alert(credential.toString());
                    // Sign in with credential from the Google user.
                    this.loginFirebase_usingFB(credential);

                    // console.log("here1");
                    //FB Graph API :- https://stackoverflow.com/questions/37383888/how-to-use-graph-api-with-react-native-fbsdk
                    const responseFunc = (error, result) => {
                      if (error) {
                        console.log(error)
                        alert('Error fetching data: ' + error.toString());
                      } else {
                        console.log("hereeee: "+JSON.stringify(result))
                        this.setState({email:result.email,gender:result.gender});
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
                                    // ref:- https://developers.facebook.com/docs/instagram-api/reference/user/#insights
                                    // ref2:- https://developers.facebook.com/docs/instagram-api/reference/media/#metadata
                                    // media and insight datas
                                  }
                                }
                                this.setState({fbID:result.id});
                                AsyncStorage.setItem("fbID", result.id);
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
                            console.log("hereeee: "+JSON.stringify(result));
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


                  });



              }
            }.bind(this));

        }
      }.bind(this)

    );


  }

  _renderImage() {
    let contentHeight = scaleModerate(375, 1);
    let height = Dimensions.get('window').height - contentHeight;
    let width = Dimensions.get('window').width;

    image = (<Image style={[styles.image, {height, width}]}
                    source={require('./assets/images/backgroundLoginV1.png')}/>);

    return image;
  }


  render(){
    if(this.state.uid!=null){
      return (
        // Alert.alert(this.state.instaToken),
        <TabNav instaToken={this.state.instaToken} fbID={this.state.fbID} email={this.state.email} logoutFunc={this.logout}
          loginInWithFB={this.loginInWithFB} loginInWithInstagram={this.loginSucced} />
      )
    }
    else{
      let image = this._renderImage();

      return(
        <RkAvoidKeyboard
          onStartShouldSetResponder={ (e) => true}
          onResponderRelease={ (e) => Keyboard.dismiss()}
          style={styles.screen}>
          {image}
          <View style={styles.container}>
            <View style={styles.buttons}>
              <RkButton style={styles.button} rkType='social'>
                <RkText rkType='awesome hero primary'>{FontAwesome.twitter}</RkText>
              </RkButton>
              <RkButton style={styles.button} rkType='social'>
                <RkText rkType='awesome hero primary'>{FontAwesome.google}</RkText>
              </RkButton>
              <RkButton style={styles.button} rkType='social' onPress={() => this.loginInWithFB()}>
                <RkText rkType='awesome hero primary'>{FontAwesome.facebook}</RkText>
              </RkButton>
            </View>
            <RkTextInput placeholder='Email'
                         value={this.state.email}
                         onChangeText={(text) => this.setState({email: text})}
                         rkType='rounded'/>
            <RkTextInput placeholder='Password'
                         value={this.state.password}
                         onChangeText={(text) => this.setState({password: text})}
                         rkType='rounded'
                         secureTextEntry={true}/>
            <Button
              raised
              onPress={() => this.login()}
              title="LOGIN"
              backgroundColor= {RkTheme.current.colors.primary}/>


            <View style={{margin: 10}}>
              <Button
                raised
                title="Login with Instagram"
                onPress={()=> this.refs.instagramLogin.show()}
                backgroundColor='#E100A2'/>
            </View>
            <InstagramLogin
                ref='instagramLogin'
                clientId='e9cd736246f04098903acf6d3c3e8809'
                scopes={['public_content', 'follower_list']}
                onLoginSuccess={(instaToken) => this.loginSucced(instaToken)}
                redirectUrl='http://localhost:8515/oauth_callback'
            />

            <View style={styles.footer}>
              <View style={styles.textRow}>
                <RkText rkType='primary3'>Don’t have an account?</RkText>
                <RkButton rkType='clear'>
                  <RkText rkType='header6' onPress={() => this.props.navigation.navigate('Signup')}> Sign up now </RkText>
                </RkButton>
              </View>
            </View>
          </View>
        </RkAvoidKeyboard>
      )
    }
  }
}

// <TextInput style = {styles.input}
//   onChangeText={(email) => this.setState({email})}
//   value={this.state.email}
//   underlineColorAndroid="transparent"
//   autoCapitalize="none"
//   keyboardType="email-address"
//   placeholder="email"
// />
// <TextInput style = {styles.input}
//   onChangeText={(password) => this.setState({password})}
//   value={this.state.password}
//   underlineColorAndroid="transparent"
//   autoCapitalize="none"
//   secureTextEntry={true}
//   placeholder="password"
// />
// <Button onPress={this.signup} textStyle={{fontSize: 18}} title = "Sign up" >
// </Button>
// <Button onPress={this.login} textStyle={{fontSize: 18}} title = "Login" >
// </Button>
// <TextInput style = {styles.input}
//   onChangeText={(mobile) => this.setState({mobile})}
//   value={this.state.mobile}
//   underlineColorAndroid="transparent"
//   keyboardType="phone-pad"
//   placeholder="mobile"
// />
// <Button onPress={this.setUserMobile} textStyle={{fontSize: 18}} title = "Save" >
// </Button>
// <Button onPress={this.listenUserMobile} textStyle={{fontSize: 18}} title = "Load" >
// </Button>

let styles = RkStyleSheet.create(theme => ({
  screen: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.colors.screen.base
  },
  image: {
    resizeMode: 'cover',
    marginBottom: scaleVertical(10),
  },
  container: {
    paddingHorizontal: 17,
    paddingBottom: scaleVertical(22),
    alignItems: 'center',
    flex: -1
  },
  footer: {
    justifyContent: 'flex-end',
    flex: 1
  },
  buttons: {
    flexDirection: 'row',
    marginBottom: scaleVertical(24)
  },
  button: {
    marginHorizontal: 14
  },
  save: {
    marginVertical: 9
  },
  textRow: {
    justifyContent: 'center',
    flexDirection: 'row',
  }
}));

const LoginStack = StackNavigator({
  Login: {
      screen: LoginV
  },
  Signup: {
    screen: signup
  },

});

export default LoginStack;
