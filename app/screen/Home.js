import React, { Component } from 'react';
import { Platform, Text, Image, View, StyleSheet, ScrollView, ToastAndroid
         ,TouchableOpacity, TouchableWithoutFeedback, TouchableNativeFeedback,
        ListView, TextInput, NativeModules, Dimensions, Alert, Switch, AppState, Clipboard } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { TabNavigator } from 'react-navigation';
import Clarifai from 'clarifai';
import Icon from 'react-native-vector-icons/MaterialIcons'
import ImagePicker from 'react-native-image-crop-picker';
import {GraphRequestManager,GraphRequest} from 'react-native-fbsdk'
import { Dialog } from 'react-native-simple-dialogs';
import PushNotification from 'react-native-push-notification';
import CustomInstagramShare from 'react-native-instagram-share-android';
import firebase from '../firebase';
import { Button,List, ListItem , Badge, Avatar} from 'react-native-elements'

import RNFetchBlob from 'react-native-fetch-blob'

const storage = firebase.storage()


//upload image to firebase configure
  // Prepare Blob support
  const Fetch = RNFetchBlob.polyfill.Fetch
  // replace built-in fetch
  window.fetch = new Fetch({
      // enable this option so that the response data conversion handled automatically
      auto : true,
      // when receiving response data, the module will match its Content-Type header
      // with strings in this array. If it contains any one of string in this array,
      // the response body will be considered as binary data and the data will be stored
      // in file system instead of in memory.
      // By default, it only store response data to file system when Content-Type
      // contains string `application/octet`.
      binaryContentTypes : [
          'image/',
          'video/',
          'audio/',
          'foo/',
      ]
  }).build()
  const Blob = RNFetchBlob.polyfill.Blob
  const fs = RNFetchBlob.fs
  window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
  window.Blob = Blob

  const uploadImage = (uri, mime = 'application/octet-stream') => {
    return new Promise((resolve, reject) => {
      const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
      const sessionId = new Date().getTime()
      let uploadBlob = null
      const imageRef = storage.ref('images').child(`${sessionId}`)

      fs.readFile(uploadUri, 'base64')
        .then((data) => {
          return Blob.build(data, { type: `${mime};BASE64` })
        })
        .then((blob) => {
          uploadBlob = blob
          return imageRef.put(blob, { contentType: mime })
        })
        .then(() => {
          uploadBlob.close()
          return imageRef.getDownloadURL()
        })
        .then((url) => {
          resolve(url)
        })
        .catch((error) => {
          reject(error)
      })
    })
  }






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
    AppState.addEventListener('change',this.handleAppStateChange);
    PushNotification.configure({
      onNotification: function(notification) {
        console.log( 'NOTIFICATION:', notification );
      },
    });
  }

  componentWillUnmount() {
    AppState.removeEventListener('change',this.handleAppStateChange);
  }

  handleAppStateChange(appState){
    if (appState === 'background') {
      console.log(Date.now());
      let date = new Date(Date.now() + (5 * 1000));

      PushNotification.localNotificationSchedule({
        message: "My Notification Message",
        date,
      });
      console.log('app is in backgound');
    }
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
    // GET INSTA MEDIA from FB GRAPH API
    // else if(this.props.screenProps.fbID!=null){
    //   const responseFunc = (error, result) => {
    //     if (error) {
    //       console.log(error)
    //       alert('Error fetching data: ' + JSON.stringify(error));
    //     } else {
    //       console.log(result);
    //       this.setState({
    //         rawData: result.media.data,
    //         dataSource: this.state.dataSource.cloneWithRows(result.media.data),
    //         loaded: true,
    //         text: this.state.text,
    //       });
    //     }
    //   }
    //
    //   let urll = '/'+this.props.screenProps.fbID;
    //   const infoRequest = new GraphRequest(
    //     urll,
    //     { accessToken: this.props.screenProps.fbToken,
    //       parameters: {
    //         fields: {
    //           string: 'media{media_url,media_type},media_count'
    //         }
    //       }
    //     },
    //     responseFunc
    //   );
    //   // Start the graph request.
    //   new GraphRequestManager().addRequest(infoRequest).start()
    // }
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
            <Button onPress={() => this.pickCamera()} title="Camera" backgroundColor='#397af8'/>
            <Button onPress={() => this.pickGallery()} title="Gallery" backgroundColor='#397af8'/>
          </View>
      </Dialog>
        <View style={{position: 'absolute',left: 0,right: 0,bottom: 0,width:'100%'}}>
          <Button onPress={() => this.popup_dialog()} title="Upload Image" color="#841584" backgroundColor='#397af8'/>
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
        includeExif: true,
      }).then(image => {
        console.log("image JSON: "+JSON.stringify(image));

        //upload image to firebase
        uploadImage(image.path)
        .then(url => {
          console.log("uploadUrl: "+url);
          var data = {
            'images':{
              'thumbnail': {
                'url': url
              },
              'standard_resolution': {
                'url': url
              }
            },
            'uploaded':true
          }
          console.log("json data: "+data);
          this.setState({
            rawData: this.state.rawData.concat(data),
            dataSource: this.state.dataSource.cloneWithRows(this.state.rawData.concat(data)),
          });

          console.log(this.state.rawData);
        })
        .catch(error => console.log(error));

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
        console.log("image JSON: "+JSON.stringify(image));

        //upload image to firebase
        uploadImage(image.path)
        .then(url => {
          console.log("uploadUrl: "+url);
          var data = {
            'images':{
              'thumbnail': {
                'url': url
              },
              'standard_resolution': {
                'url': url
              },
              'filePath': {
                'url': image.path
              }
            },
            'uploaded':true,

          }
          console.log("json data: "+JSON.stringify(data));
          this.setState({
            rawData: this.state.rawData.concat(data),
            dataSource: this.state.dataSource.cloneWithRows(this.state.rawData.concat(data)),
          });

          console.log(this.state.rawData);
        })
        .catch(error => console.log(error));

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
        text: "#intelmark",
        text2: "",
        height: 0
      };
      this.addHash = this.addHash.bind(this);
    }

    addHash(hashTag){
      var textt = this.state.text;
      textt=textt+" "+hashTag;
      this.setState({text:textt});
    }

    writeToClipboard = async () => {
      await Clipboard.setString(this.state.text);
      alert('Copied to Clipboard!');
    };

    componentWillMount(){

      process.nextTick = setImmediate;

      var app = new Clarifai.App({
         apiKey: 'd2baff91fd7e4a6d9bb4ffb461e1faeb'
       });

       app.models.predict(Clarifai.GENERAL_MODEL, this.props.navigation.state.params.data.images.standard_resolution.url)
       .then(response =>  {
           //console.log(JSON.stringify(response.outputs[0].data.concepts, null, 2));
           this.setState({
             tags: response.outputs[0].data.concepts
           });

           console.log(this.state.tags);

           var c_tags = "";
           this.state.tags.map((item, index) =>
           (
               c_tags=c_tags+"#"+item.name.toLowerCase().replace(' ','_')+" "
           ))
           console.log(c_tags);
           this.setState({
             text2: c_tags
           })
         },
         function(err) {
           console.error(err);
           console.log("ERROR ERROR ERROR")
           }
         );

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
          <View style = {{height:'9%', backgroundColor: '#F9F9F9', justifyContent: 'center', alignItems: 'center',flexDirection: 'row'}} >
            <Text style = {{padding: 10, fontSize: 19, fontWeight: 'bold'}} >
              CAPTION
            </Text>
            <Avatar
              small
              rounded
              icon={{name: 'share'}}
              onPress={
                () =>
                  { this.writeToClipboard();
                    let ImgPath = this.props.navigation.state.params.data.images.filePath.url;
                    console.log("ImgPath: "+ImgPath);
                    CustomInstagramShare.shareWithInstagram(ImgPath.includes("file://")?ImgPath.replace('file://',''):ImgPath,function(result){
                      alert(result);
                    });
                  }

              }
              activeOpacity={0.1}
            />
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
            <HashTags
            screenProps={
              {
                text2: this.state.text2,
                addHash: this.addHash
              }
            }
            />
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

class ImgHash extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'AI',
  };

  constructor(props) {
    super(props);
    // Alert.alert(this.props.screenProps);
    this.state = {
      tags: '#'
    };
  }

  render() {
    return (
      <View style = {{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ScrollView>
          <List containerStyle={{marginBottom: 20}}>
            {
              (this.props.screenProps.text2).split(" ").map((l, i) => (
                <Badge key={i} onPress={() => this.props.screenProps.addHash(l)} value={l} />
              ))
            }
          </List>
        </ScrollView>
      </View>
    );
  }
}

class Related extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Related',
  };

  constructor(props) {
    super(props);
    // Alert.alert(this.props.screenProps);
    this.state = {
      text: '',
      tags: ''
    };
  }

  render() {
    return (
      <View style = {{flex: 1}}>
        <ScrollView>
        <TextInput style = {styles.input2}
          onChangeText={(text) => this.setState({text})}
          value={this.state.text}
          underlineColorAndroid="transparent"
        />

        <Button
          onPress={() => {
            fetch('https://d212rkvo8t62el.cloudfront.net/tag/'+this.state.text)
            .then((response) => response.json())
            .then((responseData) => {
              // console.log("related: "+JSON.stringify(responseData));
              var tags='';
              for(var i=0;i<responseData.results.length;i++){
                console.log(responseData.results[i].tag);
                tags=tags+'#'+responseData.results[i].tag+' ';
              }
              this.setState({tags:tags});
            });
          }}
          backgroundColor='#397af8'
          title="SEARCH" />
        <List containerStyle={{marginBottom: 20}}>
          {
            (this.state.tags).split(" ").map((l, i) => (
              <Badge key={i} onPress={() => this.props.screenProps.addHash(l)} value={l} containerStyle={{  }}/>
            ))
          }
        </List>
        </ScrollView>
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
  ImgHash: {
    screen: ImgHash,
  },
  Related: {
    screen: Related,
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
  input2: {
      margin: 15,
      height: 40,
      width: 300,
      borderWidth: 1,
  },


});


export default ModalStack
