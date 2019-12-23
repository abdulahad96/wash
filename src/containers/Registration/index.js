// @flow
import { connect } from "react-redux";
import React, { Component } from "react";
import { Actions } from 'react-native-router-flux';
import moment from "moment";

import {
  Text,
  View,
  TextInput,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableHighlight,
  Alert,
  Platform
} from "react-native";
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import DatePicker from "react-native-datepicker";
import styles from "./styles";
import Icon from "react-native-vector-icons/FontAwesome";
import { Images, Metrics, Colors, Fonts } from "../../theme";
import { request as register_request } from '../../actions/RegisterAction';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import SpinnerLoader from '../../components/spinner';
import { Getuniversity } from '../../config/simpleApiCall';
import RNPickerSelect from 'react-native-picker-select';
import { GetPages } from '../../config/simpleApiCall';
import firebase from 'react-native-firebase';
import PhoneInput from 'react-native-phone-input'

class RegistrationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      showSignButton: false,
      modalVisible: false,
      startDate: false,
      isloading: false,
      f_name: '',
      l_name: '',
      fnameErr: false,
      lnameErr: false,
      email: '',
      password: '',
      universities: [],
      confirmpassword: '',
      Dob: null,
      role: '4',
      name: null,
      gender: '',
      mobile: null,
      university: '',
      device_token: '',
      device_type: '',
      Extension: '',
      extensionErr: false,
      erroroccur: false,
      onAddUni: false,
      selectedUni: null,
      nameErr: false,
      emailErr: false,
      passwordErr: false,
      cPasswordErr: false,
      dobErr: false,
      roleErr: false,
      genderErr: false,
      mobileErr: false,
      unversityErr: false,
      countryCode: "",
      country:'us'
    };
  }
  renderModal = () => {
    return (

      <View style={{ marginTop: 22, backgroundColor: 'transparent' }}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            // Alert.alert('Modal has been closed.');
          }}>
          <View style={{ marginTop: 22 }}>
            <View>

             
            </View>
            <View style={{ marginTop: Metrics.ratio(30) }}>
              <Text style={{ fontSize: Metrics.ratio(24), textAlign: 'center' }}>Terms and Conditions</Text>

              {this.state.message && <Text style={{ width: Metrics.screenWidth * 0.9, textAlign: 'center', justifyContent: 'center', alignSelf: 'center', fontSize: Metrics.ratio(14), marginTop: Metrics.ratio(10) }}>
                {this.state.message.content}
              </Text>}
            </View>
            <View style={{width:Metrics.screenWidth * 0.9,marginHorizontal:Metrics.screenWidth*0.05,flexDirection:'row'}}>
            <TouchableOpacity style={styles.AcceptButtonView} onPress={() => this.setState({modalVisible: false,showSignButton:true})}>

              <Text
                style={{
                  color: "black",
                  fontSize: Metrics.ratio(14),
                  fontFamily: Fonts.type.demibold
                }}
              >
                I Agree
            </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.cancelButtonView}
                onPress={() => {
                  this.setState({ modalVisible: false });
                }}>
                <Text >Cancel</Text>
              </TouchableOpacity>
              </View>
          </View>
        </Modal>


      </View>

    )
  }
  componentDidMount() {
    //  console.log(Platform);
    this.gettoken();
    this.getData()
    this.setState({ device_type: Platform.OS });
    Getuniversity().then(response => {
      console.log(response)
      if (response.status === 200 && response.data && response.data.success == true && response.data.data) {
        console.log(response.data.data)
        var data = response.data.data;
        var array = [];
        data.map((v, i) => {
          var data = { label: v.name, value: v.id }
          array.push(data);
          console.log("asasasas", v)
        })
        this.setState({ universities: array })
      }
    });
    let refObj = {...this.setPhoneRef}
    let countryCode = refObj && refObj.state && refObj.state.formattedNumber
    this.setState({countryCode: countryCode})
//    // this.getpermission();
  }
  getpermission = () => {
    firebase
      .messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
          this.gettoken();
        } else {
          // user doesn't have permission
        }
      });
  };

  gettoken = async () => {
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      console.log(fcmToken,'toooooooo')
      this.setState({device_token: fcmToken});
    }
  };
  getData = () => {
    GetPages().then(response => {
      console.log(response)
      this.setState({ message: response.data.data[0] })
    }).catch(error => {
      console.log(error)
    })
  };
  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
    if (nextProps.register) {
      this.setState({ isloading: false })
      if (
        !nextProps.register.failure &&
        !nextProps.register.isFetching &&
        nextProps.register.data.data &&
        nextProps.register.data.data.user.access_token
      ) {
        Actions.OtpcodeScreen({
          id: nextProps.register.data.data.user.id

        });
        // console.log("hello")
        // Alert.alert('SUCCESSFUL', 'Successfully Registered ', [

        //   { text: 'OK', onPress: () => console.log('OK Pressed') },
        // ]);
        // this.props.navigation.pop();
      }
    }
  }
  renderOverlaySpinner = () => {
    const { isloading } = this.state;
    return <SpinnerLoader isloading={isloading} />;
  };

  onChangeFirstName = (e) => {
    this.setState({ f_name: e })
    this.setState({ name: this.state.f_name + " " + this.state.l_name });
  };
  onChangeLastName = (e) => {
    this.setState({ l_name: e })
    this.setState({ name: this.state.f_name + " " + this.state.l_name });
  }

  onChangeNumber = (e) => {
    console.log(e,'phone number')
    this.setState({ mobile: e });
  };
  onChangeEmail = (e) => {
    this.setState({ email: e });
  };
  onChangePassword = (e) => {
    this.setState({ password: e });
  };

  onChangeConfirmPassword = (e) => {
    this.setState({ confirmpassword: e });
  };
  onchangeDob = (e) => {
    // alert(e)
    this.setState({ Dob: e });

  };
  onchangeRole = (e) => {
    this.setState({ role: e });
  }
  onchangeGender = (e) => {
    this.setState({ gender: e });
  }

  onchangeUniversity = (e) => {
    this.setState({ university: e })
  };

  onSubmitHandle = () => {
    const { selectedUni,showSignButton, name, email, password, confirmpassword, university, role, gender, Dob, mobile, l_name, f_name } = this.state;
    console.log(selectedUni)
    var dotIndex = email.lastIndexOf('.')
    var emailIndex = email.length;
    var today = new Date();
    var birthDate = new Date(Dob);
    var age = today.getFullYear() - birthDate.getFullYear();
    console.log(email.slice(dotIndex, emailIndex))
    if (f_name === null || f_name == " " || f_name == "") {
      this.setState({
        fnameErr: true
      });
      setTimeout(() => {
        this.setState({
          fnameErr: false
        })
      }, 5000);

    }
    if (l_name === null || l_name == " " || l_name == "") {
      this.setState({
        lnameErr: true
      });
      setTimeout(() => {
        this.setState({
          lnameErr: false
        })
      }, 5000);

    }

    if (email === "") {
      console.log("email error")
      this.setState({
        emailErr: true
      });
      setTimeout(() => {
        this.setState({
          emailErr: false
        });
      }, 5000);
    }
    if (email != "") {
      var extension = email.slice(dotIndex, emailIndex);

      let x = email;
      var atpos = x.indexOf("@");
      var dotpos = x.lastIndexOf(".");
      if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= x.length) {
        this.setState({
          emailErr: true
        });
        setTimeout(() => {
          this.setState({
            emailErr: false
          });
        }, 5000);

      }
      if (extension !== ".edu") {
        console.log("edu")
        this.setState({ extensionErr: true })
        setTimeout(() => {
          this.setState({ extensionErr: false })
        }, 5000);
      }

    }

    if (!mobile || mobile.length < 7) {
      this.setState({
        mobileErr: true
      });
      setTimeout(() => {
        this.setState({
          mobileErr: false
        });
      }, 5000);
    }
    if (!Dob || age < 18) {
      // alert(age,Dob)
      this.setState({
        dobErr: true
      });
      setTimeout(() => {
        this.setState({
          dobErr: false
        });
      }, 5000);
    }

    if (!password.match('^(?=.*?[A-Z]).{8,}$')) {
      this.setState({
        passwordErr: true
      });
      setTimeout(() => {
        this.setState({
          passwordErr: false
        });
      }, 5000);
    }
    if (confirmpassword !== this.state.password) {
      this.setState({
        cPasswordErr: true
      });
      setTimeout(() => {
        this.setState({
          cPasswordErr: false
        });
      }, 5000);
    }
    if (selectedUni === null) {
      this.setState({
        unversityErr: true
      });
      setTimeout(() => {
        this.setState({
          unversityErr: false
        });
      }, 5000);
    }
    if (gender == "") {
      this.setState({
        genderErr: true
      });
      setTimeout(() => {
        this.setState({
          genderErr: false
        });
      }, 5000);
    }
    setTimeout(() => {
      if (this.state.cPasswordErr === false && this.state.passwordErr == false && this.state.nameErr === false && this.state.emailErr === false && this.state.unversityErr === false && this.state.genderErr === false && this.state.mobileErr == false) {
        // console.log(selectedUni, 'esllllllllllllllllll')
        if(showSignButton){
        name, email, password, confirmpassword, university, role, gender, Dob, mobile
        var data = {
          first_name: f_name,
          last_name: l_name,
          name: f_name + " " + l_name,
          phone: mobile,
          email: email,
          password: password,
          role_id: '4',
          dob: Dob,
          password_confirmation: confirmpassword,
          device_token: this.state.device_token,
          device_type: this.state.device_type,
          gender: gender,
          university_id: selectedUni
        }
        this.setState({ isloading: true });
        this.props.register_request(data)
        // console.log(data)
      }
      else if(!showSignButton){
        Alert.alert('Alert', 'Please Accept Our Terms and Condition ', [

          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]);
      }

      }
      else {
        // console.log("koi error h", this.state.nameErr, 'emai', this.state.emailErr, 'uni', this.state.unversityErr, 'gender', this.state.genderErr, "mobile", this.state.mobileErr)
      }
    }, 100)
  };
  renderStartDatepicker = () => {

    return (
      <DatePicker
        style={{ width: Metrics.ratio(200) }}
        date={this.state.Dob}
        mode="date"
        placeholder="MM-DD-YYYY"
        format="MM-DD-YYYY"
        minDate="01-05-1950"
        maxDate={moment(new Date()).format("MM-DD-YYYY")}
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        style={{
          width: Metrics.screenWidth * 0.9,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: "#b4b4b4"
        }}
        customStyles={{
          dateIcon: {
            // marginLeft: Metrics.ratio(-40),
            // marginBottom: Metrics.ratio(10),
            //top: Metrics.ratio(10),
            elevation: 8,
            shadowColor: Colors.black,
            shadowOffset: {
              width: 0,
              height: 1
            },
            shadowOpacity: 0.18,
            shadowRadius: 1.0,
          },
          dateText: {
            // textAlign:"left",
            position: "absolute",
            left: Metrics.ratio(0),
            color: "#b4b4b4",
          },
          dateInput: { borderColor: "transparent" },
          placeholderText: {
            fontSize: Metrics.ratio(14),
            fontFamily: Fonts.type.regular,
            textAlign: "left",
            position: "absolute",
            left: Metrics.ratio(0),
            color: "#b4b4b4",
            marginRight: Metrics.ratio(10),
            // backgroundColor: "green"
          }
        }}
        onDateChange={date => {
          this.onchangeDob(date);
        }}
      />
    );
  };
  onClickEyeIcon = () => {
    if (this.state.showpassword === true) {
      this.setState({ showpassword: false });
    }

    else if (this.state.showpassword === false) {
      this.setState({ showpassword: true });
    }

  };


  renderDropDownList = (

    headerText,
    placeholder,
    ErrTxt,
    Iserr,
    image,
  ) => {


    return (
      <View style={styles.inputFieldView}>
        <Text style={styles.inputFieldHeaderText}>{headerText}</Text>
        <View
          style={[
            {
              flexDirection: 'row',
              alignItems: 'center',
              paddingLeft: Metrics.ratio(5),
              width: Metrics.screenWidth * 0.9,
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderBottomColor: '#b4b4b4',
              marginBottom: Metrics.ratio(10),
            },
            Platform.OS === 'ios' && { marginVertical: Metrics.ratio(8) },
          ]}>
          <Image
            source={image}
            style={[
              {
                width: Metrics.ratio(20),
                height: Metrics.ratio(20),
                marginTop: Metrics.ratio(6),
              },
              Platform.OS === 'ios' && { marginBottom: Metrics.ratio(7) },
            ]}
          />
          {/* <Icon style={{}} size={25} color="#0f5997" name={"user"} /> */}
          <RNPickerSelect
            onValueChange={value => {
              console.log(value, 'valllllsjkdsahkdjh');
              this.setState({ selectedUni: value })

            }}
            items={this.state.universities}
            placeholder={{
              label: 'Select University',
              value: null,
            }}

            style={{
              placeholder: {
                fontSize: Metrics.ratio(16),
                color: '#b4b4b4',
                fontFamily: Fonts.type.regular,
                marginTop: Metrics.ratio(15),
              },
              inputIOS: {
                marginTop: Metrics.ratio(15),
                fontFamily: Fonts.type.regular,
                fontSize: Metrics.ratio(16),
                color: '#b4b4b4',
              },
              viewContainer: {
                height: 50,
                width: Metrics.screenWidth * 0.8,
                paddingLeft: Metrics.ratio(12),
              },
            }}
          />

        </View>
        {Iserr && (
          <View>
            <Text style={{ color: 'red' }}>**{ErrTxt}</Text>
          </View>
        )}
      </View>
    );
  };





  renderInputfield = (headerText, placeholder, ErrTxt, Iserr, onChangeText, image, rightIcon, onRightIconClick) => {

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
          {rightIcon && <TextInput
            style={styles.inputField}
            placeholderTextColor="#b4b4b4"
            autoCapitalize='none'
            secureTextEntry={true}
            placeholder={placeholder}
            onChangeText={text => {
              onChangeText(text);
            }}
          />}
          {!rightIcon && <TextInput
            style={styles.inputField}
            placeholderTextColor="#b4b4b4"
            autoCapitalize='none'
            placeholder={placeholder}
            onChangeText={text => {
              onChangeText(text);
            }}
          />}
          {/* {rightIcon && <TouchableOpacity  style={{position:"absolute",right:Metrics.ratio(0)}} onPress={() => onRightIconClick()}>
            <Image source={this.state.showpassword ? Images.view : Images.hide} />
          </TouchableOpacity>} */}
        </View>
        {Iserr && <View><Text style={{ color: 'red' }} >**{ErrTxt}</Text></View>}

      </View>
    );
  };
  renderNameInputfield = (headerText, placeholder, ErrTxt, Iserr, onChangeText, image, rightIcon, onRightIconClick) => {

    return (
      <View style={styles.inputnameFieldView}>
        <Text style={styles.inputFieldHeaderText}>{headerText}</Text>
        <View
          style={[{
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: Metrics.ratio(5),
            width: Metrics.screenWidth * 0.43,
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
            resizeMethod='auto'
            resizeMode='cover'
          />
          {/* <Icon style={{}} size={25} color="#0f5997" name={"user"} /> */}
          {rightIcon && <TextInput
            style={styles.inputnameField}
            placeholderTextColor="#b4b4b4"
            secureTextEntry={true}
            placeholder={placeholder}
            onChangeText={text => {
              onChangeText(text);
            }}
          />}
          {!rightIcon && <TextInput
            style={styles.inputnameField}
            placeholderTextColor="#b4b4b4"
            placeholder={placeholder}
            onChangeText={text => {
              onChangeText(text);
            }}
          />}
          {/* {rightIcon && <TouchableOpacity  style={{position:"absolute",right:Metrics.ratio(0)}} onPress={() => onRightIconClick()}>
            <Image source={this.state.showpassword ? Images.view : Images.hide} />
          </TouchableOpacity>} */}
        </View>
        {Iserr && <View><Text style={{ color: 'red' }} >**{ErrTxt}</Text></View>}

      </View>
    );
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
  renderRadio = (headerText, placeholder1, placeholder2, ErrTxt, Iserr, onChangeRadio) => {
    return (
      <View style={styles.inputFieldView}>
        <Text style={styles.inputFieldHeaderText}>{headerText}</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: Metrics.ratio(5),
            width: Metrics.screenWidth * 0.9,
            // borderBottomWidth: StyleSheet.hairlineWidth,
            // borderBottomColor: "#b4b4b4",
            marginBottom: Metrics.ratio(10)
          }}
        >
          <RadioGroup
            color="#ff7ee7"
            style={styles.radioGroup}
            onSelect={(index, value) => {
              onChangeRadio(value)
            }}
          >
            <RadioButton value={placeholder1} color="#b4b4b4" style={styles.radioOptions} >
              <Text>{placeholder1}</Text>
            </RadioButton>


            <RadioButton value={placeholder2} color="#b4b4b4" style={styles.radioOptions}>
              <Text>{placeholder2}</Text>
            </RadioButton>
          </RadioGroup>
        </View>
        {Iserr && <View><Text style={{ color: 'red' }} >**{ErrTxt}</Text></View>}
      </View>
    );
  };
  render() {
    return (
      <ImageBackground
        source={Images.loginBackground}
        // resizeMode = 'contain'
        resizeMethod='auto'
        style={{ width: '100%', height: '100%' }}
      >
        {/* <View style={styles.container}> */}

        {/*  */}
        {/* <ScrollView keyboardShouldPersistTaps="always"> */}
        <KeyboardAwareScrollView>

          <View style={[styles.bodyView, Platform.OS === "ios" && { marginTop: Metrics.ratio(50) }]}>
            <View style={{ width: Metrics.screenWidth * 0.95, justifyContent: 'center', alignItems: 'center' }}>
              <Image
                source={Images.logo}
                style={{
                  width: Metrics.ratio(186),
                  height: Metrics.ratio(59),
                  marginBottom: Metrics.ratio(15),
                }}
                resizeMethod='auto'
                resizeMode='cover'
              />
            </View>
            <View style={styles.headerView}>

              <Text style={styles.headerText}>SIGN UP AS USER</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ marginRight: Metrics.ratio(1) }}>
                {this.renderNameInputfield(
                  "FIRST NAME",
                  "First Name",
                  "First Name Required",
                  this.state.fnameErr,
                  this.onChangeFirstName,
                  Images.firstNameIcon
                )}
              </View>
              <View style={{ marginLeft: Metrics.ratio(25) }}>
                {this.renderNameInputfield(
                  "LAST NAME",
                  "Last Name",
                  "Last Name Required",
                  this.state.lnameErr,
                  this.onChangeLastName,
                  Images.firstNameIcon
                )}
              </View>
            </View>
            {this.renderInputfield(
              "EMAIL",
              "Student Email (.edu)",
              "Email Required",
              this.state.emailErr,
              this.onChangeEmail,
              Images.emailIcon
            )}
            {this.state.extensionErr && <View><Text style={{ color: 'red' }} >*Invalid Email (demo@example.edu)</Text></View>}
            {this.renderNumberInputfield(
              "MOBILE NUMBER",
              "Enter Mobile Number",
              "Mobile No Required",
              this.state.mobileErr,
              this.onChangeNumber,
              Images.mobileNumber
            )}
            <View style={{ flexDirection: "row" }}>
              <View style={{ marginLeft: Metrics.ratio(10), marginBottom: Metrics.ratio(5) }}>
                <Text
                  style={{
                    color: "black",
                    fontSize: Metrics.ratio(14),
                    fontFamily: Fonts.type.demibold
                  }}
                >
                  DATE OF BIRTH
             </Text>
                {this.renderStartDatepicker()}
                {this.state.dobErr && <View><Text style={{ color: 'red' }} >*You are not allowed to register without valid date of birth</Text></View>}
              </View>
            </View>
            {/* {this.renderInputfield(
             "DATE OF BIRTH",
             "DD/MM/YYYY",
             "date",
             this.onChangeNumber,
             Images.calender
           )} */}
            {this.renderInputfield(
              "PASSWORD",
              "Enter Password",
              "Must be at least 8 characters and include 1 capital letter",
              this.state.passwordErr,
              this.onChangePassword,
              Images.passwordIcon,
              Images.passwordIcon,
              this.onClickEyeIcon
            )}
            {this.renderInputfield(
              "CONFIRM PASSWORD",
              "Confirm Password",
              "Password Not Matched",
              this.state.cPasswordErr,
              this.onChangeConfirmPassword,
              Images.passwordIcon,
              Images.passwordIcon,
              this.onClickEyeIcon
            )}
            {/* {this.renderInputfield(
              "UNIVERSITY ATTENDING",
              "University Attending",
              "Enter University Name",
              this.state.unversityErr,
              this.onchangeUniversity,
              Images.Scholar
            )} */}
            {/* {this.renderDropdownContainer(
              "UNIVERSITY ATTENDING",
              "University Attending",
              "Enter University Name",
              this.state.unversityErr,
              Images.Scholar)
            } */}
            {this.renderDropDownList(
              "UNIVERSITY ATTENDING",
              "University Attending",
              "Enter University Name",
              this.state.unversityErr,
              Images.Scholar)}
            {this.renderRadio(
              "GENDER",
              "MALE",
              "FEMALE",
              "Select Gender",
              this.state.genderErr,
              this.onchangeGender
            )}
            {/* {this.renderRadio(
             "LOGIN AS",
             "USER",
             "WASHER",
             "Select Role",
             this.state.roleErr,
             this.onchangeRole
           )} */}
                       <TouchableOpacity
              onPress={() => {
                this.setState({ modalVisible: true });
                //   this.props.navigation.navigate("loginScreen", {
                //     screen: "loginScreen"
                //   });
              }}
            >
              <Text
                style={{
                  fontSize: Metrics.ratio(13),
                  marginTop: Metrics.ratio(10),
                  color: "#0f5997",
                  fontFamily: Fonts.type.demibold,
                  borderBottomColor: '#0f5997',
                  borderBottomWidth: 1, width: Metrics.screenWidth * 0.4,
                  textAlign: 'center',
                }}
              >
                Terms and Conditions{" "}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButtonView} onPress={() => this.onSubmitHandle()}>

              <Text
                style={{
                  color: "black",
                  fontSize: Metrics.ratio(14),
                  fontFamily: Fonts.type.demibold
                }}
              >
                SUBMIT
              </Text>
            </TouchableOpacity>
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
                  fontSize: Metrics.ratio(13),
                  color: "black",
                  fontFamily: Fonts.type.demibold
                }}
              >
                ALREADY ACCOUNT ?{" "}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Actions.pop()
                  //   this.props.navigation.navigate("loginScreen", {
                  //     screen: "loginScreen"
                  //   });
                }}
              >
                <Text
                  style={{
                    fontSize: Metrics.ratio(13),
                    color: "#0f5997",
                    fontFamily: Fonts.type.demibold
                  }}
                >
                  LOGIN{" "}
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </KeyboardAwareScrollView>
        {/* </ScrollView> */}
        {/* </View> */}
        {this.renderModal()}
        {this.renderOverlaySpinner()}
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => ({
  register: state.register
});

const actions = { register_request };

export default connect(
  mapStateToProps,
  actions
)(RegistrationScreen);
