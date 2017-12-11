import React,{ Component } from 'react'
import {Text,View,StyleSheet} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {LoginManager,AccessToken} from 'react-native-fbsdk'

import {LoginButton} from 'react-native-fbsdk'

export default class FifthScreen extends Component {
  static navigationOptions = {
    tabBarLabel: "Fifth",
    tabBarIcon: () => <Icon size={24} color="white" name="people-outline" />
  }

  render() {
    return(
      <View style={styles.container}>
        <Text>FifthScreen</Text>
        <LoginButton
          publishPermissions={["publish_actions"]}
          onLoginFinished={
            (error, result) => {
              if (error) {
                alert("login has error: " + result.error);
              } else if (result.isCancelled) {
                alert("login is cancelled.");
              } else {
                AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    alert(data.accessToken.toString())
                  }
                )
              }
            }
          }
          onLogoutFinished={() => alert("logout.")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
