import React from 'react';
import {
  View,
  Image,
  Dimensions,
  Keyboard
} from 'react-native';
import {
  RkButton,
  RkText,
  RkTextInput,
  RkAvoidKeyboard,
  RkStyleSheet,
  RkTheme
} from 'react-native-ui-kitten';
import { Button } from 'react-native-elements'
import {FontAwesome} from './assets/icons';
// import {GradientButton} from './components/gradientButton';
import {scale, scaleModerate, scaleVertical} from './utils/scale';

import signup from './signup'
import { StackNavigator } from 'react-navigation';

import {bootstrap} from './config/bootstrap';

bootstrap();

class LoginV extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
  }

  _renderImage() {
    let contentHeight = scaleModerate(375, 1);
    let height = Dimensions.get('window').height - contentHeight;
    let width = Dimensions.get('window').width;

    image = (<Image style={[styles.image, {height, width}]}
                    source={require('./assets/images/backgroundLoginV1.png')}/>);

    return image;
  }

  render() {
    let image = this._renderImage();

    return (
      <RkAvoidKeyboard
        onStartShouldSetResponder={ (e) => true}
        onResponderRelease={ (e) => Keyboard.dismiss()}
        style={styles.screen}>
        {image}
        <View style={styles.container}>
          <View style={styles.buttons}>
            <RkButton style={styles.button} rkType='social'>
              <RkText rkType='awesome hero primary'>{FontAwesome.twitter}</RkText>
            </RkButton>
            <RkButton style={styles.button} rkType='social'>
              <RkText rkType='awesome hero primary'>{FontAwesome.google}</RkText>
            </RkButton>
            <RkButton style={styles.button} rkType='social'>
              <RkText rkType='awesome hero primary'>{FontAwesome.facebook}</RkText>
            </RkButton>
          </View>
          <RkTextInput rkType='rounded' placeholder='Username'/>
          <RkTextInput rkType='rounded' placeholder='Password' secureTextEntry={true}/>
          <Button
            raised
            onPress={() => console.log("login")}
            title="LOGIN"
            backgroundColor= {RkTheme.current.colors.primary}/>
          <View style={styles.footer}>
            <View style={styles.textRow}>
              <RkText rkType='primary3'>Don’t have an account?</RkText>
              <RkButton rkType='clear'>
                <RkText rkType='header6' onPress={() => this.props.navigation.navigate('Signup')}> Sign up now </RkText>
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
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.colors.screen.base
  },
  image: {
    resizeMode: 'cover',
    marginBottom: scaleVertical(10),
  },
  container: {
    paddingHorizontal: 17,
    paddingBottom: scaleVertical(22),
    alignItems: 'center',
    flex: -1
  },
  footer: {
    justifyContent: 'flex-end',
    flex: 1
  },
  buttons: {
    flexDirection: 'row',
    marginBottom: scaleVertical(24)
  },
  button: {
    marginHorizontal: 14
  },
  save: {
    marginVertical: 9
  },
  textRow: {
    justifyContent: 'center',
    flexDirection: 'row',
  }
}));

const LoginStack = StackNavigator({
  Login: {
      screen: LoginV
  },
  Signup: {
    screen: signup
  },

});

export default LoginStack;
