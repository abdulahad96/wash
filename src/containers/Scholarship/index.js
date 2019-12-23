// @flow
import { connect } from "react-redux";
import React, { Component } from "react";
import { Text, View, StyleSheet, TextInput, Image,ScrollView } from "react-native";
import styles from "./styles";
import { Header } from "../../components";
import { Fonts, Metrics, Images } from "../../theme";
import {Actions} from 'react-native-router-flux';
import { request as Accepted_order_request } from '../../actions/acceptedOrder';
import SpinnerLoader from '../../components/spinner';
import moment from 'moment';
import { Scholarships } from '../../config/simpleApiCall';
class scholarshipScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: null,
    };
  }


  componentWillReceiveProps(nextProps) {
   
    
  }

  componentWillMount() {
      this.setState({isloading:true});
    this.getData();
   
  }

  getData = async() => {
    var token = this.props.user.user.access_token;
    Scholarships(token).then((response)=>{
        console.log(response.data,"responsesssssssssssss");
        this.setState({orders:response.data.data,isloading:false});
    }).catch((err)=>{
        console.log(err);
        this.setState({isloading:false});
        
    }
    );

  };
  renderOverlaySpinner = () => {
    const {isloading} = this.state;
    return <SpinnerLoader isloading={isloading} />;
  };
renderOrder = order=>{
  
  return (
    <View>
    {<View style={styles.statuscard}>
      <View style={styles.statusImg}>
        
            <Image
              source={Images.scholarship}
              style={styles.profileImg}
            />
         
        {order && (<View style={styles.userDetail}>
          <Text style={styles.userName}>{order.name}</Text>
          <Text style={styles.userEmail}>$ {order.total_amount}</Text>
         
        </View>)}
      
          {/* <View style={styles.amount}>
            <Text
              style={{
                fontFamily: Fonts.type.demibold,
                fontSize: Metrics.ratio(18),
                color: 'black',
              }}>
             5000
              $
            </Text>
          </View> */}
       
      </View>
    </View>}
    </View>
  );
}
render() {
  const {orders} = this.state;
  console.log(orders, 'ooooooooooooooooooo');
  return (
    <View style={styles.container}>
      <Header
        headerText={'SCHOLARSHIPS'}
        leftIcon={Images.LeftArrow}
        leftBtnPress={() => {
          Actions.pop();
        }}
        headerIconStyle={{marginLeft: Metrics.ratio(30)}}
        headerTextStyle={{marginLeft: Metrics.ratio(40)}}
      />
      <View style={{marginBottom: Metrics.ratio(80)}}>
        <ScrollView >
        {orders && orders.map(order => this.renderOrder(order))}
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
)(scholarshipScreen);
