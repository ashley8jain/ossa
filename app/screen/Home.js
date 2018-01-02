import React, { Component } from 'react';
import { Platform, Text, Image, View, StyleSheet, ScrollView, Button, ToastAndroid
         ,TouchableOpacity, TouchableWithoutFeedback, TouchableNativeFeedback,
        ListView, TextInput, NativeModules, Dimensions, Alert, Switch } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { TabNavigator } from 'react-navigation';
import Clarifai from 'clarifai';
import Icon from 'react-native-vector-icons/MaterialIcons'
import ImagePicker from 'react-native-image-crop-picker';
import {GraphRequestManager,GraphRequest} from 'react-native-fbsdk'
import { Dialog } from 'react-native-simple-dialogs';


class App extends Component {

  static navigationOptions = {
    header: null,
    tabBarLabel: "First",
    tabBarIcon: () => <Icon size={24} name="home" color="white" />
  }

  constructor(props) {
    super(props);
    // Alert.alert(this.props.screenProps);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
      text: '',
      isTapped:false,
      rawData: [],
      dialogVisible: false,
    };
    this.pressView = this.pressView.bind(this);
    this.pickCamera = this.pickCamera.bind(this);
    this.pickGallery = this.pickGallery.bind(this);
    
  }


  componentDidMount() {
    this.fetchData();
  }

  //loads media from endpoint API
  fetchData() {
    if(this.props.screenProps.instaToken!=null){

        fetch('https://api.instagram.com/v1/users/self/media/recent/?access_token='+this.props.screenProps.instaToken)
        .then((response) => response.json())
        .then((responseData) => {
          console.log(responseData);
          this.setState({
            rawData: responseData.data,
            dataSource: this.state.dataSource.cloneWithRows(responseData.data),
            loaded: true,
            text: this.state.text,
          });
        });
    }
    else if(this.props.screenProps.fbID!=null){
      const responseFunc = (error, result) => {
        if (error) {
          console.log(error)
          alert('Error fetching data: ' + JSON.stringify(error));
        } else {
          console.log(result);
          this.setState({
            rawData: result.media.data,
            dataSource: this.state.dataSource.cloneWithRows(result.media.data),
            loaded: true,
            text: this.state.text,
          });
        }
      }

      let urll = '/'+this.props.screenProps.fbID;
      const infoRequest = new GraphRequest(
        urll,
        {
          parameters: {
            fields: {
              string: 'media{media_url,media_type},media_count'
            }
          }
        },
        responseFunc
      );
      // Start the graph request.
      new GraphRequestManager().addRequest(infoRequest).start()
    }
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

  render() {

    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <View style={styles.statusbar}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderData.bind(this)}
          contentContainerStyle={styles.list}
        />
        <Dialog
          visible={this.state.dialogVisible}
          title="Select Source"
          onTouchOutside={() => this.setState({dialogVisible: false})} >
          <View>
            <Button onPress={() => this.pickCamera()} title="Camera" />
            <Button onPress={() => this.pickGallery()} title="Gallery" />
          </View>
      </Dialog>
        <View style={{position: 'absolute',left: 0,right: 0,bottom: 0,width:'100%'}}>
          <Button onPress={() => this.popup_dialog()} title="Upload Image" color="#841584"/>
        </View>
      </View>
    );
  }



  pressView(data){
    // ToastAndroid.show(item.name, ToastAndroid.SHORT);
    this.props.navigation.navigate('ImageSelected',{data});
  }

  popup_dialog(){
    this.setState({dialogVisible:true});
  }

  pickCamera(){

    this.setState({dialogVisible:false},() => {
      ImagePicker.openCamera({
        width: 300,
        height: 300,
        cropping: true,
        cropperCircleOverlay: false,
        compressImageMaxWidth: 640,
        compressImageMaxHeight: 480,
        compressImageQuality: 0.5,
        compressVideoPreset: 'MediumQuality',
        includeExif: true,
      }).then(image => {
        var data = {'images':{
          'thumbnail': {
            'url': image.path}
        }}

        this.setState({
          rawData: this.state.rawData.concat(data),
          dataSource: this.state.dataSource.cloneWithRows(this.state.rawData.concat(data)),
        });

        console.log(this.state.rawData);

      }).catch(e => {
        console.log(e);
        Alert.alert(e.message ? e.message : e);
      });
    });
  }

  pickGallery(){

    this.setState({dialogVisible:false},() => {
      ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
        cropperCircleOverlay: false,
        compressImageMaxWidth: 640,
        compressImageMaxHeight: 480,
        compressImageQuality: 0.5,
        compressVideoPreset: 'MediumQuality',
        includeExif: true,
      }).then(image => {
        var data = {'images':{
          'thumbnail': {
            'url': image.path}
        }}

        this.setState({
          rawData: this.state.rawData.concat(data),
          dataSource: this.state.dataSource.cloneWithRows(this.state.rawData.concat(data)),
        });

        console.log(this.state.rawData);

      }).catch(e => {
        console.log(e);
        Alert.alert(e.message ? e.message : e);
      });
    });

  }

  renderData(data) {
    // console.log("RAINBOW SIX SIEGE RAINBOW SIX SIEGE RAINBOW SIX SIEGE RAINBOW SIX SIEGE ");
    // console.log(data);
    var img_url='';
    if(this.props.screenProps.instaToken!=null){
      img_url = data.images.thumbnail.url
    }
    else{
      img_url = data.media_url
    }
    return (
      <TouchableWithoutFeedback onPress={()=>this.pressView(data)}>
        <View style={styles.piccontainer}>
          <Image
            source={{uri: img_url}}
            style={styles.thumbnail}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }

}



