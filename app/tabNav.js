import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { TabNavigator } from 'react-navigation'
import Icon from 'react-native-vector-icons/MaterialIcons'

import Home from './screen/Home'
import SecondScreen from './screen/SecondScreen'
import ThirdScreen from './screen/ThirdScreen'
import FourthScreen from './screen/FourthScreen'
import FifthScreen from './screen/FifthScreen'

// ref: https://reactnavigation.org/docs/navigators/tab

const TabNav = TabNavigator(
  {
      Home: {screen: Home},
      Tab2: {screen: SecondScreen},
      Tab3: {screen: ThirdScreen},
      Tab4: {screen: FourthScreen},
      Tab5: {screen: FifthScreen}
  },
  {
    tabBarPosition: 'bottom',
    swipeEnabled: true,
    tabBarOptions: {
      showIcon: true,

      //IOS
      activeTintColor : 'white',
      activeBackgroundColor: '#c82e13',
      inactiveTintColor: 'white',
      inactiveBackgroundColor: '#d04026',

      showLabel: false,

      //ANDROID
      style: {
        backgroundColor: '#c82e13',
      },
      indicatorStyle: {
        backgroundColor: '#751b0b'
      }
    }
  }
)

export default TabNav;
