/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
  Component,
} from 'react';
import {
  AppRegistry,
  Image,
  ListView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  WebView,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons'

// import { Chart } from 'react-google-charts';

var ACCESS_TOKEN = '8593252.c09ec1a.83deea9350bf4bb39f82c5937c86e56b';
var REQUEST_URL = 'https://api.instagram.com/v1/users/1686110577/media/recent/?access_token=8593252.c09ec1a.83deea9350bf4bb39f82c5937c86e56b';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
      text: '',
      subit: false,
      username: '',
    };
  }

  static navigationOptions = {
    tabBarLabel: "First",
    tabBarIcon: () => <Icon size={24} name="home" color="white" />
  }

  // componentDidMount() {
  //   this.fetchData();
  // }

  fetchData() {
    fetch('https://api.instagram.com/v1/users/search?q='+this.state.text+'&access_token=8593252.c09ec1a.83deea9350bf4bb39f82c5937c86e56b')
    .then(response => response.json())
    .then((response) => {
      this.setState({
        loaded: true,
        text: this.state.text,
        submit: true,
        username: response.data[0].username,
      });
      fetch('https://api.instagram.com/v1/users/'+response.data[0].id+'/media/recent/?access_token=8593252.c09ec1a.83deea9350bf4bb39f82c5937c86e56b')
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData.data),
          loaded: true,
          text: this.state.text,
          submit: true,
          username: responseData.data[0].user.username,
        });
      })
      .done();
    })
  }

  render() {
    if (!this.state.submit) {
      return this.renderTextInput();
    }

    else if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderData}
        style={styles.listView}
      />
    );
  }

  renderTextInput() {
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
          <Text style={{fontSize: 24, lineHeight: 30}}>IntelMark</Text>
          <Text style={{fontSize: 8, lineHeight: 18}}>BETA</Text>
        </View>
        <View style={styles.container1}>
          <TextInput style = {styles.input}
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}
          />
          <Button
             style = {styles.submitButton}
             onPress = {() => this.fetchData()}
             title = "search"
          />
        </View>
      </View>
    );
  }

  renderLoadingView() {
    return (
      <View style={styles.container}>
        <Text>
          Loading movies...
        </Text>
      </View>
    );
  }

  renderData(data) {
    return (
      <View style={styles.piccontainer}>
        <Image
          source={{uri: data.images.thumbnail.url}}
          style={styles.thumbnail}
        />
        <View style={styles.rightContainer}>
          <Text style={styles.title}>{data.likes.count}</Text>
          <Text style={styles.year}>{data.comments.count}</Text>
        </View>
      </View>
    );
  }

  // rendernet() {
  //   return (
  //     <WebView
  //       source={{uri: 'https://www.instagram.com/'+this.state.username+'/' }}
  //       style={{marginTop: 20}}
  //     />
  //   );
  // }

}

var styles = StyleSheet.create({
  piccontainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  rightContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  year: {
    textAlign: 'center',
  },
  thumbnail: {
    width: 53,
    height: 81,
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container1: {
    flexDirection: 'column',
    justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF',
  },
  logo: {
    fontSize: 25,
  },
  input: {
      margin: 15,
      height: 40,
      width: 300,
      borderWidth: 1,
  },
  submitButton: {
     backgroundColor: 'gray',
     padding: 10,
     margin: 15,
     height: 40,
  },
  rightContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  year: {
    textAlign: 'center',
  },
  thumbnail: {
    width: 150,
    height: 150,
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
});
