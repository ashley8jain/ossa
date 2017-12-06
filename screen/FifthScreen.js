import React,{ Component } from 'react'
import {Text,View} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'


export default class FifthScreen extends Component {
  static navigationOptions = {
    tabBarLabel: "Fifth",
    tabBarIcon: () => <Icon size={24} color="white" name="people-outline" />
  }

  render() {
    return(
      <View>
        <Text>FifthScreen</Text>
      </View>
    );
  }
}
