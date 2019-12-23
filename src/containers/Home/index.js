// @flow
import {connect} from 'react-redux';
import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Image,
  Alert,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import styles from './styles';
import {Header} from '../../components';
import {Fonts, Metrics, Images} from '../../theme';
import AsyncStorage from '@react-native-community/async-storage';
import DatePicker from 'react-native-datepicker';
import Geolocation from '@react-native-community/geolocation';
import {changeRole} from '../../config/simpleApiCall';
import { request as get_wallet } from '../../actions/walletAction';
import {updateUser, removeUser} from '../../actions/userAction';
import firebase from 'react-native-firebase';
class HeaderComponent extends Component {
  constructor(props) {
    super(props);
    this.state ={
      user:null
    }
  }
 

  render() {
    return (
      <ImageBackground
        source={Images.main}
        // resizeMode = 'contain'
        resizeMethod="auto"
        // resizeMethod = 'auto'
        resizeMode="cover"
        style={styles.headerbgimage}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.openDrawer();
            }}>
            <View
              style={[
                styles.menuIcon,
                Platform.OS === 'ios' && {marginTop: Metrics.ratio(30)},
              ]}>
              <Image source={Images.menu} />
            </View>
          </TouchableOpacity>

          <View
            style={{
              width: Metrics.screenWidth,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={styles.logoContainer}>
              <Image
                source={Images.logo}
                style={{
                  width: Metrics.ratio(186),
                  height: Metrics.ratio(59),
                  // marginBottom: Metrics.ratio(10),
                  alignContent: 'center',
                }}
                resizeMethod="auto"
                resizeMode="cover"
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }
}
class HomeCubes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cubes: [],
    };
  }
  
  componentDidMount() {
    this.setState({cubes: this.props.cubes});
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          marginTop: Metrics.ratio(10),
          marginBottom: Metrics.ratio(10),
        }}>
        <View style={styles.boxlistleft}>
          <View style={{flex: 1, flexDirection: 'column'}}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate(this.props.cubes[0].screen);
              }}>
              <View style={styles.boxleft}>
                <View style={styles.boxImgcontainer}>
                  <Image
                    style={styles.boxImage}
                    source={this.props.cubes[0].icon}
                  />
                </View>
                <View style={styles.boxTextcontainer}>
                  <Text style={styles.boxText}>{this.props.cubes[0].item}</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate(this.props.cubes[1].screen);
              }}>
              <View style={styles.boxleft}>
                <View style={styles.boxImgcontainer}>
                  <Image
                    style={styles.boxImage}
                    source={this.props.cubes[1].icon}
                  />
                </View>
                <View style={styles.boxTextcontainer}>
                  <Text style={styles.boxText}>{this.props.cubes[1].item}</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                // this.props.navigation.navigate(this.props.cubes[2].screen);
              }}>
              <View style={styles.boxleftEnd}>
                <View style={styles.boxImgcontainer}>
                  <Image
                    style={styles.boxImage}
                    source={this.props.cubes[2].icon}
                  />
                </View>
                <View style={styles.boxTextcontainer}>
                  <Text style={styles.boxText}>{this.props.cubes[2].item}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.boxlistright}>
          <View style={{flex: 1, flexDirection: 'column'}}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate(this.props.cubes[3].screen);
              }}>
              <View style={styles.boxright}>
                <View style={styles.boxImgcontainer}>
                  <Image
                    style={styles.boxImage}
                    source={this.props.cubes[3].icon}
                  />
                </View>
                <View style={styles.boxTextcontainer}>
                  <Text style={styles.boxText}>{this.props.cubes[3].item}</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate(this.props.cubes[4].screen);
              }}>
              <View style={styles.boxright}>
                <View style={styles.boxImgcontainer}>
                  <Image
                    style={styles.boxImage}
                    source={this.props.cubes[4].icon}
                  />
                </View>
                <View style={styles.boxTextcontainer}>
                  <Text style={styles.boxText}>{this.props.cubes[4].item}</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate(this.props.cubes[5].screen);
              }}>
              <View style={styles.boxrightEnd}>
                <View style={styles.boxImgcontainer}>
                  <Image
                    style={styles.boxImage}
                    source={this.props.cubes[5].icon}
                  />
                </View>
                <View style={styles.boxTextcontainer}>
                  <Text style={styles.boxText}>{this.props.cubes[5].item}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role:null,
      user:null
    };
  }
  componentDidMount(){
    console.log("userrrrrrrrrr",this.props.user)
     this.setState({user:this.props.user, role:this.props.user.user.role_id})
     this.props.get_wallet({user_id:this.props.user.user.id,access_token:this.props.user.user.access_token})
  }
  componentWillReceiveProps(nextProps){
    console.log("amount",nextProps.wallet)
    if(nextProps.user){
      console.log(nextProps)
      // this.setState({user:nextProps.user,role:nextProps.user.user.role_id})
    }
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
        console.log('badmash');
        this.props.get_wallet({user_id:this.props.user.user.id,access_token:this.props.user.user.access_token})
    });
      
  }
  

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@storage_Key');
      if (value !== null) {
        var valu = JSON.parse(value);
        // this.props.updateUser(valu);
      }
    } catch (e) {
      console.log(e);
    }
  };




  _storeUserdata = async user => {
    try {
      await AsyncStorage.setItem('@storage_Key', JSON.stringify(user));
      // this.props.updateUser(user)
    } catch (e) {
      // saving error
    }
  };

  onChangeUser = async () => {
    var user =this.props.user.user;
    var body= {user_id:this.props.user.user.id}
    var token = user.access_token;
    let role_id = null
    changeRole(body,token)
    .then((response)=>{

      if(response.data && response.data.success == true){
        if(user.role_id == 4){
          role_id = 5
          console.log(user)
        }
        else if(user.role_id == 5){
          role_id = 4
        }
        let obj = {role_id}
        user = {...user, ...obj}
        user = {user}
      console.log(user,'eeeeeeeeeeeeeeeeeeeetttttttttt')

        this._storeUserdata(user)
        this.props.updateUser(user)
      }
    }).catch(err=>{
      Alert.alert('Info!', 'Please Complete Your Pending Jobs To Switch The Role', [

                { text: 'OK', onPress: () => console.log('OK Pressed') },
              ])
      console.log(err)
    
    
    })

    // console.log(user,'userrrrrrrrrrrrrrrrrrrrrrrrr')
    // try{
    //  let response = await changeRole(body,token)
    //  console.log(response,'iiiiiiiiiiiiiiiiii')
    //  if(response.data && response.data.success == true){
     
    //  }
    // }
    // catch(err){
    //   console.log(err,'eeeeeeeeeeeeeee')
    // }
    // changeRole(body,token).then((response=>{
    //   console.log(response,'qqqqqqqqqqqqqqqqqqqq')
    //   if(response.data && response.data.succeess == true){
    //     Alert.alert('INFO!', 'Are You sure to use as washer ', [

    //       { text: 'OK', onPress: () => console.log('OK Pressed') },
    //     ]);
    //   }
    // })
    // ).catch((err)=>{
    //   console.log(err)
    // })
  
  }




  render() {
    console.log("role",this.state.role)
    const boxuser = [
      {item: 'Find a Wash Now', icon: Images.washing, screen: 'findwashScreen'},
      {
        item: 'Wash History',
        icon: Images.wash_history,
        screen: 'WasherhistoryScreen',
      },
      {item: 'Payment', icon: Images.payment, screen: 'PaymentScreen'},
      {
        item: 'Laundry Status',
        icon: Images.laudary_status,
        screen: 'userstatusScreen',
      },
      {
        item: 'Edit Profile',
        icon: Images.edit_profile,
        screen: 'ProfileScreen',
      },
      {
        item: 'Check Scholarships',
        icon: Images.scholarship,
        screen: 'scholarshipScreen',
      },
    ];
    const boxwasher = [
      {item: 'Find a Wash Now', icon: Images.washing, screen: 'FindOrderScreen'},
      {
        item: 'Wash History',
        icon: Images.wash_history,
        screen: 'WashhistoryScreen',
      },
      {item: 'Payment', icon: Images.payment, screen: 'findwashScreen'},
      {
        item: 'Laundry Status',
        icon: Images.laudary_status,
        screen: 'WashstatusScreen',
      },
      {
        item: 'Edit Profile',
        icon: Images.edit_profile,
        screen: 'ProfileScreen',
      },
      {
        item: 'Check Scholarships',
        icon: Images.scholarship,
        screen: 'scholarshipScreen',
      },
    ];

    return (
      <View style={styles.container}>
        <HeaderComponent {...this.props} />
        {/* <Header
          headerText={"ADD EMPLOYMENT"}
          leftIcon={"chevron-left"}
          leftBtnPress={() => { }}
          rightIcon={"plus"}
          rightBtnPress={() => {
            this.setState({ isAddAgency: true });
          }}
          rightIconStyle={{
            justifyContent: "center",
            alignItems: "center"
          }}
        /> */}
        {/* <View
          style={{
            width: Metrics.screenWidth * 0.95,
            marginLeft: Metrics.screenWidth * 0.025,
            borderRadius: Metrics.ratio(10),
            marginTop: Metrics.ratio(10),
            marginBottom: Metrics.ratio(10),
            paddingVertical: Metrics.ratio(20),
            backgroundColor: "white",
            elevation: 8
          }}
        >

        </View> */}
        <ScrollView
          keyboardShouldPersistTaps="always"
          style={{
            // marginBottom: Metrics.ratio(40)
            }}>
          {this.state.role === 4 && <HomeCubes {...this.props} cubes={boxuser} />}
          {this.state.role === 5 && <HomeCubes {...this.props} cubes={boxwasher} />}
          {this.state.role === 4 && <TouchableOpacity
            style={styles.customerButtonView}
            onPress={ () =>{
             this.onChangeUser()
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: Metrics.ratio(14),
                fontFamily: Fonts.type.demibold,
              }}>
              Be The Washer
            </Text>
          </TouchableOpacity>}
          {this.state.role === 5 &&<TouchableOpacity
            style={styles.customerButtonView}
            onPress={() =>{
              this.onChangeUser()
              // console.log(this.props.user,"user change")
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: Metrics.ratio(14),
                fontFamily: Fonts.type.demibold,
              }}>
              Be The Customer
            </Text>
          </TouchableOpacity>}
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: state.userReducer.user,
  wallet:state.wallet
});

const actions = {
  updateUser,
  removeUser,
  get_wallet
};
export default connect(
  mapStateToProps,
  actions,
)(HomeScreen);
