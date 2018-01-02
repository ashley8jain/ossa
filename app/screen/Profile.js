import React,{ Component } from 'react'
import {Text,View,StyleSheet} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Button,Card,Avatar } from 'react-native-elements'


export default class FifthScreen extends Component {
  static navigationOptions = {
    tabBarLabel: "Fifth",
    tabBarIcon: () => <Icon size={24} color="white" name="people-outline" />
  }

  constructor(props) {
    super(props);
    // Alert.alert(this.props.screenProps);
    this.state = {
      loaded: false,
    };

    fetch('https://api.instagram.com/v1/users/self/?access_token='+this.props.screenProps.instaToken)
    .then((response)=>response.json())
    .then((response)=>{
      this.setState({
        user_name: response.data.username,
        profile_img: response.data.profile_picture,
        full_name: response.data.full_name,
        follows: response.data.counts.follows,
        followed_by: response.data.counts.followed_by,
        media_count: response.data.counts.media,
        is_business: response.data.is_business,
        loaded: true
      });

    });
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
    else{
      return(
        <View style={styles.container}>
          <Avatar
            xlarge
            rounded
            source={{uri: this.state.profile_img}}
            onPress={() => console.log("Works!")}
            activeOpacity={0.7}
          />
          <Card
            containerStyle={{marginBottom: 10}}
            title={this.state.full_name}>
            <View>
              <Text>
              posts: {this.state.media_count}
              </Text>
              <Text>
              followers: {this.state.followed_by}
              </Text>
              <Text>
              following: {this.state.follows}
              </Text>
              <Text>
              Account type: {this.state.is_business?"Business":"Normal"}
              </Text>
            </View>

          </Card>
          <Button
            raised
            onPress={() => this.props.screenProps.logoutFunc()}
            title="LOGOUT"
            backgroundColor='#397af8' />
        </View>
      );
    }



  }
}

const styles = StyleSheet.create ({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
