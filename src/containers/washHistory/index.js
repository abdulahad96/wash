// @flow
import { connect } from "react-redux";
import React, { Component } from "react";
import { Text, View, StyleSheet, TextInput, Image,ScrollView ,Alert} from "react-native";
import styles from "./styles";
import { Header } from "../../components";
import { Fonts, Metrics, Images } from "../../theme";
import {Actions} from 'react-native-router-flux';
import { request as Accepted_order_request } from '../../actions/acceptedOrder';
import SpinnerLoader from '../../components/spinner';
import moment from 'moment';
import firebase from 'react-native-firebase';
class WashhistoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: null,
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
        this.getData();
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
    var data = {
      access_token: this.props.user.user.access_token,
       user_id: this.props.user.user.id,
    
     }
     this.props.Accepted_order_request(data);
  };
  renderOverlaySpinner = () => {
    const {isloading} = this.state;
    return <SpinnerLoader isloading={isloading} />;
  };
renderOrder = order=>{
  console.log(order,"orders history")
  return (
    <View>
    {order.status == 7 && <View style={styles.statuscard}>
    {/* <View style={{flexDirection:'row'}}> */}
      <View style={styles.statusImg}>
        {order && order.user.details && order.user.details.image_url &&(
            <Image
              source={{uri: order.user.details.image_url}}
              style={styles.profileImg}
            />
          )}
       
        <View style={styles.userDetail}>
          <Text style={styles.userName}>{order.user.name}</Text>
          <Text style={styles.userEmail}>{order.user.email}</Text>
          <Text style={styles.userEmail}>
            {moment(order.created_at).format('DD-MM-YYYY')}
          </Text>
          {/* <Text style={styles.userEmail}>
            {moment(order.created_at).format('DD-MM-YYYY')}
          </Text> */}
        </View>
        {order && order.details && order.details.price && (
          <View style={styles.amount}>
            <Text
              style={{
                fontFamily: Fonts.type.demibold,
                fontSize: Metrics.ratio(18),
                color: 'black',
              }}>
             $ 
              
              {order &&
                order.details &&
                order.details.price &&
                order.details.price}
            </Text>
          </View>
        )}
        </View>
      {/* </View> */}
    </View>}

    </View>
  );
}
render() {
  const {orders} = this.state;
  console.log(orders, 'ooooooooooooooooooo hello');
  var data = []
  if(orders){
    orders.map((v,i)=>{
      console.log(v,'salam')
      if(v.status == 7){
        data.push(v)
      }
    })
    // setTimeout(() => {
    //   Alert.alert('Alert!','No Data In History', [
   
    //     { text: 'OK', onPress: () => console.log('OK Pressed') },
        
    //   ]);
    // }, 3000);
   
       }
  return (
    <View style={styles.container}>
      <Header
        headerText={'Wash History'}
        leftIcon={Images.LeftArrow}
        leftBtnPress={() => {
          Actions.pop();
        }}
        headerIconStyle={{marginLeft: Metrics.ratio(40)}}
        headerTextStyle={{marginLeft: Metrics.ratio(50)}}
      />
      <View  style={{marginBottom: Metrics.ratio(80)}}>
        <ScrollView >
          {orders && orders.map(order => this.renderOrder(order))}
          {orders && data.length == 0 && <View style={{justifyContent:'center',alignItems:"center",height:Metrics.screenHeight*0.5}}>
                <Text style={{fontSize:Metrics.ratio(20),color:'#097bed',fontWeight:'bold'}}>
                No Data Found
                </Text>
                </View>}
        </ScrollView>
      </View>
      {this.renderOverlaySpinner()}
    </View>
  );
}
}

const mapStateToProps = (state) => ({
  user: state.userReducer.user,
  acceptedOrder:state.acceptedOrder,

});

const actions = {
  Accepted_order_request
};
export default connect(
  mapStateToProps,
  actions
)(WashhistoryScreen);
