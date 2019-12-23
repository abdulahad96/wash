// @flow
import {connect} from 'react-redux';
import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import styles from './styles';
import {Header} from '../../components';
import {Fonts, Metrics, Images} from '../../theme';
import DatePicker from 'react-native-datepicker';
import {Actions} from 'react-native-router-flux';
import {request as get_wash_history} from '../../actions/WashHistoryAction';
import SpinnerLoader from '../../components/spinner';
import moment from 'moment';
import firebase from 'react-native-firebase';
class WasherhistoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: null,
      isloading:false,
    };
  }
componentDidMount(){
  this.checkPermission();
  this.createNotificationListeners()
}
  componentWillReceiveProps(nextProps) {
    console.log(nextProps,"saaaaaaaaaaaaaaaaaaaaaaaa")
    if (nextProps.washHistory) {
      if (
        !nextProps.washHistory.failure &&
        !nextProps.washHistory.isFetching &&
        nextProps.washHistory.data.data &&
        nextProps.washHistory.data.success === true
      ) {
        this.setState({orders: nextProps.washHistory.data.data});
        this.setState({isloading: false});
      }
    }
  }

  componentWillMount() {
    this.getData();

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
        console.log('badmash')
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
  


  renderOverlaySpinner = () => {
    const {isloading} = this.state;
    return <SpinnerLoader isloading={isloading} />;
  };
  getData = () => {
    this.setState({isloading:true});
    const {user} = this.props;
    console.log("uessaassas",user)
    const data = {access_token: user.user.access_token};
    this.props.get_wash_history(data);
  };
  renderOrder = order => {
    // console.log(order, 'jjjjjjjjjjjjasasasasjjkkkkkkkkkkkkkkkkk');
    return (
      <View>
      {(order.status == 7 || order.status == 9) && <View style={styles.statuscard}>
        <View style={styles.statusImg}>
        
          {order.job && order.job && order.job.user.details && order.job.user.details.image_url &&(
              <Image
                source={{uri: order.job.user.details.image_url}}
                style={styles.profileImg}
              />
            )}
          <View style={styles.userDetail}>
            <Text style={styles.userName}>{order.job.user.name}</Text>
            <Text style={styles.userEmail}>{order.job.user.email}</Text>
            <Text style={styles.userEmail}>
             {moment(order.created_at).format('DD-MM-YYYY')}
            </Text>
            {order.status == 7 && <Text style={styles.userEmail}>
             Completed
            </Text>}
            {order.status == 9 && <Text style={styles.userEmail}>
             Canceled
            </Text>}
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
            {order.status == 7 && <TouchableOpacity
                onPress={() => {
                  Actions.Reportscreen({
                    order:order
                  })
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
                    color: 'blue',
                    fontSize: Metrics.ratio(16),
                    fontFamily: Fonts.type.demibold,
                    borderBottomWidth:Metrics.ratio(1),
                    borderBottomColor:'blue'
                  }}>
                  Report A Problem
                </Text>
              </TouchableOpacity>}
      </View>}

      </View>
    );
  };
  render() {
    const {orders} = this.state;
    console.log(orders, 'ooooooooooooooooooo hello ');
    var data = []
    if(orders){
      orders.map((v,i)=>{
        console.log(v,'salam')
        if(v.status == 7 || v.status == 9){
          data.push(v)
        }
      })}
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
        <View style={{marginBottom: Metrics.ratio(80)}}>
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

const mapStateToProps = state => ({
  user: state.userReducer.user,
  washHistory: state.washHistory,
});

const actions = {get_wash_history};

export default connect(
  mapStateToProps,
  actions,
)(WasherhistoryScreen);
