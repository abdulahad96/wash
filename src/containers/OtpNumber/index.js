// @flow
import { connect } from "react-redux";
import React, { Component } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
  BackHandler,Alert
} from "react-native";
import styles from "./styles";
import { Metrics, Images, Fonts } from "../../theme";
import Icon from "react-native-vector-icons/FontAwesome";
import { ResendCode } from '../../config/simpleApiCall';
import { Actions } from "react-native-router-flux";
import PhoneInput from 'react-native-phone-input'


class OtpnumberScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: null,
      numberErr:false,
      NumberValidation:'',
      countryCode: "",
      country:'us'


    };
  }
  componentDidMount() {
    console.log("add event listner");
    // BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
    let refObj = {...this.setPhoneRef}
    let countryCode = refObj && refObj.state && refObj.state.formattedNumber
    this.setState({countryCode: countryCode})
  }
  componentWillUnmount() {
    console.log("Remove event listner");
    // BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  }
  

 

  onChangeNumber = text => {
    console.log("number",text)
    this.setState({ number: text });
  };
  renderNumberInputfield = (headerText, placeholder, ErrTxt, Iserr, onChangeText, image, rightIcon, onRightIconClick) => {
    return (
      <View style={styles.inputFieldView}>
        <Text style={styles.inputFieldHeaderText}>{headerText}</Text>
        <View
          style={[{
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: Metrics.ratio(5),
            width: Metrics.screenWidth * 0.9,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: "#b4b4b4",
            marginBottom: Metrics.ratio(10)
          }, Platform.OS === "ios" && { marginVertical: Metrics.ratio(8) }]}
        >
          {/* <Image
            source={image}
            style={[{
              width: Metrics.ratio(20),
              height: Metrics.ratio(20),
              marginTop: Metrics.ratio(6)
            }, Platform.OS === "ios" && { marginBottom: Metrics.ratio(7) }]}
          /> */}
          {/* <Icon style={{}} size={25} color="#0f5997" name={"user"} /> */}
          {/* <TextInput
            style={styles.inputField}
            placeholderTextColor="#b4b4b4"
            placeholder={placeholder}
            keyboardType={'phone-pad'}
            onChangeText={text => {
              onChangeText(text);
            }}
          /> */}
          
          <PhoneInput 
          style={styles.inputField,{marginVertical:Metrics.ratio(10),color: "#b4b4b4"}}
          textStyle={{color: "#b4b4b4"}}
          textProps={{placeholder:placeholder}}
          ref= {(ref) => {
           
            this.setPhoneRef = ref
          }}
          onChangePhoneNumber={(country)=>{onChangeText(country) }}
          initialCountry={this.state.country}
       value = {this.state.countryCode}    
          onSelectCountry = {(country) => {
            console.log(this.setPhoneRef,'kkkkkkkkkkiiiiiiiiiiiiiii')
            console.log(country,'oooooooooooooooooo')
            this.setState({country:country})
            let refObj = {...this.setPhoneRef}
            let countryCode = refObj && refObj.state && refObj.state.formattedNumber
            this.setState({countryCode: countryCode})
          }}
          />
          {/* {rightIcon && <TouchableOpacity  style={{position:"absolute",right:Metrics.ratio(0)}} onPress={() => onRightIconClick()}>
            <Image source={this.state.showpassword ? Images.view : Images.hide} />
          </TouchableOpacity>} */}
        </View>
        {Iserr && <View><Text style={{ color: 'red' }} >*{ErrTxt}</Text></View>}
      </View>
    );
  };
 

  

  
  renderNumberPart = () => {
    return (
      <View>
        {this.renderNumberInputfield(
          "PHONE NO.",
          "Enter Number",
          "Valid number Required",
          this.state.numberErr,
          this.onChangeNumber,
          Images.phoneIcon
        )}

        <TouchableOpacity
          onPress={() => {
            // console.log("reset")
            const { number } = this.state
            if (!number || number.length < 8) {
              this.setState({ numberErr: true })
              setTimeout(() => {
                this.setState({ numberErr: false })
              }, 3000);
            }
            else {
            console.log("number")
           var data = {phone:number}
          ResendCode(data).then((response)=>{
            console.log(response)
            if(response.status == 200 && response.data && response.data.success){
              Alert.alert('SUCCESSFUL', response.data.message, [

                { text: 'Yes', onPress: () => {} },
              ]);
              Actions.OtpcodeScreen({
                id:response.data.data.id
               
              });

            }
          }).catch(err=>{
            console.log(err)
          })  
          
          }
            
            // this.handlehandleResetpassword();
          }}
          style={styles.submitButtonView}
        >

          <Text
            style={{
              color: "black",
              fontSize: Metrics.ratio(16),
              fontFamily: Fonts.type.demibold
            }}
          >
            SEND
            </Text>
        </TouchableOpacity>
      </View>
    )
  }
  render() {
    return (
      <ImageBackground
        source={Images.loginBackground}
        // resizeMode = 'contain'
        resizeMethod='auto'
        style={{ width: '100%', height: '100%' }}
      >
        <View style={styles.container}>

          <View style={styles.bodyView}>
          <View style = {{width: Metrics.screenWidth * 0.95, justifyContent: 'center', alignItems: 'center'}}>
         <Image
                  source={Images.logo}
                  style={{
                    width: Metrics.ratio(175),
                    height: Metrics.ratio(56),
                    marginBottom: Metrics.ratio(15)
                  }}
                 resizeMethod = 'auto'
                 resizeMode = 'cover'
                />
         </View>
            <View style={styles.headerView}>

              <Text style={styles.headerText}>VERIFY ACCOUNT</Text>


            </View>
            {this.renderNumberPart()}
            <View
              style={{
                flexDirection: "row",
                width: Metrics.screenWidth * 0.9,
                justifyContent: "center",
                marginTop: Metrics.ratio(20)
              }}
            >
              <Text
                style={{
                  fontSize: Metrics.ratio(11),
                  color: "black",
                  fontFamily: Fonts.type.demibold
                }}
              >
                DON'T HAVE ACCOUNT ?{" "}
              </Text>
              <TouchableOpacity
                onPress={() => {

                  this.props.navigation.navigate("registrationScreen", {
                    screen: "registrationScreen"
                  });

                }}
              >
                <Text
                  style={{
                    fontSize: Metrics.ratio(11),
                    color: "#0f5997",
                    fontFamily: Fonts.type.demibold
                  }}
                >
                  REGISTER{" "}
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: "row",
                width: Metrics.screenWidth * 0.9,
                justifyContent: "center",
                marginTop: Metrics.ratio(10)
              }}
            >
              <Text
                style={{
                  fontSize: Metrics.ratio(11),
                  color: "black",
                  fontFamily: Fonts.type.demibold
                }}
              >
                ALREADY HAVE AN ACCOUNT ?{" "}
              </Text>
              <TouchableOpacity
                onPress={() => {

                  this.props.navigation.pop()

                }}
              >
                <Text
                  style={{
                    fontSize: Metrics.ratio(11),
                    color: "#0f5997",
                    fontFamily: Fonts.type.demibold
                  }}
                >
                  SIGN IN{" "}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = () => ({});

const actions = {};

export default connect(
  mapStateToProps,
  actions
)(OtpnumberScreen);