class OpenImage extends Component{

  static navigationOptions = {
    ...Platform.select({
      android: {
        header: null,
      },
    }),
    tabBarLabel: "First",
    tabBarIcon: () => <Icon size={24} name="image" color="white" />
  }

    constructor() {
      super();
      this.state = {
        tags: [],
        text: "#travel #joyoflife #intelmark #fun",
        height: 0
      };

    }

    componentWillMount(){
      process.nextTick = setImmediate;

    }

    render(){
      var img_url='';
      if(this.props.screenProps.instaToken!=null){
        img_url = this.props.navigation.state.params.data.images.thumbnail.url
      }
      else{
        img_url = this.props.navigation.state.params.data.media_url
      }
      return(
        <View style = {{flex:1, backgroundColor: '#F9F9F9'}} >
          <View style = {{height:'9%', backgroundColor: '#F9F9F9', justifyContent: 'center', alignItems: 'center'}} >
            <Text style = {{padding: 10, fontSize: 19, fontWeight: 'bold'}} >
              CAPTION
            </Text>
          </View>
          <View style = {styles.textCaption}>
            <Image
                  source={{uri: img_url}}
                /*style={{width:this.props.navigation.state.params.data.images.standard_resolution.width,
                        height:this.props.navigation.state.params.data.images.standard_resolution.height,
                        }}*/
                  style={styles.thumbnailCaption}
            />
             <TextInput
                  {...this.props}
                  multiline={true}
                  onChangeText={(text) => {
                      this.setState({ text })
                  }}
                  numberOfLines = {4}
                  style = {{width: '68%', fontSize: 20, padding: 5, textAlignVertical: "top",
                  height: 125, marginLeft: 8}}
                  value = {this.state.text}
                  editable = {true}
                  maxLength = {100}
                  placeholder = {"Your caption"}
                  underlineColorAndroid = {'transparent'}
              />
          </View>
          <View style = {{height:'9%', backgroundColor: '#F9F9F9', justifyContent: 'center'}} >
            <Text style = {{padding: 10, fontSize: 17}} >
              HASHTAGS
            </Text>
          </View>
          <View style = {{height: '22%', backgroundColor: 'white', }} >
            <HashTags/>
          </View>
          <View style = {{height: '5%', backgroundColor: '#F9F9F9', }} />

          <View style = {{height: '8%', backgroundColor: 'white',
            alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}} >
              <Text style = {{padding: 10, fontSize: 20}} >8 Dec 2017 / 9:00 pm</Text>
              <Switch style = {{marginRight: 10}} value = {true} />
          </View>
        </View>
      )
    }

}

class Groups extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Group',
  };
  render() {
    return (
      <View style = {{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>
          Group
        </Text>
      </View>
    );
  }
}

class Recent extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Recent',
  };
  render() {
    return (
      <View style = {{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style = {{fontSize: 18}} >
          Fetch recent Hashtags
        </Text>
      </View>
    );
  }
}

class MostUsed extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Most Used',
  };
  render() {
    return (
      <View style = {{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>
          Most Used
        </Text>
      </View>
    );
  }
}

const HashTags = TabNavigator({
  Home: {
    screen: Groups,
  },
  Notifications: {
    screen: Recent,
  },
  MostUsed: {
    screen: MostUsed,
  }
}, {
  tabBarPosition: 'top',
  animationEnabled: true,
  tabBarOptions: {
    activeTintColor: 'black',
    inactiveTintColor: 'grey',
    labelStyle: {
      fontSize: 17,
    },
    style : {
      backgroundColor: 'white'
    },
    indicatorStyle: {
      backgroundColor: 'grey',
    },

  },
});

const ModalStack = StackNavigator({
  Login: {
      screen: App
  },
  ImageSelected: {
    screen: OpenImage,
  },

});

const styles = StyleSheet.create ({
  icon: {
    width: 26,
    height: 26,
  },
   textCaption: {
      flexDirection: 'row',
      padding: 15,
      height:'27%',
      backgroundColor: 'white'
   },
   statusbar:
   {
       flex: 1,
       ...Platform.select({
         ios: {
            paddingTop: 20
          },
          android: {}
        }),
   },
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
    backgroundColor: '#ffffff',
    padding: 1,
    width:'33.3%',
    aspectRatio: 1
  },
  thumbnail: {
    width:'100%',
    height: '100%'
  },
  thumbnailCaption: {
    width: 125,
    height: 125,
  },
  list: {
    backgroundColor: '#ffffff',
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
