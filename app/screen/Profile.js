import React,{ Component } from 'react'
import {ScrollView,Text,View,StyleSheet} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Button,Card } from 'react-native-elements'
import {
  RkText,
  RkTextInput,
  RkAvoidKeyboard,
  RkTheme,
  RkStyleSheet
} from 'react-native-ui-kitten';
import {SocialSetting} from '../components';
import {FontAwesome} from '../assets/icons';
import {Avatar} from '../components';
// import {GradientButton} from '../components';


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
        loaded: true,
        firstName: 'Firebase',
        lastName: 'Firebase',
        email: 'Firebase@google.com',
        country: 'India',
        phone: '91xxx',
        password: '',
        newPassword: '',
        confirmPassword: '',
        twitter: true,
        google: false,
        facebook: false
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
        <ScrollView style={styles.root}>
          <RkAvoidKeyboard>
            <View style={styles.header}>
              <Avatar img={{uri: this.state.profile_img}} rkType='big'/>
            </View>

            <View style={styles.section}>
              <View style={[styles.row, styles.heading]}>
                <RkText rkType='header6 primary'>INFO</RkText>
              </View>
              <View style={styles.row}>
                <RkTextInput label='First Name'
                             value={this.state.firstName}
                             rkType='right clear'
                             onChangeText={(text) => this.setState({firstName: text})}/>
              </View>
              <View style={styles.row}>
                <RkTextInput label='Last Name'
                             value={this.state.lastName}
                             onChangeText={(text) => this.setState({lastName: text})}
                             rkType='right clear'/>
              </View>
              <View style={styles.row}>
                <RkTextInput label='Email'
                             value={this.props.screenProps.email}
                             onChangeText={(text) => this.setState({email: text})}
                             rkType='right clear'/>
              </View>
              <View style={styles.row}>
                <RkTextInput label='Country'
                             value={this.state.country}
                             onChangeText={(text) => this.setState({country: text})}
                             rkType='right clear'/>
              </View>
              <View style={styles.row}>
                <RkTextInput label='Phone'
                             value={this.state.phone}
                             onChangeText={(text) => this.setState({phone: text})}
                             rkType='right clear'/>
              </View>
              <Button
                raised
                onPress={() => console.log("save")}
                title="SAVE"
                backgroundColor= {RkTheme.current.colors.primary}/>
            </View>
            <View style={styles.section}>
              <View style={[styles.row, styles.heading]}>
                <RkText rkType='primary header6'>CHANGE PASSWORD</RkText>
              </View>
              <View style={styles.row}>
                <RkTextInput label='Old Password'
                             value={this.state.password}
                             rkType='right clear'
                             secureTextEntry={true}
                             onChangeText={(text) => this.setState({password: text})}/>
              </View>
              <View style={styles.row}>
                <RkTextInput label='New Password'
                             value={this.state.newPassword}
                             rkType='right clear'
                             secureTextEntry={true}
                             onChangeText={(text) => this.setState({newPassword: text})}/>
              </View>
              <View style={styles.row}>
                <RkTextInput label='Confirm Password'
                             value={this.state.confirmPassword}
                             rkType='right clear'
                             secureTextEntry={true}
                             onChangeText={(text) => this.setState({confirmPassword: text})}/>
              </View>
              <Button
                raised
                onPress={() => console.log("password changed")}
                title="Change"
                backgroundColor= {RkTheme.current.colors.primary}/>
            </View>

            <View style={styles.section}>
              <View style={[styles.row, styles.heading]}>
                <RkText rkType='primary header6'>CONNECT YOUR ACCOUNT</RkText>
              </View>
              <View style={styles.row}>
                <SocialSetting name='Twitter' icon={FontAwesome.twitter} tintColor={RkTheme.current.colors.twitter}/>
              </View>
              <View style={styles.row}>
                <SocialSetting name='Google' icon={FontAwesome.google} tintColor={RkTheme.current.colors.google}/>
              </View>
              <View style={styles.row}>
                <SocialSetting name='Facebook' icon={FontAwesome.facebook} tintColor={RkTheme.current.colors.facebook} selected={true}/>
              </View>
              <View style={styles.row}>
                <SocialSetting name='Instagram' icon={FontAwesome.instagram} tintColor={RkTheme.current.colors.instagram} selected={true}/>
              </View>
            </View>
            <Card
              containerStyle={{marginBottom: 10}}
              title={this.state.full_name}>
              <View>
                <Text>
                Email: {this.props.screenProps.email}
                </Text>
                <Text>
                Username: {this.state.user_name}
                </Text>
                <Text>
                Posts: {this.state.media_count}
                </Text>
                <Text>
                Followers: {this.state.followed_by}
                </Text>
                <Text>
                Following: {this.state.follows}
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
            </RkAvoidKeyboard>
        </ScrollView>
      );
    }



  }
}

let styles = RkStyleSheet.create(theme => ({
  section: {
    marginVertical: 25
  },
  heading: {
    paddingBottom: 12.5
  },
  header: {
    backgroundColor: theme.colors.screen.neutral,
    paddingVertical: 25
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 17.5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border.base,
    alignItems: 'center'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }
}));
