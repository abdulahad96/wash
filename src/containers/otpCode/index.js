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
  Alert,
  BackHandler,
} from "react-native";
import styles from "./styles";
import { Metrics, Images, Fonts } from "../../theme";
import Icon from "react-native-vector-icons/FontAwesome";
import { VerifyOtp } from '../../config/simpleApiCall';
import { Actions } from "react-native-router-flux";


class OtpcodeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: '',
      numberErr:false,
      NumberValidation:''


    };
  }
  componentDidMount() {
    console.log("add event listner");
    // BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
  }
  componentWillUnmount() {
    console.log("Remove event listner");
    // BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
  }
  

 

  onChangeNumber = text => {
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
          <Image
            source={image}
            style={[{
              width: Metrics.ratio(20),
              height: Metrics.ratio(20),
              marginTop: Metrics.ratio(6)
            }, Platform.OS === "ios" && { marginBottom: Metrics.ratio(7) }]}
          />
          {/* <Icon style={{}} size={25} color="#0f5997" name={"user"} /> */}
          <TextInput
            style={styles.inputField}
            placeholderTextColor="#b4b4b4"
            placeholder={placeholder}
            keyboardType={'numeric'}
            onChangeText={text => {
              onChangeText(text);
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
          "OTP CODE",
          "Enter 4 Digit Code",
          "Valid Code Required",
          this.state.numberErr,
          this.onChangeNumber,
          Images.phoneIcon
        )}

        <TouchableOpacity
          onPress={() => {
            var data = {code:this.state.number,id:this.props.id}
            VerifyOtp(data).then((response)=>{
              console.log(response,'aaaaaaaaaaaaaa')
              if(response.status === 200 && response.data){
                Alert.alert('SUCCESSFUL', response.data.message, [

                  { text: 'OK', onPress: () => console.log('OK Pressed') },
                ]);
               Actions.loginScreen()
              }
            }).catch(err=>{
              console.log(err)
              Alert.alert('Failed', err.data.message, [

                { text: 'OK', onPress: () => console.log('OK Pressed') },
              ]);
            })
           
            
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
            VERIFY
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

              <Text style={styles.headerText}>VERIFY CODE</Text>


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
)(OtpcodeScreen);