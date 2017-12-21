import React, { Component } from 'react'
import { Text, View, Alert } from 'react-native'
import { TabNavigator } from 'react-navigation'

import Home from './screen/Home'
import Search from './screen/Search'
import ThirdScreen from './screen/ThirdScreen'
import Insight from './screen/Insight'
import Profile from './screen/Profile'

// ref: https://reactnavigation.org/docs/navigators/tab

const TabNavv = (props) => {
  const TabNav = TabNavigator(
  {
      Home: {screen: Home},
      Search: {screen: Search},
      Tab3: {screen: ThirdScreen},
      Insight: {screen: Insight},
      Profile: {screen: Profile}
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
  });

  return (
    // Alert.alert(props.token),
    <TabNav
      screenProps={
        {
          instaToken: props.instaToken,
          fbID: props.fbID,
          logoutFunc: props.logoutFunc
        }
      }
    />
  );
}




export default TabNavv;
