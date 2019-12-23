// @flow
import { connect } from "react-redux";
import React, { Component } from "react";
import { Text, View, StyleSheet, TextInput, Image,ScrollView ,Alert,TouchableOpacity} from "react-native";
import styles from "./styles";
import { Header } from "../../components";
import { Fonts, Metrics, Images } from "../../theme";
import {Actions} from 'react-native-router-flux';
import { request as Accepted_order_request } from '../../actions/acceptedOrder';
import SpinnerLoader from '../../components/spinner';
import moment from 'moment';
import firebase from 'react-native-firebase';
import { reportProblem } from '../../config/simpleApiCall';
class Reportscreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: null,
      string:null
    };
  }

  
  componentWillReceiveProps(nextProps) {
    console.log("nextprops====<",nextProps.acceptedOrder)
    if (nextProps.acceptedOrder) {
      if (
        !nextProps.acceptedOrder.failure &&
        !nextProps.acceptedOrder.isFetching &&
        nextProps.acceptedOrder.data.data &&
        nextProps.acceptedOrder.data.success === true
      ) {
        console.log("nextprops====<",nextProps.acceptedOrder)
        this.setState({orders: nextProps.acceptedOrder.data.data});
        this.setState({isloading: false});
      }
    }
  }

  componentWillMount() {
    this.getData();
  }
  componentDidMount(){
    this.checkPermission();
    this.createNotificationListeners()
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
        // this.getData();
    });
      
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
  


  
  getData = () => {
    // var data = {
    //   access_token: this.props.user.user.access_token,
    //    user_id: this.props.user.user.id,
    
    //  }
    //  this.props.Accepted_order_request(data);
    this.setState({orders:this.props.order})
    console.log(this.props.order)
  };
  renderOverlaySpinner = () => {
    const {isloading} = this.state;
    return <SpinnerLoader isloading={isloading} />;
  };
  renderInputArea = (
    headerText,
    placeholder,
    ErrTxt,
    Iserr,
    onChangeText,
    image,
  ) => {
    return (
      <View style={{marginLeft:Metrics.ratio(10),marginTop:Metrics.ratio(10)}}>
        <Text style={styles.inputareaHeaderText}>{headerText}</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: Metrics.ratio(5),
            width: Metrics.screenWidth * 0.9,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: '#b4b4b4',
            marginBottom: Metrics.ratio(10),
          }}>
          <TextInput
            style={styles.inputareaField}
            multiline = {true}
            numberOfLines = {4}
            placeholderTextColor="#b4b4b4"
            // secureTextEntry={rightIcon ? this.state.showpassword : false}
            placeholder={placeholder}
            // defaultValue={placeholder}
            onChangeText={text => {
              this.setState({string:text})
            }}
          />
        </View>
        {Iserr && (
          <View>
            <Text style={{color: 'red'}}>**{ErrTxt}</Text>
          </View>
        )}
      </View>
    );
  };
  onchangeBio = (e)=>{
      this.setState({string:e})
  }
render() {
  const {orders} = this.state;
 console.log(orders)
    // setTimeout(() => {
    //   Alert.alert('Alert!','No Data In History', [
   
    //     { text: 'OK', onPress: () => console.log('OK Pressed') },
        
    //   ]);
    // }, 3000);
   
    //    }
  return (
    <View style={styles.container}>
      <Header
        headerText={'REPORT A PROBLEM'}
        leftIcon={Images.LeftArrow}
        leftBtnPress={() => {
          Actions.pop();
        }}
        headerIconStyle={{marginLeft: Metrics.ratio(20)}}
        headerTextStyle={{marginLeft: Metrics.ratio(30)}}
      />
      <View  style={{marginBottom: Metrics.ratio(80)}}>
        <ScrollView>
        <View style={styles.statuscard}>
        {orders.job && orders.job && orders.job.user.details && orders.job.user.details.image_url &&(
              <Image
                source={{uri: orders.job.user.details.image_url}}
                style={styles.profileImg}
              />
            )}
          <View style={styles.userDetail}>
            <Text style={styles.userName}>{orders.job.user.name}</Text>
            <Text style={styles.userEmail}>{orders.job.user.email}</Text>
            <Text style={styles.userEmail}>
             {moment(orders.created_at).format('DD-MM-YYYY')}
            </Text>
          </View>
          {this.renderInputArea(
              'REPORT',
             "Report A Problem",
              'Required',
              false,
              this.onchangeString,
            )}
                          <TouchableOpacity
                onPress={() => {
                    console.log(orders)
                 var data = {order_id: orders.job.order_id,
                 reported_from: this.props.user.user.id,
                 reported_to:orders.job.user.id,
                 reason: this.state.string,
                 status: true
                }
                 console.log(data)
                 
                 if(!this.state.string || this.state.string == "" || this.state.string == " ")
                 {
                    Alert.alert('Alert!','Empty Report Box', [
   
                            { text: 'OK', onPress: () => console.log('OK Pressed') },
                            
                          ]);
                 }
                 else{
                    this.setState({isloading:true})
                 reportProblem(data,this.props.user.user.access_token).then((res)=>{
                     console.log(res,'res')
                    this.setState({isloading:false})
                    Actions.pop()
                 }).catch((err)=>{
                    console.log(err,"errro")
                    this.setState({isloading:false})
                    Actions.pop()
                 })
                }
                }}
                style={styles.submitButtonView}>
                {/* <Image
              source={Images.submitButtonIcon}
              style={{
                width: Metrics.ratio(20),
                height: Metrics.ratio(20),
                marginRight: Metrics.ratio(5),
                marginTop: Metrics.ratio(3)
              }}
            /> */}
                <Text
                  style={{
                    color: 'black',
                    fontSize: Metrics.ratio(16),
                    fontFamily: Fonts.type.demibold,
                  }}>
                  SUBMIT
                </Text>
              </TouchableOpacity>
        </View>
        </ScrollView>
      </View>
      {this.renderOverlaySpinner()}
    </View>
  );
}
}


const mapStateToProps = (state) => ({
  user: state.userReducer.user,
//   acceptedOrder:state.acceptedOrder,

});

const actions = {
//   Accepted_order_request
};
export default connect(
  mapStateToProps,
  actions
)(Reportscreen);
