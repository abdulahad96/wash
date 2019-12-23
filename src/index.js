import {Provider, connect} from 'react-redux';
import configureStore from './store';
import firebase from 'react-native-firebase';
import React, {Component} from 'react';
import Geolocation from '@react-native-community/geolocation';
import {updateUser, removeUser} from './actions/userAction';
import {
  Platform,
  StyleSheet,
  Text,
  ViewSafeAreaView,
  ScrollView,
  View,
  SafeAreaView,
  StatusBar,
  // AsyncStorage
} from 'react-native';
import RootRouter from './navigator/rootRouter';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import AsyncStorage from '@react-native-community/async-storage';

import SplashScreen from "react-native-splash-screen";

// Geolocation.setRNConfiguration();
// navigator.geolocation = require('@react-native-community/geolocation');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
    this.getData();
  }
  componentWillReceiveProps(nextprops) {
    this.getData();
  }
  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@storage_Key');
      if (value !== null) {
        var valu = JSON.parse(value);
      }
    } catch (e) {
      console.log(e);
      // error reading value
    }
  };
  componentDidMount() {
    this.getData();
    this.checkPermission();
    this.createNotificationListeners()
   
    // console.log(AsyncStorage.getItem('user'));
    // do stuff while splash screen is shown
    // After having done stuff (such as async tasks) hide the splash screen
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  }
  
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        this.getToken();
    } else {
        this.requestPermission();
    }
  }
  async createNotificationListeners() {
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    firebase.notifications().onNotification((notification) => {
        const { title, body } = notification;
        console.log('uuuuuuuuuuuuuuuuuuuuuuuu')
        let notification_to_be_displayed = new firebase.notifications.Notification({
          data: notification._android._notification._data,
          sound: 'default',
          show_in_foreground: true,
          title: title,
          body: body,
      });
      if (Platform.OS == 'android') {
        console.log('111111111111111111111')
          notification_to_be_displayed.android
              .setPriority(firebase.notifications.Android.Priority.High)
              .android.setChannelId('Default')
              .android.setVibrate(1000);
      }
      firebase.notifications().displayNotification(notification_to_be_displayed);
        // firebase.messaging().createLocalNotification({
        //   title: "My Notification Title",
        //   body: "My Notification Message",
        //   sound: "default",
        //   priority: "high",
        //   click_action: "ACTION",
        //   icon: "ic_launcher",
        //   show_in_foreground: true,
        // });

        console.log(notification)
    });
     ;
  }
  
    //3
  async getToken() {
    // let fcmToken = await AsyncStorage.getItem('fcmToken');
    
       const fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            // user has a device token
            console.log(fcmToken,"aaatoken")
            // await AsyncStorage.setItem('fcmToken', fcmToken);
        }
    
  }
  
    //2
  async requestPermission() {
    try {
        await firebase.messaging().requestPermission();
        // User has authorised
        this.getToken();
    } catch (error) {
        // User has rejected permissions
        console.log('permission rejected');
    }
  }
  render() {
    const store = configureStore();
    return (
      <>
        <Provider store={store}>
          <RootRouter />
        </Provider>
      </>
    );
  }
}

export default App;
