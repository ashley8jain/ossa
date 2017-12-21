import React,{ Component } from 'react'
import {Text,View,Button,StyleSheet} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

export default class FifthScreen extends Component {
  static navigationOptions = {
    tabBarLabel: "Fifth",
    tabBarIcon: () => <Icon size={24} color="white" name="people-outline" />
  }

  render() {
    return(
      <View style={styles.container}>
        <Button onPress={() => this.props.screenProps.logoutFunc()} title="Logout" />
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
