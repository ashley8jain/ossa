import React, { Component } from 'react';
import { Text, Image, View, StyleSheet, ScrollView, Button, ToastAndroid
         ,TouchableOpacity, TouchableWithoutFeedback, TouchableNativeFeedback,
        ListView, TextInput, NativeModules, Dimensions, Alert } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Clarifai from 'clarifai';
import Icon from 'react-native-vector-icons/MaterialIcons'


var ACCESS_TOKEN = '8593252.c09ec1a.83deea9350bf4bb39f82c5937c86e56b';
var REQUEST_URL = 'https://api.instagram.com/v1/users/1686110577/media/recent/?access_token=8593252.c09ec1a.83deea9350bf4bb39f82c5937c86e56b';
var ImagePicker = NativeModules.ImageCropPicker;


class App extends React.Component {

  static navigationOptions = {
    header: null,
    tabBarLabel: "First",
    tabBarIcon: () => <Icon size={24} name="home" color="white" />
  }

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
      text: '',
      submit: false,
      username: '',
      isTapped:false,
      rawData: []
    };
    this.handleTaps = this.handleTaps.bind(this);
    this.pressView = this.pressView.bind(this);
    this.pickSingle = this.pickSingle.bind(this);
  }

  // componentDidMount() {
  //   this.fetchData();
  // }

  fetchData() {
    fetch('https://api.instagram.com/v1/users/search?q='+this.state.text+'&access_token=8593252.c09ec1a.83deea9350bf4bb39f82c5937c86e56b')
    .then(response => response.json())
    .then((response) => {
      this.setState({
        loaded: false,
        text: this.state.text,
        submit: true,
        username: response.data[0].username,
      });
      fetch('https://api.instagram.com/v1/users/'+response.data[0].id+'/media/recent/?access_token=8593252.c09ec1a.83deea9350bf4bb39f82c5937c86e56b')
      .then((response) => response.json())
      .then((responseData) => {
        //console.log(responseData.data);

        this.setState({
          rawData: responseData.data,
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
      <View style={{flex: 1, flexDirection: 'column'}}>

      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderData.bind(this)}
        contentContainerStyle={styles.list}
      />
      <BottomBar tapped = {this.state.isTapped}/>
      <View style={{position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,

            width:'100%'}}>
            <Button
              onPress={() => this.pickSingle(true)}

              title="Upload Image"
              color="#841584"
              accessibilityLabel="Learn more about this purple button"
            />
        </View>
      </View>
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
          Loading...
        </Text>
      </View>
    );
  }

  handleTaps(e){
    !this.state.isTapped ? this.setState({isTapped:true}) : this.setState({isTapped:false}) ;
    // ToastAndroid.show("Hello", ToastAndroid.SHORT);
  }

  pressView(e,data){
    // ToastAndroid.show(item.name, ToastAndroid.SHORT);
    this.props.navigation.navigate('Profile',{data});
  }

  pickSingle(cropit, circular=false) {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: cropit,
      cropperCircleOverlay: circular,
      compressImageMaxWidth: 640,
      compressImageMaxHeight: 480,
      compressImageQuality: 0.5,
      compressVideoPreset: 'MediumQuality',
      includeExif: true,
    }).then(image => {
      // console.log('received image', image);
      var data = {'images':{
        'thumbnail': {
          'url': image.path}
      }}
      // console.log(data);
      // console.log("After");
      // data = data.concat(this.state.rawData);
      // data.push(...this.state.rawData);
      // console.log(data);

      this.setState({
        rawData: this.state.rawData.concat(data),
        dataSource: this.state.dataSource.cloneWithRows(this.state.rawData.concat(data)),
      });

      console.log("RAW DATA");
      console.log(this.state.rawData);

    }).catch(e => {
      console.log(e);
      Alert.alert(e.message ? e.message : e);
    });
  }

  renderData(data) {
    // console.log("RAINBOW SIX SIEGE RAINBOW SIX SIEGE RAINBOW SIX SIEGE RAINBOW SIX SIEGE ");
    console.log(data);
    return (
        <TouchableWithoutFeedback onPress={(e)=>this.pressView(e,data)}
                       // onPress={(e)=>this.handleTaps(e)}
                     >
      <View style={styles.piccontainer}>
        <Image
          source={{uri: data.images.thumbnail.url}}
          style={styles.thumbnail}
        />
        {/*<View style={styles.rightContainer}>
          <Text style={styles.title}>{data.likes.count}</Text>
          <Text style={styles.year}>{data.comments.count}</Text>
        </View>*/}
      </View>
      </TouchableWithoutFeedback>
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

function BottomBar(props){
    if(!props.tapped){
        return null;
    }
     return(
        <View style={{position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'white',
            height: '10%',
            width:'100%'}}>
        </View>
    );
}




class OpenImage extends Component{

  static navigationOptions = {
    tabBarLabel: "First",
    tabBarIcon: () => <Icon size={24} name="image" color="white" />
  }

    constructor() {
      super();
      this.state = {
        tags: []
      };

    }

    componentWillMount(){
    process.nextTick = setImmediate;

    var app = new Clarifai.App({
      apiKey: 'b13eedefd5ee4207b1aab989b21930b4'
    });

    app.models.predict(Clarifai.GENERAL_MODEL, this.props.navigation.state.params.data.images.standard_resolution.url)
    .then(response =>  {
        console.log("abcbdjkfkajsndjksandjkas");
        //console.log(JSON.stringify(response.outputs[0].data.concepts, null, 2));
        this.setState({
          tags: response.outputs[0].data.concepts
        });

        console.log("abcbdjkfkajsndjksandjkas");
        console.log(this.state.tags);``
      },
      function(err) {
        console.error(err);
        console.log("ERROR ERROR ERROR")
        }
      );

    }

    render(){
        return(
        //    <View style={styles.textContainer}>
        //        <Text style={{fontSize:30}}>Name: {this.props.navigation.state.params.item.name} </Text>
        //        <Text style={{fontSize:30}}>id: {this.props.navigation.state.params.item.id} </Text>
        //    </View>
            <View style = {{flexDirection:'column', flex:1, justifyContent: 'center',
              alignItems: 'center', backgroundColor: 'white'}}>
              <View style={{width: '100%',flex:1, backgroundColor: 'black', justifyContent: 'flex-end', alignItems:'center'}}>
                  <Image
                      source={{uri: this.props.navigation.state.params.data.images.standard_resolution.url}}
                      /*style={{width:this.props.navigation.state.params.data.images.standard_resolution.width,
                              height:this.props.navigation.state.params.data.images.standard_resolution.height,
                              }}*/
                        style={styles.thumbnail2}
                  />
              </View>

              <View style={styles.rightContainer}>
                <ScrollView >
                {
                  this.state.tags.map((item, index) => (
                  <View key = {item.id} style = {styles.item2}>
                    <Text style = {{fontSize:20}}>{item.name}</Text>
                    <Text style = {{fontSize:20}}>{item.value}</Text>
                  </View>
                  ))
                }
                </ScrollView>
              </View>
            </View>
        )}

}

const ModalStack = StackNavigator({
  Login: {
      screen: App
  },
  Profile: {
    screen: OpenImage,
  },

});

const styles = StyleSheet.create ({
  item: {
    width:'32%',
    height: 100,
    //flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    margin: 2,
    borderColor: '#2a4944',
    borderWidth: 1,
    backgroundColor: '#d2f7f1'
  },
  item2: {
    width:'100%',
    height: '5%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    left:0,
    right:0,
    borderColor: '#2a4944',
    borderWidth: 1,
    backgroundColor: 'white'
  },
  textContainer:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  piccontainer: {
    backgroundColor: '#EEEEEE',
    padding: 5,
    margin: 1,
    width:'32.5%'
  },
  piccontainer2: {
    width: '100%',flex:1, backgroundColor: 'black'
  },
  rightContainer: {
    flex:1,
    backgroundColor: 'black',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    color:'white',
  },
  year: {
    textAlign: 'center',
    color:'white',
  },
  thumbnail: {
    width: 150,
    height: 150,
  },
  thumbnail2: {
    width:400,
    height:400
  },
  list: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
    flexDirection: 'row',
    flexWrap: 'wrap'
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
    paddingLeft: 10,
    alignItems: 'center'
  },
  submitButton: {
    backgroundColor: 'gray',
    padding: 10,
    margin: 15,
    height: 40,
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },


});


export default ModalStack
