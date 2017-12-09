import React,{ Component } from 'react'
import {Text,View} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'


export default class SecondScreen extends Component {
  static navigationOptions = {
    tabBarLabel: "Sec",
    tabBarIcon: () => <Icon size={24} name="search" color="white" />
  }

  render() {
    return(
      <View>
        <Text>SecondScreen</Text>
      </View>
    );
  }
}
