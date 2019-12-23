// @flow

import React, { Component } from "react";

import { View, Text, Dimensions, Platform, AsyncStorage } from "react-native";
// import  from 'redux-storage-engine-reactnativeasyncstorage';
import { connect } from "react-redux";
import * as storage from "redux-storage";
import DashboardScreen from "../containers/Dashboard";
import { Colors, Metrics, Images } from "../theme";
import styles from "./styles";
import RegistrationScreen from "../containers/Registration";
import RegistrationwasherScreen from "../containers/washerRegister";
import LoginScreen from "../containers/Login";
import PasswordresetScreen from '../containers/resetPassword';
import OtpnumberScreen from '../containers/OtpNumber';
import OtpcodeScreen from '../containers/otpCode';
import { Stack, Scene, Router, Actions, Tabs } from "react-native-router-flux";

function onBackPress() {
  console.log(storage);
  const scene = Actions.currentScene;
}

// const stackNavigator = 

class Rootnavigator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    }
  }
  componentDidMount() {
    console.log("userrrrrrrrrrrrrrrrr", this.state.user);
  }
  render() {

    return (

      <Router>

        <Stack
          titleStyle={styles.title}
          headerStyle={styles.header}
          key="root"
          tintColor={Colors.primary}

        >
               <Scene
            hideNavBar
            headerStyle={styles.header}
            titleStyle={[styles.title, { width: Metrics.screenWidth }]}
            tintColor="white"
            title={"LoginScreen"}
            key="loginScreen"
            component={LoginScreen}
            renderLeftButton={
              () => { }
              //<TabButtonLeft imagesArray={["rightArrow"]} actions={[Actions.pop]} />
            }
          />
         
          <Scene
            hideNavBar
            headerStyle={styles.header}
            titleStyle={[styles.title, { width: Metrics.screenWidth }]}
            tintColor="white"
            title={"OtpnumberScreen"}
            key="OtpnumberScreen"
            component={OtpnumberScreen}
            renderLeftButton={
              () => { }
              //<TabButtonLeft imagesArray={["rightArrow"]} actions={[Actions.pop]} />
            }
          />
          <Scene
            hideNavBar
            headerStyle={styles.header}
            titleStyle={[styles.title, { width: Metrics.screenWidth }]}
            tintColor="white"
            title={"OtpcodeScreen"}
            key="OtpcodeScreen"
            component={OtpcodeScreen}
            renderLeftButton={
              () => { }
              //<TabButtonLeft imagesArray={["rightArrow"]} actions={[Actions.pop]} />
            }
          />

     
          <Scene
            hideNavBar
            headerStyle={styles.header}
            titleStyle={[styles.title, { width: Metrics.screenWidth }]}
            tintColor="white"
            title={"RegistrationScreen"}
            key="registrationScreen"
            component={RegistrationScreen}
            renderLeftButton={
              () => { }
              //<TabButtonLeft imagesArray={["rightArrow"]} actions={[Actions.pop]} />
            }
          />
          <Scene
            hideNavBar
            headerStyle={styles.header}
            titleStyle={[styles.title, { width: Metrics.screenWidth }]}
            tintColor="white"
            title={"RegistrationwasherScreen"}
            key="registrationwasherScreen"
            component={RegistrationwasherScreen}
            renderLeftButton={
              () => { }
              //<TabButtonLeft imagesArray={["rightArrow"]} actions={[Actions.pop]} />
            }
          />
          <Scene
            hideNavBar
            headerStyle={styles.header}
            titleStyle={[styles.title, { width: Metrics.screenWidth }]}
            tintColor="white"
            title={"PasswordScreen"}
            key="passwordScreen"
            component={PasswordresetScreen}
            renderLeftButton={
              () => { }
              //<TabButtonLeft imagesArray={["rightArrow"]} actions={[Actions.pop]} />
            }
          />
          {/* <Scene
            hideNavBar
            headerStyle={styles.header}
            titleStyle={[styles.title, { width: Metrics.screenWidth }]}
            tintColor="white"
            title={"LoginScreen"}
            key="loginScreen"
            component={LoginScreen}
            renderLeftButton={
              () => { }
              //<TabButtonLeft imagesArray={["rightArrow"]} actions={[Actions.pop]} />
            }
          /> */}




        </Stack>
      </Router>
    )
  }
}
// export default () => (
//   <AppNavigator backAndroidHandler={onBackPress} navigator={navigator} />
// );

export default Rootnavigator;
// const Navigator = connect()(Router);
