import React,{ Component } from 'react'
import {Text,View} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'


export default class FourthScreen extends Component {
  static navigationOptions = {
    tabBarLabel: "Fourth",
    tabBarIcon: () => <Icon size={24} name="graphic-eq" color="white" />
  }

  render() {
    return(
      <View>
        <Text>FourthScreen</Text>
      </View>
    );
  }
}
