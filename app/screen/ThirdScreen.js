import React,{ Component } from 'react'
import {Text,View} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'


export default class ThirdScreen extends Component {
  static navigationOptions = {
    tabBarLabel: "Third",
    tabBarIcon: () => <Icon size={24} color="white" name="add-circle" onPress={() => console.log(JSON.stringify(this.props))} />
  }

  render() {
    return(
      <View>
        <Text>ThirdScreen</Text>
      </View>
    );
  }
}
