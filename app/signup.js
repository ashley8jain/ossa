import React from 'react';
import {
  View,
  Image,
  Keyboard
} from 'react-native';
import {
  RkButton,
  RkText,
  RkTextInput,
  RkStyleSheet,
  RkTheme,
  RkAvoidKeyboard
} from 'react-native-ui-kitten';
// import {GradientButton} from '../../components/';
import { Button } from 'react-native-elements'
import {scale, scaleModerate, scaleVertical} from './utils/scale';

class SignUp extends React.Component {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }

  render() {
    let renderIcon = () => {
      return <Image style={styles.image} source={require('./assets/images/logo.png')}/>;
    };
    // console.log("props nav: "+JSON.stringify(this.props.navigation));
    return (
      <RkAvoidKeyboard
        style={styles.screen}
        onStartShouldSetResponder={ (e) => true}
        onResponderRelease={ (e) => Keyboard.dismiss()}>
        <View style={{alignItems: 'center'}}>
          {renderIcon()}
          <RkText rkType='h1'>Registration</RkText>
        </View>
        <View style={styles.content}>
          <View>
            <RkTextInput rkType='rounded' placeholder='Name'/>
            <RkTextInput rkType='rounded' placeholder='Email' value={this.state.email}
            onChangeText={(text) => this.setState({email: text})}/>
            <RkTextInput rkType='rounded' placeholder='Password' secureTextEntry={true} value={this.state.password}
            onChangeText={(text) => this.setState({password: text})}/>
            <RkTextInput rkType='rounded' placeholder='Confirm Password' secureTextEntry={true}/>
            <Button
              raised
              onPress={async () =>
                { 
                  await this.props.navigation.state.params.signupp(this.state.email,this.state.password);
                  this.props.navigation.goBack();
                }
              }
              title="SIGN UP"
              backgroundColor= {RkTheme.current.colors.primary}/>
          </View>
          <View style={styles.footer}>
            <View style={styles.textRow}>
              <RkText rkType='primary3'>Already have an account?</RkText>
              <RkButton rkType='clear'  onPress={() => this.props.navigation.goBack()}>
                <RkText rkType='header6'> Sign in now </RkText>
              </RkButton>
            </View>
          </View>
        </View>
      </RkAvoidKeyboard>
    )
  }
}

let styles = RkStyleSheet.create(theme => ({
  screen: {
    padding: 16,
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: theme.colors.screen.base
  },
  image: {
    marginBottom: 10,
    height:scaleVertical(77),
    resizeMode:'contain'
  },
  content: {
    justifyContent: 'space-between'
  },
  save: {
    marginVertical: 20
  },
  buttons: {
    flexDirection: 'row',
    marginBottom: 24,
    marginHorizontal: 24,
    justifyContent: 'space-around'
  },
  footer:{
    justifyContent:'flex-end'
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
}));

export default SignUp;
