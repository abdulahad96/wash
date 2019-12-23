// @flow
import { connect } from "react-redux";
import React, { Component } from "react";
import { Text, View, StyleSheet, TextInput, Image, TouchableOpacity, ScrollView,Alert, BackHandler } from "react-native";
import styles from "./styles";
import { Header } from "../../components";
import { Fonts, Metrics, Images } from "../../theme";
import { request as get_order_request } from '../../actions/getOrders';
import { request as Accept_order_request } from '../../actions/acceptJob';
import StarRating from 'react-native-star-rating';
import Geolocation from '@react-native-community/geolocation';
import SpinnerLoader from '../../components/spinner';
import { Actions } from 'react-native-router-flux';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import { CancelOrder } from '../../config/simpleApiCall';
class StatusScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            starCount: 5,
            Pendingorders: [{}],
            currentLocation: null,
            isloading: false,
            order: null,
            scrollUp: false,
        };
    }
    componentWillMount() {
        console.log('add event listner',this.props.type);
        this.setState({order:this.props.order})
        // geoloca


    }
    componentWillReceiveProps(nextProps) {
        console.log(nextProps.accept_order, "getooooooooooooooooooooooooooo")
        // console.log(nextProps.accept_order,"acccepted");

    }
    renderOverlaySpinner = () => {
        const { isloading } = this.state;
        return <SpinnerLoader isloading={isloading} />;
    };
    renderLoaderSpinner = () => {
        const { scrollUp } = this.state;
        return <View style={{ height: Metrics.screenHeight * 0.10, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ textAlign: "center", marginTop: Metrics.ratio(10) }}>Please wait ..........</Text>
            <Image style={{ width: 50, height: 50 }} source={Images.loader} />
        </View>;
    };
   
    runagain = () => {
        console.log("run chalaya")
        this.props.getAcceptedOrder()
    }
    cancelJob = (orderdetail)=>{
        var data = {
            user_id:this.props.user.user.id,
            order_id:orderdetail.id
        }
console.log(orderdetail)
Alert.alert('Alert', 'Are You Sure to Cancel This Job.', [

          { text: 'OK', onPress: () => {
              console.log(data)
              console.log(this.props.user.user.access_token)
              CancelOrder(data,this.props.user.user.access_token).then((res)=>{
                  console.log(res)
                  if(res.status == 200 && res.data.success == true){
                    this.props.getAcceptedOrder()
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

    renderOrder = (order) => {
        console.log(this.props.user)
        console.log(order)
        return (

            <View style={styles.statuscard}>
                <View style={styles.statusHead}>
                    <Text style={styles.statusHeadTxt}>ORDER</Text>
                </View>
                <TouchableOpacity onPress={()=>{
                Actions.ChangestatusScreen({
                    
                 order:{order:order,type:this.props.type},
                 getAcceptedOrder:()=>{this.props.getAcceptedOrder()},
               
                  
                  });
                
                // this.props.navigation.navigate('ChangestatusScreen')
                }}>
                <View style={styles.statusImg}>
                    {order.user && order.user.details &&(<Image source={{uri:order.user.details.image_url}} style={styles.profileImg} />)}
                    <View style={styles.userDetail}>
                 <Text style={styles.userName}>{order.user.name}</Text>
                        <Text style={styles.userEmail}>{order.user.email}</Text>
                    </View>
                </View>

            

                <View style={styles.statusBody}>

                    <View style={styles.bodyTxt}>
                        <Text style={styles.bodyHeading}>No. of bags</Text>
                        <Text style={styles.bodyFree}></Text>
                        {order.details && order.details.no_bags && (<Text style={styles.bodyProp}> :{order.details.no_bags}</Text>)}
                    </View>
                    <View style={styles.bodyTxt}>
                        <Text style={styles.bodyHeading}>Student Using Own Detergents</Text>
                        <Text style={styles.bodyFree}></Text>
                        {order.details.detergent==true && <Text style={styles.bodyProp}> : Yes</Text>}
                        {order.details.detergent==false && <Text style={styles.bodyProp}> : No</Text>}
                        {/* {order.details && order.details.detergent === true && (<Text style={styles.bodyProp}> : Yes</Text>)} */}
                        {/* {order.details && order.details.detergent === false && (<Text style={styles.bodyProp}> : No</Text>)} */}
                    </View>
                    <View style={styles.bodyTxt}>
                        <Text style={styles.bodyHeading}>Folded</Text>
                        <Text style={styles.bodyFree}>(free)</Text>
                        {/* <Text style={styles.bodyProp}> : Yes</Text> */}
                        {order.details && order.details.folded === true && (<Text style={styles.bodyProp}> : Yes</Text>)}
                    {order.details && order.details.folded === false && (<Text style={styles.bodyProp}> : No</Text>)}
                    </View>
                    <View style={styles.bodyTxt}>
                        <Text style={styles.bodyHeading}>Hung</Text>
                        <Text style={styles.bodyFree}>(free)</Text>
                        {/* <Text style={styles.bodyProp}> : Yes</Text> */}
                        {order.details && order.details.hung === true && (<Text style={styles.bodyProp}> : Yes</Text>)}
                    {order.details && order.details.hung === false && (<Text style={styles.bodyProp}> : No</Text>)}
                    </View>
                    <View style={styles.bodyTxt}>
                        <Text style={styles.bodyHeading}>Special Instruction</Text>
                        <Text> : </Text>
                        {/* <Text style={styles.bodyProp }>please wash as soon as poosible beacause i want to go in a party to night thanks in advance</Text> */}
                        {order.details && order.details.instruction && (<Text style={styles.bodyProp}> {order.details.instruction}</Text>)}
                    </View>



                </View>
                </TouchableOpacity>
          {this.props.type == "new" && <View style={{ alignContent: "center", alignItems: "center" }}>
            <TouchableOpacity style={styles.submitButtonView}
              onPress={() => {this.cancelJob(order)}}
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
            </TouchableOpacity>
          </View>}
            </View >

          
        )
    }
    render() {
        // this.props.getAcceptedOrder()
 
        const {order} = this.state;
        // if(order.length === 0){
        //     Alert.alert('SUCCESSFUL','no data', [

        //         { text: 'OK', onPress: () => console.log('OK Pressed') },
                
        //       ]);
        // }
        console.log(order,'ordersssssssssssssssss')
        return (
            <View style={styles.container}>
                <ScrollView
                    style={{ marginBottom: Metrics.ratio(140) }}>
                    <View>
                        {/* {o this.renderOrder()} */}
            {order && order.map(orders => this.renderOrder(orders))}
            {order && order.length == 0 && <View style={{justifyContent:'center',alignItems:"center",height:Metrics.screenHeight*0.5}}>
                <Text style={{fontSize:Metrics.ratio(20),color:'#097bed',fontWeight:'bold'}}>
                No Data Found
                </Text>
                </View>}
          
                    </View>
                </ScrollView>
                {this.renderOverlaySpinner()}
            </View>
        );
    }
}
const mapStateToProps = state => ({
    user: state.userReducer.user,
    // order: state.getorder,
    // accept_order: state.acceptorder
});

const actions = {
    // get_order_request,
    // Accept_order_request
};

export default connect(
    mapStateToProps,
    actions
)(StatusScreen);
