// @flow
import { connect } from 'react-redux';
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  Alert,
  TouchableOpacity
} from 'react-native';
import styles from './styles';
import { Header } from '../../components';
import { Fonts, Metrics, Images } from '../../theme';
import DatePicker from 'react-native-datepicker';
import { Actions } from 'react-native-router-flux';
import { request as get_wash_history } from '../../actions/WashHistoryAction';
import SpinnerLoader from '../../components/spinner';
import moment from 'moment';
import firebase from 'react-native-firebase';
import { request as get_wallet } from '../../actions/walletAction';
import { CancelOrder, checkcancel } from '../../config/simpleApiCall';
class UserStatusScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: null,
      isloading: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.washHistory) {
      console.log('if se pppppppppppppppp', nextProps.washHistory);
      if (
        !nextProps.washHistory.failure &&
        !nextProps.washHistory.isFetching &&
        nextProps.washHistory.data.data &&
        nextProps.washHistory.data.success === true
      ) {
        console.log(
          'if se bbbbbbbbbbbbbbbbbbbbbbb',
          nextProps.washHistory.data,
        );
        this.setState({ orders: nextProps.washHistory.data.data });
        this.setState({ isloading: false });
      }
    }
  }

  componentWillMount() {
    this.getData();
  }

  componentDidMount() {
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
      console.log(fcmToken, "aaatoken")
      // await AsyncStorage.setItem('fcmToken', fcmToken);
    }

  }


  renderOverlaySpinner = () => {
    const { isloading } = this.state;
    return <SpinnerLoader isloading={isloading} />;
  };
  getData = () => {
    const { user } = this.props;
    this.setState({ isloading: true })
    console.log(user);
    const data = { access_token: user.user.access_token };
    this.props.get_wash_history(data);
  };
  cancelJob = (orderdetail)=>{
    console.log(orderdetail,"aaaaaaaaaaaaaaaaaaaaaaaa")
    var data = {
        user_id:this.props.user.user.id,
        order_id:orderdetail.id
    }
console.log(orderdetail)
checkcancel(data,this.props.user.user.access_token).then((res)=>{
  console.log(res)
  if(res.data.data === true){
    var payload = { 
      user_id:this.props.user.user.id,
      washer_id:orderdetail.job.user.id,
order_id:orderdetail.id,deduction:1}
    Alert.alert('Alert',res.data.message, [

      { text: 'OK', onPress: () => {
          console.log(data)
          console.log(this.props.user.user.access_token)
          CancelOrder(payload,this.props.user.user.access_token).then((res)=>{
              console.log(res)
              if(res.status == 200 && res.data.success == true){
                this.getData()
                this.props.get_wallet({user_id:this.props.user.user.id,access_token:this.props.user.user.access_token})
                Alert.alert('Alert', 'Job Cancel Successfully', [
                    {text:'ok',onPress:()=>{console.log('ok')}}
                ]) 
              }
          }).catch((err)=>{
            console.log(err)
          })
      } },
      { text: 'Cancel', onPress: () => console.log('OK Pressed') },
    ]);
  }
  else{
    var payload = { 
      user_id:this.props.user.user.id,
      washer_id:orderdetail.job.user.id,
order_id:orderdetail.id,deduction:0}
    Alert.alert('Alert',"Are You Sure To Cancel The Order?", [

      { text: 'OK', onPress: () => {
          console.log(data)
          console.log(this.props.user.user.access_token)
          CancelOrder(payload,this.props.user.user.access_token).then((res)=>{
              console.log(res)
              if(res.status == 200 && res.data.success == true){
                this.getData()
                this.props.get_wallet({user_id:this.props.user.user.id,access_token:this.props.user.user.access_token})
                Alert.alert('Alert', 'Job Cancel Successfully', [
                    {text:'ok',onPress:()=>{console.log('ok')}}
                ]) 
              }
          }).catch((err)=>{
            console.log(err)
          })
      } },
      { text: 'Cancel', onPress: () => console.log('OK Pressed') },
    ]);
  }
}).catch((err)=>{
  console.log(err)
})
// Alert.alert('Alert', 'Are You Sure to Cancel This Job It Will Cost You $3 After 3 Minutes.', [

//       { text: 'OK', onPress: () => {
//           console.log(data)
//           console.log(this.props.user.user.access_token)
//           CancelOrder(data,this.props.user.user.access_token).then((res)=>{
//               console.log(res)
//               if(res.status == 200 && res.data.success == true){
//                 this.getData()
//                 this.props.get_wallet({user_id:this.props.user.user.id,access_token:this.props.user.user.access_token})
//                 Alert.alert('Alert', 'Job Cancel Successfully', [
//                     {text:'ok',onPress:()=>{console.log('ok')}}
//                 ]) 
//               }
//           }).catch((err)=>{
//             console.log(err)
//           })
//       } },
//       { text: 'Cancel', onPress: () => console.log('OK Pressed') },
//     ]);

}
  renderOrder = order => {
    console.log(order, "orderuser");
    return (
      <View>
        {order.status != 7 && order.status != 9 && <View style={styles.statuscard}>
          <View style={styles.statusHead}>
            <Text style={styles.statusHeadTxt}>Order Details</Text>
          </View>
          <View style={styles.statusImg}>
            {order && order.job && order.job.user && order.job.user.details && order.job.user.details.image_url && (
              <Image
                source={{ uri: order.job.user.details.image_url }}
                style={styles.profileImg}
              />
            )}
            {order && order.job && order.job.user && <View style={styles.userDetail}>
              <Text style={styles.userName}>{order.job.user.name}</Text>
              <Text style={styles.userEmail}>{order.job.user.email}</Text>
            </View>}
          </View>
          <View style={styles.statusBody}>
            <View style={styles.bodyTxt}>
              <Text style={styles.bodyHeading}>No. of bags</Text>
              <Text style={styles.bodyFree}></Text>
              {order && order.details && order.details.no_bags && (
                <Text style={styles.bodyProp}> :{order.details.no_bags}</Text>
              )}
            </View>
            <View style={styles.bodyTxt}>
              <Text style={styles.bodyHeading}>Student Using Own Detergents</Text>
              <Text style={styles.bodyFree}>($0.50 Per Bag)</Text>
              {order.details.detergent == 0 && (
                <Text style={styles.bodyProp}> : no</Text>
              )}
              {order && order.details && order.details.detergent && (
                <Text style={styles.bodyProp}> : yes</Text>
              )}
            </View>
            <View style={styles.bodyTxt}>
              <Text style={styles.bodyHeading}>Folded</Text>
              <Text style={styles.bodyFree}>(free)</Text>
              {order.details.folded == 0 && (
                <Text style={styles.bodyProp}> : no</Text>
              )}
              {order && order.details && order.details.folded && (
                <Text style={styles.bodyProp}> : yes</Text>
              )}
            </View>
            <View style={styles.bodyTxt}>
              <Text style={styles.bodyHeading}>Hung</Text>
              <Text style={styles.bodyFree}>(free)</Text>
              {order.details.hung == 0 && (
                <Text style={styles.bodyProp}> : no</Text>
              )}
              {order && order.details && order.details.hung && (
                <Text style={styles.bodyProp}> : yes</Text>
              )}
            </View>
            <View style={styles.bodyTxt}>
              <Text style={styles.bodyHeading}>Special Instructions</Text>
              <Text style={styles.bodyFree}> : </Text>
              {order && order.details && order.details.instruction && (
                <Text style={styles.bodyProp,{width:Metrics.screenWidth*0.5}} >{order.details.instruction}</Text>
              )}
            </View>
            <View style={styles.bodyTxt}>
              <Text style={styles.bodyHeading}>Status</Text>
              <Text style={styles.bodyFree}></Text>
              {order.status == 0 && (
                <Text style={styles.bodyProp}> : New</Text>
              )}
              {order.status == 1 && (
                <Text style={styles.bodyProp}> : Accepted</Text>
              )}
              {order.status == 2 && (
                <Text style={styles.bodyProp}> : Pick up</Text>
              )}

              {order.status == 3 && (
                <Text style={styles.bodyProp}> : It is in wash </Text>
              )}
              {order.status == 4 && (
                <Text style={styles.bodyProp}> : It is in Dryer</Text>
              )}
              {order.status == 5 && (
                <Text style={styles.bodyProp}> : Folding</Text>
              )}
              {order.status == 6 && (
                <Text style={styles.bodyProp}> : On way to Drop Off</Text>
              )}
            </View>
            <View style={{ alignContent: "center", alignItems: "center" }}>
            {order.status == 1 && (<TouchableOpacity style={styles.submitButtonView}
              onPress={() => {this.cancelJob(order) }}
            >
              <Text
                style={{
                  fontSize: Metrics.ratio(13),
                  color: "black",
                  fontFamily: Fonts.type.demibold
                }}
              >
               Cancel
              </Text>
            </TouchableOpacity>)}
          </View>
        
          </View>
        </View>}
      </View>
    );
  };
  render() {
    const { orders } = this.state;
    var data = []
    
    console.log(orders,"oooooooooooooooooooooooo")
    if (orders ) {
      orders.map((v,i)=>{
        console.log(v,'salam')
        if(v.status != 7 && v.status != 9){
          data.push(v)
        }
      })
      console.log(data,"data")
      // setTimeout(() => {
      //   Alert.alert('Alert!', 'No Pending Orders', [

      //     { text: 'OK', onPress: () => console.log('OK Pressed') },

      //   ]);
      // }, 3000);

    }
    return (
      <View style={styles.container}>
        <Header
          headerText={'LAUNDRY STATUS'}
          leftIcon={Images.LeftArrow}
          leftBtnPress={() => this.props.navigation.navigate('dashboard')}
          headerIconStyle={{ marginLeft: Metrics.ratio(20) }}
          headerTextStyle={{ marginLeft: Metrics.ratio(25) }}
        />
        <View>
          <ScrollView style={{ marginBottom: Metrics.ratio(80) }}>
            {orders && orders.map(order => this.renderOrder(order))}
            {orders && data.length == 0 && <View style={{ justifyContent: 'center', alignItems: "center", height: Metrics.screenHeight * 0.5 }}>
              <Text style={{ fontSize: Metrics.ratio(20), color: '#097bed', fontWeight: 'bold' }}>
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

const mapStateToProps = state => ({
  user: state.userReducer.user,
  washHistory: state.washHistory,
});

const actions = { get_wash_history,get_wallet };

export default connect(
  mapStateToProps,
  actions,
)(UserStatusScreen);
