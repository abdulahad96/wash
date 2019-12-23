// @flow
import { connect } from "react-redux";
import React, { Component } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
  Alert
} from "react-native";
import {logout as logout_request} from '../../actions/Login';
import Actions from "react-native-router-flux";
import { Metrics, Colors, Images } from "../../theme";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from '@react-native-community/async-storage';
import {updateUser,removeUser} from '../../actions/userAction';
import { request as get_wallet } from '../../actions/walletAction';
import {Logout} from '../../config/simpleApiCall'
import styles from "./styles";


class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAccountExpand: false,
      amount:0

    };
  }
 componentWillMount(){
  this.props.get_wallet({user_id:this.props.user.user.id,access_token:this.props.user.user.access_token})
  console.log("sasasasassssssssssssssssssssssss")
 }
  componentWillReceiveProps(nextProps){
    console.log("ye loe lo",nextProps,nextProps.wallet.isFetching,nextProps.wallet.data)
    if(
      !nextProps.wallet.failure &&
      !nextProps.wallet.isFetching &&
      nextProps.wallet.data){
        console.log("shabash")
        this.setState({amount:nextProps.wallet.data.data})
      }
  }
  removeAsyncUser = async ()=>{
    try {
      const value = await AsyncStorage.removeItem('@storage_Key')
      if (value !== null) {
        console.log("asasassa", JSON.parse(value))
      }
    } catch (e) {
      console.log(e)
      // error reading value
    }
  }
logout = ()=>{
  console.log("asa chinto")
  console.log(this.props.user.user.access_token)
  Logout({access_token:this.props.user.user.access_token}).then((response)=>{
    console.log(response)
    if(response.status==200){
      this.removeAsyncUser()
      this.props.removeUser()
      this.props.logout_request();
      Alert.alert('LOGOUT',response.data.message, [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ])
    }
  },(err)=>{
    // Alert.alert('Something Went Wrong',err.data.message, [
    //   { text: 'OK', onPress: () => console.log('OK Pressed') },
    // ])
    this.removeAsyncUser()
    this.props.removeUser()
    this.props.logout_request();
    console.log(err)}
  )
  
}
renderWallet = (title, onPress, icon,amount)=>{
  return (
    <TouchableOpacity style={[styles.listView]} onPress={onPress}>
      <Image source={icon} />

      <View
        style={{
          justifyContent: "center"
        }}
      >
        <Text style={[styles.listTitle]}>{title}</Text>
      </View>
     <View style={{backgroundColor:'#FFB0F0',padding:Metrics.ratio(8),borderRadius:Metrics.ratio(15),position:'absolute',right:2}}><Text style={{fontSize:Metrics.ratio(12),fontWeight:'bold',paddingHorizontal:10}}>{this.state.amount}</Text></View> 
    </TouchableOpacity>
  )
}
  renderList = (title, onPress, icon ) => {
    return (
      <TouchableOpacity style={[styles.listView]} onPress={onPress}>
        <Image source={icon} />

        <View
          style={{
            justifyContent: "center"
          }}
        >
          <Text style={[styles.listTitle]}>{title}</Text>
        </View>

      </TouchableOpacity>
    )
  }
  renderBody = () => {
    return (
      <View style={{ marginTop: Metrics.ratio(30), flex: 1 }}>
        <View>
        {this.renderWallet("WALLET",()=>{},Images.Wallet,100)}
          {this.renderList("ABOUT US" ,()=>{this.props.navigation.navigate('AboutScreen')},Images.Info)}
          
          {this.renderList("LOGOUT" ,this.logout,Images.Logout)}
          
        </View>
      </View>
    );
  };

  render() {
    const { appConfig } = this.props;

    return (
      <View style={styles.container}>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: Metrics.ratio(10) }}>
          <Image source={Images.logo}
            style={{
              width: Metrics.ratio(170),
              height: Metrics.ratio(54),
              marginBottom: Metrics.ratio(15)
            }}
            resizeMethod='auto'
            resizeMode='cover'
          />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.rowContainer}
        >

          {this.renderBody()}
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) =>  ({
  user: state.userReducer ? state.userReducer.user : null,
  wallet :state.wallet
})



const actions ={
    updateUser,
    removeUser,
    logout_request,
    get_wallet
  }

export default connect(
  mapStateToProps,
  actions
)(Sidebar);
