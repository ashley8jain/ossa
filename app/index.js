import React, { Component } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage, Alert } from 'react-native'
import InstagramLogin from 'react-native-instagram-login';

import TabNav from './tabNav'


class MyApp extends Component{

  constructor(props){
    super(props);
    this.state = {
      token: null
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('token').then((value) => {
      this.setState({token: value});
    }).done();
  }

  loginSucced(token){
    this.setState({ token });
    AsyncStorage.setItem("token", token);
  }

  render(){
    if(this.state.token!=null){
      return (
        // Alert.alert(this.state.token),
        <TabNav token={this.state.token}/>
      )
    }
    else{
      return(
        <View style={styles.container}>
          <TouchableOpacity onPress={()=> this.refs.instagramLogin.show()}>
            <Text style={{color: 'blue'}}>Login</Text>
          </TouchableOpacity>
          <InstagramLogin
              ref='instagramLogin'
              clientId='e9cd736246f04098903acf6d3c3e8809'
              scopes={['public_content', 'follower_list']}
              onLoginSuccess={(token) => this.loginSucced(token)}
              redirectUrl='http://localhost:8515/oauth_callback'
          />
        </View>
      )
    }
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
});

export default MyApp;
