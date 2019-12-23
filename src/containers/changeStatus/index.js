// @flow
import { connect } from "react-redux";
import React, { Component } from "react";
import { Text, View, StyleSheet, TextInput, Image, TouchableOpacity, ScrollView, Linking,Platform } from "react-native";
import styles from "./styles";
import { Header } from "../../components";
import { Fonts, Metrics, Images } from "../../theme";
import { Actions } from 'react-native-router-flux';
import { request as update_order_request } from '../../actions/updateOrder';
import SpinnerLoader from '../../components/spinner';
import moment from 'moment';
import Geolocation from '@react-native-community/geolocation';
import { thisTypeAnnotation } from "@babel/types";


class ChangestatusScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: null,
            isloading: false,
            showdropDown: false,
            statusName: null,
            latitude:null,
            longitude:null


        };
    }
    componentDidMount() {
        // console.log(this.props.type,"types")
        // if(this.props.order.status === 1){
        //     this.setState({statusName:'SELECT ANY'})
        // }
        // else if(this.props.order.status === 2){
        //     this.setState({statusName:'ON WAY FOR PICK UP'})
        // }
        // else if(this.props.order.status === 3){
        //     this.setState({statusName:'IT IS IN THE WASH'})
        // }
        // else if(this.props.order.status === 4){
        //     this.setState({statusName:'IT IS IN THE DRYER'})
        // }
        // else if(this.props.order.status === 5){
        //     this.setState({statusName:'FOLDING YOUR LAUNDRY NOW'})
        // }
        // else if(this.props.order.status === 6){
        //     this.setState({statusName:'ON MY WAY FOR DROP OFF'})
        // }
        // this.setState({orders:this.props.order})

    }
    setInitialCoordinates = () => {
        Geolocation.getCurrentPosition(async info => {
       
       
       
        this.setState({ 
            latitude:info.coords.latitude,
            longitude:info.coords.longitude
        })  
        },err=>console.log(err));
      };
    componentWillReceiveProps(nextProps) {
        console.log("aaaaaaaaaaaaaaaaaaaa",nextProps.updateOrder)
        if (nextProps.updateOrder) {
            if (
              !nextProps.updateOrder.failure &&
              !nextProps.updateOrder.isFetching &&
              nextProps.updateOrder.data.data &&
              nextProps.updateOrder.data.success === true
            ) {

              this.setState({isloading: false});
            //   this.props.again

              Actions.pop();
              this.props.getAcceptedOrder()
            }
            else{
                this.setState({isloading: false});
            }

    }
}

    componentWillMount() {
        // this.getData();
        this.setInitialCoordinates();
        console.log(this.props.order.type,"types")
        console.log(this.props.order)
        if (this.props.order.order.status === 1) {
            this.setState({ statusName: 'SELECT ANY' })
        }
        else if (this.props.order.order.status === 2) {
            this.setState({ statusName: 'ON WAY FOR PICK UP' })
        }
        else if (this.props.order.order.status === 3) {
            this.setState({ statusName: 'IT IS IN THE WASH' })
        }
        else if (this.props.order.order.status === 4) {
            this.setState({ statusName: 'IT IS IN THE DRYER' })
        }
        else if (this.props.order.order.status === 5) {
            this.setState({ statusName: 'FOLDING YOUR LAUNDRY NOW' })
        }
        else if (this.props.order.order.status === 6) {
            this.setState({ statusName: 'ON MY WAY FOR DROP OFF' })
        }
        this.setState({ orders: this.props.order.order })
    }
    openGps = (lat, lng) => {
        const {latitude,longitude} =this.state
        console.log("cooooooooooooooooooord ",this.state.latitude,this.state.longitude)
        // var iosUrl = `maps://app?saddr=100+101&daddr=100+102` 
        // var scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
        // var url = `google.navigation:q=24.9344795,67.0301765`;
        // var url =  `geo:24.9344795,67.0301765:q=${lat},${lng}`
        // Linking.openURL(url);
//         const latitude = "40.7127753";
// const longitude = "-74.0059728";
const label = `${lat},${lng}`;
// const label = '24.9344795,67.0301765'

const url = Platform.select({
//   ios: "maps:" + latitude + "," + longitude + "?q=" + label,
  ios: `https://www.google.com/maps/search/?api=1&query=${label}&center=${latitude},${longitude}`,
  android: "geo:" + latitude + "," + longitude + "?q=" + label
});

Linking.canOpenURL(url).then(supported => {
  if (supported) {
    return Linking.openURL(url);
  } else {
    browser_url =
      "https://www.google.de/maps/@" +
      latitude +
      "," +
      longitude +
      "?q=" +
      label;
    return Linking.openURL(browser_url);
  }
});
      }
    renderDropDownList = (txt, value, id) => {
        return (
            <TouchableOpacity onPress={() => {
                var data = {
                    user_id: this.props.user.user.id,
                    access_token: this.props.user.user.access_token,
                    orderid:id,
                    status:value
                };
              
                this.props.update_order_request(data)
                
                // this.props.again()
                this.setState({isloading:true})
            }}>
                <View style={styles.dropdownList}>

                    <Text style={styles.dropDownbodyListTxt}>
                        {txt}
                    </Text>

                </View>
            </TouchableOpacity>
        )
    }

    renderOrder = order => {
        console.log(order)

        return (
            <ScrollView>
                <View style={styles.statuscard}>
                    <ScrollView></ScrollView>
                    <View style={styles.ProfileImgContainer}>
                        {order.user && order.user.details && order.user.details.image_url && (<Image
                            source={{ uri: order.user.details.image_url }}
                            style={styles.profileImg}
                        />)}
                    </View>


                    <View style={styles.UserName}>
                        {order.user && <Text style={styles.userName}>{order.user.name}</Text>}
                        {order.user && <Text style={styles.userEmail}>{order.user.email}</Text>}
                    </View>
                    <View style={styles.statusBody}>
                        <View style={{ flexDirection: "row" }}>
                            <View style={{ width: Metrics.screenWidth * 0.45 }}>
                                <View style={styles.bodyTxt}>
                                    <Text style={styles.bodyHeading}>No. of bags</Text>
                                    <Text style={styles.bodyFree}></Text>
                                    {order.details && order.details.no_bags && (<Text style={styles.bodyProp}> :{order.details.no_bags}</Text>)}
                                </View>
                                <View style={styles.bodyTxt}>
                                    <Text style={styles.bodyHeading}>Folded</Text>
                                    <Text style={styles.bodyFree}>(free)</Text>
                                    {order.details && order.details.folded === true && (<Text style={styles.bodyProp}> : Yes</Text>)}
                                    {order.details && order.details.folded === false && (<Text style={styles.bodyProp}> : No</Text>)}
                                </View>
                                {/* <View style={styles.bodyTxt}>
                                    <Text style={styles.bodyHeading}>Washer setting</Text>
                                    <Text style={styles.bodyFree}></Text>
                                    <Text style={styles.bodyProp}> </Text>
                                </View> */}
                            </View>
                            <View style={{ width: Metrics.screenWidth * 0.45 }}>
                                <View style={styles.bodyTxt}>
                                    <Text style={styles.bodyHeading}>Using Own Detergent</Text>
                                    <Text style={styles.bodyFree}></Text>
                                    {order.details.detergent == true && <Text style={styles.bodyProp}> : Yes</Text>}
                                    {order.details.detergent == false && <Text style={styles.bodyProp}> : No</Text>}
                                </View>

                                <View style={styles.bodyTxt}>
                                    <Text style={styles.bodyHeading}>Hung</Text>
                                    <Text style={styles.bodyFree}>(free)</Text>
                                    {order.details && order.details.hung === true && (<Text style={styles.bodyProp}> : Yes</Text>)}
                                    {order.details && order.details.hung === false && (<Text style={styles.bodyProp}> : No</Text>)}
                                </View>

                                {/* <View style={styles.bodyTxt}>
                                    <Text style={styles.bodyHeading}>Dryer Setting</Text>
                                    <Text style={styles.bodyFree}></Text>
                                    <Text style={styles.bodyProp}> : </Text>
                                </View> */}
                            </View>
                        </View>
                        <View style={{ marginTop: Metrics.ratio(20) }}>
                            <View style={styles.bodyTxt, { flexDirection: 'column' }}>
                                <Text style={{
                                    fontFamily: Fonts.type.demibold,
                                    fontSize: Metrics.ratio(16)
                                }}>Special Instructions</Text>
                                {/* <Text style={styles.bodyProp}> {order.details.instruction}</Text>)} */}
                                {order.details && order.details.instruction && (<Text style={{ fontSize: Metrics.ratio(13), fontFamily: Fonts.type.regular }} > {order.details.instruction}</Text>)}
                            </View>
                        </View>
                        <View style={styles.dropDown}>
                            <TouchableOpacity onPress={() => {
                                if (this.state.showdropDown === true) {
                                    this.setState({ showdropDown: false })
                                }
                                else {
                                    this.setState({ showdropDown: true })
                                }
                            }}>
                                <View style={styles.dropDownheading}>

                                    <Text style={styles.dropDownheadingTxt}>
                                        {this.state.statusName}
                                    </Text>

                                    {this.state.showdropDown == false && <Image style={{ marginTop: Metrics.ratio(15) }} source={Images.Downarrow} />}
                                    {this.state.showdropDown == true && <Image style={{ marginTop: Metrics.ratio(15) }} source={Images.Uparrow} />}
                                </View>
                            </TouchableOpacity>


                            {this.state.showdropDown == true && <View style={styles.dropDownBody}>

                                {this.renderDropDownList("ON MY WAY TO PICK UP", 2, order.id)}
                                {this.renderDropDownList("IT IS IN THE WASH", 3, order.id)}
                                {this.renderDropDownList("IT IS IN THE DRYER", 4, order.id)}
                                {this.renderDropDownList("FOLDING YOUR LAUNDRY NOW", 5, order.id)}
                                {this.renderDropDownList("ON MY WAY FOR DROP OFF", 6, order.id)}
                                {this.renderDropDownList("COMPLETED", 7,order.id)}


                            </View>
                            }
                        </View>

                        <View style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            alignSelf: "center",
                            marginTop: Metrics.ratio(25),
                            alignContent: 'center',
                        }}>
                            <TouchableOpacity onPress={() => {
                                Linking.openURL(`tel:${Number(order.user.details.phone)}`);
                            }}>
                                <View style={{ marginRight: Metrics.ratio(15), backgroundColor: '#89f4ff', paddingHorizontal: Metrics.ratio(15), paddingVertical: Metrics.ratio(15), borderRadius: 50 }}>
                                    <Image source={Images.Phonecall} />
                                </View>
                            </TouchableOpacity>
                            {this.props.order.type == 'new' &&<TouchableOpacity onPress={() => {
                                // Actions.pickupScreen({
                                //     latitude: order.up_latitude,
                                //     longitude: order.up_longitude,
                                //     place:order.pick_up,
                                //     header: " LOCATION"

                                // });
                                this.openGps(order.up_latitude,order.up_longitude)
                            }}>
                                <View style={{ backgroundColor: '#89f4ff', paddingHorizontal: Metrics.ratio(15), paddingVertical: Metrics.ratio(15), borderRadius: 50 }}>
                                    <Image source={Images.Marker} />
                                </View>
                            </TouchableOpacity>}
                            {this.props.order.type != 'new' &&<TouchableOpacity onPress={() => {
                                // Actions.pickupScreen({
                                //     latitude: order.down_latitude,
                                //     longitude: order.down_longitude,
                                //     place:order.pick_up,
                                //     header: " LOCATION"

                                // });
                                this.openGps(order.down_latitude,order.down_longitude)
                            }}>
                                <View style={{ backgroundColor: '#89f4ff', paddingHorizontal: Metrics.ratio(15), paddingVertical: Metrics.ratio(15), borderRadius: 50 }}>
                                    <Image source={Images.Marker} />
                                </View>
                            </TouchableOpacity>}
                        </View>
                    </View>
                </View>
            </ScrollView>
        )
    }
    renderOverlaySpinner = () => {
        const { isloading } = this.state;
        return <SpinnerLoader isloading={isloading} />;
      };
    render() {
        console.log(this.props.getAcceptedOrder,'888888888888')
        return (
            <View style={styles.container}>
                <Header
                    headerText={"LAUNDRY STATUS"}
                    leftIcon={Images.LeftArrow}
                    leftBtnPress={() => {Actions.pop() }}

                />
                <View>

                    {this.renderOrder(this.state.orders)}

                </View>
                {this.renderOverlaySpinner()}
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.userReducer.user,
    updateOrder: state.updateOrder
});

const actions = {
    update_order_request
};

export default connect(
    mapStateToProps,
    actions
)(ChangestatusScreen);
