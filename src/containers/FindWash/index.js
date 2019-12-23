// @flow
import {connect} from 'react-redux';
import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  BackHandler,
  ScrollView,
  TouchableHighlight,
  Picker,
  Alert,
  Platform,
} from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';
import styles from './styles';
import {Header} from '../../components';
// import {map} from '../../components/MapInput'
import {Fonts, Metrics, Images} from '../../theme';
import DatePicker from 'react-native-datepicker';
// import MapView from 'react-native-maps';
import CheckBox from 'react-native-check-box';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {RadioGroup, RadioButton} from 'react-native-flexi-radio-button';
// import MapView from 'react-native-maps';
// import GooglePlacesInput from './autoCompleteInput';
import Geolocation from '@react-native-community/geolocation';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {updateUser, removeUser} from '../../actions/userAction';
import configureStore from '../../store';
import {request as order_request} from '../../actions/OrderAction';
import RNPickerSelect from 'react-native-picker-select';
import Geocoder from 'react-native-geocoding';
import Util from '../../util';
import {Actions} from 'react-native-router-flux';
import SpinnerLoader from '../../components/spinner';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';

// import { request as order_request } from '../../actions/OrderAction';
// import { exportDefaultSpecifier } from '@babel/types';

Geocoder.init('AIzaSyCIGENLCfCwZwPaumiUQs21GfgMhgppa7s');
const homePlace = {
  description: 'Home',
  geometry: {location: {lat: 48.8152937, lng: 2.4597668}},
};
const workPlace = {
  description: 'Work',
  geometry: {location: {lat: 48.8496818, lng: 2.2940881}},
};

const GooglePlacesInput = getlocation => {
  return (
    <GooglePlacesAutocomplete
      placeholder={getlocation.place}
      // defaultValue={getlocation.place}
      minLength={1} // minimum length of text to search
      autoFocus={false}
      returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
      keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
      fetchDetails={true}
      renderDescription={row => row.description} // custom description render
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data, details);
        getlocation.getpicklatLng(
          details.geometry.location.lat,
          details.geometry.location.lng,
        );
      }}
      listViewDisplayed={false}
      // value={getlocation.place.toString()}
      getDefaultValue={() =>''}
      value={getlocation.place.toString()}
      onChangeText={getlocation.place.toString()}
      // getDefaultValue={() => getlocation.place.toString()}
      query={{
        // available options: https://developers.google.com/places/web-service/autocomplete
        key: 'AIzaSyCIGENLCfCwZwPaumiUQs21GfgMhgppa7s',
        language: 'en', // language of the results
        // types: '(cities)', // default: 'geocode'
      }}
      styles={{
        textInputContainer: {
          width: Metrics.screenWidth,
          borderColor: 'white',
          borderWidth: Metrics.ratio(1),
        },
        description: {
          fontWeight: 'bold',
          // backgroundColor:'white'
        },
        predefinedPlacesDescription: {
          color: '#1faadb',
          // backgroundColor:'white'
        },
        listView: {
          height: Metrics.ratio(30),
          backgroundColor: 'white',
          // backgroundColor:'white'
        },
        poweredContainer: {},
      }}
      currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
      currentLocationLabel="Current location"
      nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
      GoogleReverseGeocodingQuery={
        {
          // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
        }
      }
      GooglePlacesSearchQuery={{
        // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
        rankby: 'distance',
        type: 'cafe',
      }}
      GooglePlacesDetailsQuery={{
        // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
        fields: 'formatted_address',
      }}
      filterReverseGeocodingByTypes={[
        'locality',
        'administrative_area_level_3',
      ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
      // predefinedPlaces={[homePlace]}
    
      debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
      // renderLeftButton={()  => <Image source={Images.chatIcon} />}
      // renderRightButton={() => <Text>Custom text after the input</Text>}
    />
  );
};
 

class FindWashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isloading:false,
      tooltipVisible: false,
      Nofofbags: null,
      genderRequest: false,
      ownDetergents: '',
      detergentCharge:null,
      folded: '',
      hung: '',
      pickupvalue: null,
      dropoffvalue: null,
      special_instruction: '',
      scholarShipDonation: 1,
      total: 0,
      HungErr: false,
      foldedErr: false,
      detergentErr: false,
      bagErr: false,
      pickup: {
        latitude: 48.8496818,
        longitude: 2.2940881,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
      currentLocation: null,
      showDropoff: false,
      showPickup: true,
      showForm: false,
      isCheckedExperience: false,
      dropoff: {
        latitude: 48.8496818,
        longitude: 2.2940881,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
      coordinate: {
        lat: 48.8152937,
        long: 2.4597668,
      },
    };
  }
  componentDidMount() {
    console.log('add event listner');
    // geoloca
    Platform.OS !== 'ios' && Geolocation.setRNConfiguration();
    // navigator.geolocation = require('@react-native-community/geolocation');
    Platform.OS === 'ios' &&
      Geolocation.setRNConfiguration({
        skipPermissionRequests: true,
        authorizationLevel: 'always',
      });
    Platform.OS === 'ios' && Geolocation.requestAuthorization();
    this.setInitialCoordinates();
    this.findCords();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    if (Platform.OS === 'ios') {
      this.requestLocationPermission();
    }
  }

  async requestLocationPermission() {
    check(PERMISSIONS.IOS.LOCATION_ALWAYS)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            
              this.setState({isloading:false});
            console.log(
              'The permission has not been requested / is denied but requestable',
            );
            break;
          case RESULTS.GRANTED:
            request(PERMISSIONS.IOS.LOCATION_ALWAYS).then(result => {
              // …
              console.log(result, 'The permission is granteddddddd');
           
            });
            break;
          case RESULTS.BLOCKED:
              // Alert.alert('Error', 'You must on your location permission', [

              //   { text: 'OK', onPress: () => console.log('OK Pressed') },
              // ])
              this.setState({isloading:false});
            console.log('The permission is denied and not requestable anymore');
     
            break;
        }
      })
      .catch(error => {
        console.log(error, 'permissionError');
      });
  }
 
  renderOverlaySpinner = () => {
    const { isloading } = this.state;
    return <SpinnerLoader isloading={isloading} />;
  };
  setInitialCoordinates = () => {
    Geolocation.getCurrentPosition(async info => {
      // console.log(this.getLocationName(info.coords.latitude, info.coords.longitude))
      const loc = await this.getLocationName(
        info.coords.latitude,
        info.coords.longitude,
      );

      this.setState({
        pickupvalue: loc,
        dropoffvalue: loc,
        pickup: {
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        },
        dropoff: {
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        },
      });
    });
  };
  getLocationName = (lat, lng) => {
    return new Promise((resolve, reject) => {
      Geocoder.from({
        latitude: lat,
        longitude: lng,
      })
        .then(json => {
          var addressComponent = json.results[0].formatted_address;
          resolve(addressComponent);
        })
        .catch(
          error => {
            reject(error);
            //  return null;
          },
          // console.warn(error)
        );
    });
    console.log('hello');
  };

  componentWillUnmount() {
    console.log('Remove event listner');
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }
  findCords = () => {};
  componentWillReceiveProps(nextProps) {
    if (nextProps.order) {
      console.log(nextProps.order)
      if (
        !nextProps.order.failure &&
        !nextProps.order.isFetching &&
        nextProps.order.data.data &&
        nextProps.order.data.success === true 
      ) {
        // Alert.alert('SUCCESSFUL', 'Ordered has been placed', [
        //   {text: 'OK', onPress: () => console.log('OK Pressed')},
         
        // ]);
        console.log(nextProps.order.data.data,"order ka data aya he")
        this.setState({isloading:false})
        Actions.PaymentScreen({
          orderDetails:nextProps.order.data.data
        })

      }
      else{
        this.setState({isloading:false}) 
      }
    }

    
    
    console.log('======>', nextProps);
  }

  // get Current Location

  // Input Field Handling
  onchangeRequest = () => {};
  onChangeNoofbags = val => {
    console.log(val)
    this.setState({Nofofbags: val, total: 5 * val + 1});
  };
  onchangeDetergent = e => {
    const {total} = this.state
    console.log(e);
    if(e == 0){
      this.setState({detergentCharge:0.50})
    }
    else{
      this.setState({detergentCharge:0})
    }
    this.setState({ownDetergents: e});
    
  };
  onchangeHung = e => {
    this.setState({hung: e});
  };
  onchangeInstruction = e => {
    this.setState({special_instruction: e});
  };
  onchangeFolded = e => {
    this.setState({folded: e});
  };
  onchangeScholarship = () => {};
  onchangePrice = () => {};
  // Back Button Handle
  handleBackPress = () => {
    if (this.state.showPickup) {
      this.pickupbackbutton();
      return false;
    } else if (this.state.showDropoff) {
      this.dropoffbackbutton();
      return true;
    } else if (this.state.showForm) {
      this.formbackbutton();
      return true;
    }
  };

  crateStore = () => {
    const {hung, folded, detergent} = this.state;
    var type;
    if (this.state.genderRequest == true) {
      type = 1;
    } else {
      type = 0;
    }
    console.log(this.props.user);
    var data = {
      user_id: this.props.user.user.id,
      accessToken: this.props.user.user.access_token,
      no_bags: this.state.Nofofbags,
      type: type,
      up_latitude: this.state.pickup.latitude,
      up_longitude: this.state.pickup.longitude,
      detergent: this.state.ownDetergents,
      folded: this.state.folded,
      hung: this.state.hung,
      instruction: this.state.special_instruction,
      price: this.state.total+(this.state.detergentCharge*this.state.Nofofbags),
      donation: this.state.scholarShipDonation,
      down_latitude: this.state.dropoff.latitude,
      down_longitude: this.state.dropoff.longitude,
      pick_up:this.state.pickupvalue,
      drop_off:this.state.dropoffvalue,
      status: 0,
    };
    console.log(data.hung, data.folded, data.detergent, 'errrrrr');
    if (!this.state.Nofofbags) {
      this.setState({bagErr: true});
      setTimeout(() => {
        this.setState({bagErr: false});
      }, 3000);
    }
    if (data.detergent == '') {
      console.log('deterge');
      this.setState({detergentErr: true});
      setTimeout(() => {
        this.setState({detergentErr: false});
      }, 3000);
    }
    if (data.folded == '') {
      console.log('folder');
      this.setState({foldedErr: true});
      setTimeout(() => {
        this.setState({foldedErr: false});
      }, 3000);
    }
    if (data.detergent == '') {
      console.log('hung');
      this.setState({HungErr: true});
      setTimeout(() => {
        this.setState({HungErr: false});
      }, 3000);
    } 
      setTimeout(() => {
        if(this.state.detergentErr == true || this.state.HungErr == true || this.state.foldedErr == true || this.state.bagErr == true){

        }
        else{
        this.props.order_request(data);
        this.setState({isloading:true})
        }
      }, 200);


      // this.props.navigation.pop();
    
    // this.props.order_request(data);
  };

  pickupbackbutton = () => {
    // this.props.navigation.navigate.pop();
    // console.log(this.props);
    this.props.navigation.navigate('dashboard');
  };
  dropoffbackbutton = () => {
    this.setState({
      // pickup: { latitude: '', longitude: '' },
      showPickup: true,
      showDropoff: false,
    });
  };
  formbackbutton = () => {
    this.setState({
      // dropoff: { lat: '', lng: '' },
      showDropoff: true,
      showForm: false,
    });
  };

  // Component Handling

  renderDropDown = (
    headerText,
    placeholder,
    ErrTxt,
    Iserr,
    onChangeText,
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
            Platform.OS === 'ios' && {marginVertical: Metrics.ratio(8)},
          ]}>
          <Image
            source={image}
            style={[
              {
                width: Metrics.ratio(20),
                height: Metrics.ratio(20),
                marginTop: Metrics.ratio(6),
              },
              Platform.OS === 'ios' && {marginBottom: Metrics.ratio(7)},
            ]}
          />
          {/* <Icon style={{}} size={25} color="#0f5997" name={"user"} /> */}
          <RNPickerSelect
            onValueChange={value => {
              console.log(value, 'valllllsjkdsahkdjh');
              var total = 10.99;
              if (value == 1) {
                total = total + 1;
                this.setState({Nofofbags: value, total: total});
              } else if (value == 2) {
                total = total + 7.99 + 1;
                this.setState({Nofofbags: value, total: total});
              }
              else{
                this.setState({Nofofbags: null, total: 0});
              }
              console.log(this.state.Nofofbags);
            }}
            items={[{label: '1', value: '1'}, {label: '2', value: '2'}]}
            placeholder={{
              label: 'Select No. Of Bags',
              value: null,
            }}
            style={{
              placeholder: {
                fontSize: Metrics.ratio(16),
                color: 'black',
                fontFamily: Fonts.type.regular,
                marginTop: Metrics.ratio(15),
              },
              inputIOS: {
                marginTop: Metrics.ratio(15),
                fontFamily: Fonts.type.regular,
                fontSize: Metrics.ratio(16),
                color: 'black',
              },
              viewContainer: {
                height: 50,
                width: Metrics.screenWidth * 0.8,
                paddingLeft: Metrics.ratio(15),
              },
            }}
          />
          {/* <Picker
            selectedValue={this.state.Nofofbags}
            style={{ height: 50, width: 100 }}
            onValueChange={(itemValue, itemIndex) => {
              var total = 10.99;
              if (itemValue == '1') {
                total = total + 1;
                this.setState({ Nofofbags: itemValue, total: total });
              } else if (itemValue == '2') {
                total = total + 7.99 + 1;
                this.setState({ Nofofbags: itemValue, total: total });
              }
              console.log(this.state.Nofofbags);
            }}>
            <Picker.Item label="1" value="1" />
            <Picker.Item label="2" value="2" />
          </Picker> */}
        </View>
        {Iserr && (
          <View>
            <Text style={{color: 'red'}}>**{ErrTxt}</Text>
          </View>
        )}
      </View>
    );
  };

  renderInputfield = (
    headerText,
    placeholder,
    ErrTxt,
    Iserr,
    onChangeText,
    image,
    enable,
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
            Platform.OS === 'ios' && {marginVertical: Metrics.ratio(8)},
          ]}>
          <Image
            source={image}
            style={[
              {
                width: Metrics.ratio(20),
                height: Metrics.ratio(20),
                marginTop: Metrics.ratio(6),
              },
              Platform.OS === 'ios' && {marginBottom: Metrics.ratio(7)},
            ]}
          />
          {/* <Icon style={{}} size={25} color="#0f5997" name={"user"} /> */}

          <TextInput
            style={styles.inputField}
            editable={false}
            placeholderTextColor="#b4b4b4"
            // secureTextEntry={rightIcon ? this.state.showpassword : false}
            placeholder={'$'+ JSON.stringify(placeholder)}
            // value={placeholder}
            onChangeText={text => {
              onChangeText(text);
            }}
          />
        </View>
        {Iserr && (
          <View>
            <Text style={{color: 'red'}}>**{ErrTxt}</Text>
          </View>
        )}
      </View>
    );
  };

  renderInputArea = (
    headerText,
    placeholder,
    ErrTxt,
    Iserr,
    onChangeText,
    image,
  ) => {
    return (
      <View style={styles.inputFieldView}>
        <Text style={styles.inputareaHeaderText}>{headerText}</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: Metrics.ratio(5),
            width: Metrics.screenWidth * 0.9,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: '#b4b4b4',
            marginBottom: Metrics.ratio(10),
          }}>
          <TextInput
            style={styles.inputareaField}
            // numberOfLines={4}
            multiline = {true}
            numberOfLines = {4}
            placeholderTextColor="#b4b4b4"
            // secureTextEntry={rightIcon ? this.state.showpassword : false}
            placeholder={placeholder}
            onChangeText={text => {
              onChangeText(text);
            }}
          />
        </View>
        {Iserr && (
          <View>
            <Text style={{color: 'red'}}>**{ErrTxt}</Text>
          </View>
        )}
      </View>
    );
  };

  // Radio Button Component

  renderRadio = (
    headerText,
    placeholder1,
    placeholder2,
    ErrTxt,
    Iserr,
    tooltip,
    onChangeRadio,
  ) => {
    return (
      <View style={styles.inputFieldView}>
        {tooltip == true && (
          <Tooltip
          tooltipStyle={{width:Metrics.screenWidth*0.30,position:"absolute",left:Metrics.ratio(5)}}
            // arrowSize={{ width: 8, height: 8} }
            tooltipStyle={{width:Metrics.screenWidth*0.30,position:"absolute",left:Metrics.ratio(5)}}
            isVisible={this.state.toolTipVisible}
            content={
              <Text>Customer Must Provide Their Own Hangers</Text>
            }
            placement="top"
            onClose={() => this.setState({toolTipVisible: false})}>
            <TouchableHighlight style={styles.touchable} displayInsets={{ top: 24, bottom: 24, left: 24, right: 24} }>
              <Text style={styles.inputFieldHeaderText}>{headerText}</Text>
            </TouchableHighlight>
          </Tooltip>
        )}
        {!tooltip && (
          <Text style={styles.inputFieldHeaderText}>{headerText}</Text>
        )}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: Metrics.ratio(5),
            width: Metrics.screenWidth * 0.9,
            // borderBottomWidth: StyleSheet.hairlineWidth,
            // borderBottomColor: "#b4b4b4",
            marginBottom: Metrics.ratio(10),
          }}>
          <RadioGroup
            color="#ff7ee7"
            style={styles.radioGroup}
            onSelect={(index, value) => {
              onChangeRadio(value);
            }}>
            <RadioButton value="1" color="#b4b4b4" style={styles.radioOptions}>
              <Text>{placeholder1}</Text>
            </RadioButton>

            <RadioButton value="0" style={styles.radioOptions}>
              <Text>{placeholder2}</Text>
            </RadioButton>
          </RadioGroup>
        </View>
        {Iserr && (
          <View>
            <Text style={{color: 'red'}}>**{ErrTxt}</Text>
          </View>
        )}
      </View>
    );
  };
  // Checkbox Component
  rendercheckBox = (
    headerText,
    placeholder1,
    placeholder2,
    ErrTxt,
    Iserr,
    onChangeCheck,
  ) => {
    return (
      <View
        style={{
          width: Metrics.screenWidth * 0.9,
          marginHorizontal: Metrics.screenWidth * 0.025,
          marginBottom: Metrics.ratio(10),
        }}>
        <Text style={styles.inputFieldHeaderText}>{headerText}</Text>
        <View style={{flexDirection: 'row'}}>
          <CheckBox
            style={{
              width: Metrics.ratio(25),
              height: Metrics.ratio(25),
              borderRadius: 10,
              borderWidth: Metrics.ratio(1),
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: '#0f5997',
              marginTop: Metrics.ratio(5),
              marginHorizontal: Metrics.ratio(10),
            }}
            checkedImage={
              <Image
                style={{width: Metrics.ratio(14), height: Metrics.ratio(14)}}
                source={Images.tickIcon}
              />
            }
            uncheckedCheckBoxColor="transparent"
            checkedCheckBoxColor="transparent"
            onClick={() => {
              this.setState({
                genderRequest: !this.state.genderRequest,
              });
              console.log('asdasasdasdasd', this.state.genderRequest);
            }}
            isChecked={this.state.genderRequest}
          />
          <Text style={{marginTop: Metrics.ratio(10)}}>{placeholder1}</Text>
        </View>
      </View>
    );
  };

  // Map Handling Functions
  Handlepickup = () => {
    this.setState({
      //  pickup: { lat: '24.8681357', lng: '67.0442549' },
      showPickup: false,
      showDropoff: true,
    });
  };
  handleDropOff = () => {
    this.setState({
      // dropoff: { lat: '24.8681357', lng: '67.0442549' },
      showDropoff: false,
      showForm: true,
      toolTipVisible: true,
    });
  };

  getpicklatLng = (lat, lng) => {
    this.setState({
      pickup: {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
    });
  };
  getdroplatLng = (lat, lng) => {
    this.setState({
      dropoff: {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      },
    });
  };

  onRegionChangeComplete = e => {
    this.setState(
      {
        pickup: {
          latitude: e.latitude,
          longitude: e.longitude,
          latitudeDelta: e.latitudeDelta,
          longitudeDelta: e.longitudeDelta,
        },
      },
      async () => {
        let loc = await this.getLocationName(e.latitude, e.longitude);
        this.setState({
          pickupvalue: loc,
          dropoffvalue: loc,
        });
      },
    );
  };

  renderPickup = () => {
    const {pickupvalue} = this.state;
    return (
      <View
        style={{
          width: Metrics.screenWidth,
          height: Metrics.screenHeight * 0.85,
          elevation: 8,
        }}>
        <View
          style={[
            {
              width: Metrics.screenWidth,
              height: Metrics.screenHeight * 0.9,
              // marginLeft: Metrics.screenWidth * 0.025,
              borderRadius: Metrics.ratio(10),
              marginTop: Metrics.ratio(10),
              marginBottom: Metrics.ratio(10),
              backgroundColor: 'white',
              elevation: 8,
            },
            Platform.OS === 'android' && {height: Metrics.screenHeight * 0.85},
          ]}>
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              height: Metrics.screenHeight,
              width: Metrics.screenWidth,
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}>
            {this.state.pickup.latitude !== null &&
              this.state.pickup.longitude !== null && (
                <MapView
                  ref={ref => {
                    this.map = ref;
                  }}
                  showsMyLocationButton={false}
                  toolbarEnabled={false}
                  showsUserLocation={true}
                  // mapType={Platform.OS == "android" ? "none" : "standard"}
                  onRegionChangeComplete={e => {
                    this.onRegionChangeComplete(e);
                  }}
                  onPress={e => {
                    this.setState(
                      {
                        pickup: {
                          latitude: e.nativeEvent.coordinate.latitude,
                          longitude: e.nativeEvent.coordinate.longitude,
                          latitudeDelta: 0.015,
                          longitudeDelta: 0.0121,
                        },
                      },
                      async () => {
                        let loc = await this.getLocationName(
                          e.nativeEvent.coordinate.latitude,
                          e.nativeEvent.coordinate.longitude,
                        );
                        this.setState({
                          pickupvalue: loc,
                        });
                      },
                    );
                  }}
                  provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                  style={{...StyleSheet.absoluteFillObject}}
                  region={this.state.pickup}>
                </MapView>
              )}
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: 0,
                bottom: Metrics.ratio(70),
                left: 0,
                right: 0,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
              }}>
              <Image pointerEvents="none" source={Images.markerIcon} />
            </View>
          </View>
          {/* {this.GooglePlacesInput(this.getpicklatLng, "Select Pick Up Location", pickupvalue === null ? '' : pickupvalue)} */}
          <GooglePlacesInput
            getpicklatLng={this.getpicklatLng}
            headerTxt="Select Pick Up Location"
            place={pickupvalue === null ? '' : pickupvalue}
          />
          {
            <TouchableOpacity
              onPress={() => {
                this.Handlepickup();
              }}
              style={[
                styles.submitButtonView,
                {marginLeft: Metrics.screenWidth * 0.05},
              ]}>
            
              <Text
                style={{
                  color: 'black',
                  fontSize: Metrics.ratio(16),
                  fontFamily: Fonts.type.demibold,
                }}>
                Confirm Pick Up
              </Text>
            </TouchableOpacity>
          }
        </View>
      </View>
   
    );
  };
  onChangeCompleteDropOff = (e) => {
    this.setState(
      {
        // dropoffvalue:this.getLocationName( e.latitude,e.longitude),
        dropoff: {
          latitude: e.latitude,
          longitude: e.longitude,
          latitudeDelta: e.latitudeDelta,
          longitudeDelta: e.longitudeDelta,
        },
      },
      async () => {
        let loc = await this.getLocationName(
          e.latitude,
          e.longitude,
        );
        this.setState({
          dropoffvalue: loc,
        });
      },
    );
  }
  renderDropOff = () => {
    const {dropoffvalue} = this.state;
    return (
      <View
        style={{
          width: Metrics.screenWidth,
          height: Metrics.screenHeight * 0.85,
          elevation: 8,
        }}>
        <View
          style={[
            {
              width: Metrics.screenWidth,
              height: Metrics.screenHeight * 0.9,
              //  marginLeft: Metrics.screenWidth * 0.025,
              borderRadius: Metrics.ratio(10),
              marginTop: Metrics.ratio(10),
              marginBottom: Metrics.ratio(10),
              backgroundColor: 'white',
              elevation: 8,
            },
            Platform.OS === 'android' && {height: Metrics.screenHeight * 0.85},
          ]}>
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              height: Metrics.screenHeight,
              width: Metrics.screenWidth,
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}>
            {this.state.dropoff && (
              <MapView
              // ref={ref => {
              //   this.map = ref;
              // }}
              showsMyLocationButton={false}
              toolbarEnabled={false}
              showsUserLocation={true}
                // mapType={Platform.OS == "android" ? "none" : "standard"}
                onRegionChangeComplete={e => {
                  this.onChangeCompleteDropOff(e)
                }}
                onPress={e => {
                  this.setState(
                    {
                      dropoff: {
                        latitude: e.nativeEvent.coordinate.latitude,
                        longitude: e.nativeEvent.coordinate.longitude,
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121,
                      },
                    },
                    async () => {
                      let loc = await this.getLocationName(
                        e.nativeEvent.coordinate.latitude,
                        e.nativeEvent.coordinate.longitude,
                      );
                      this.setState({
                        dropoffvalue: loc,
                      });
                    },
                  );
                }}
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={{...StyleSheet.absoluteFillObject}}
                region={this.state.dropoff}>
              </MapView>
            )}
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: 0,
                bottom: Metrics.ratio(70),
                left: 0,
                right: 0,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'transparent',
              }}>
              <Image pointerEvents="none" source={Images.markerIcon} />
            </View>
          </View>
         <GooglePlacesInput
            getpicklatLng={this.getdroplatLng}
            headerTxt="Select Drop Off Location"
            place={dropoffvalue === null ? '' : dropoffvalue}
          />
          {this.state.dropoff && (
            <TouchableOpacity
              onPress={() => {
                this.handleDropOff();
              }}
              style={[
                styles.submitButtonView,
                {marginLeft: Metrics.screenWidth * 0.05},
              ]}>
              
              <Text
                style={{
                  color: 'black',
                  fontSize: Metrics.ratio(16),
                  fontFamily: Fonts.type.demibold,
                }}>
                Confirm Drop Off
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };
  renderForm = () => {
    return (
      // <ScrollView keyboardShouldPersistTaps="always">
      <KeyboardAwareScrollView>
        <View
          style={{
            width: Metrics.screenWidth * 0.95,
            marginLeft: Metrics.screenWidth * 0.025,
            borderRadius: Metrics.ratio(10),
            marginTop: Metrics.ratio(10),
            marginBottom: Metrics.ratio(30),
            paddingVertical: Metrics.ratio(20),
            backgroundColor: 'white',
            elevation: 8,
          }}>
          {/* <View style={{marginBottom:Metrics.ratio(10}}> */}
          {this.renderDropDown(
            'NO. OF BAGS',
            'No. of bags',
            'Required no of bags',
            this.state.bagErr,
            this.onChangeNoofbags,
            Images.passwordIcon,
          )}
          {this.rendercheckBox(
            'Request Same Gender (Optional)',
            'Yes Please',
            '',
            '',
            this.onchangeRequest(),
          )}
          {this.renderRadio(
            'USING YOUR OWN DETERGENT ($0.50 Per Bag)',
            'Yes',
            'No',
            'Select Field',
            this.state.detergentErr,
            false,
            this.onchangeDetergent,
          )}
          {this.renderRadio(
            'FOLDED (Free)',
            'Yes',
            'No',
            'Select Field',
            this.state.foldedErr,
            false,
            this.onchangeFolded,
          )}

          {this.renderRadio(
            'HUNG (Free)',
            'Yes',
            'No',
            'Select Field',
            this.state.HungErr,
            true,
            this.onchangeHung,
          )}

          {this.renderInputArea(
            'Special Instructions',
            'Need stuff hung up? Be specific! Also tell us your preferred washer/dryer settings.',
            'Required Instructions',
            false,
            this.onchangeInstruction,
          )}
          {this.renderInputfield(
            'SCHOLARSHIP DONATION',
            this.state.scholarShipDonation,
            this.state.scholarShipDonation,
            false,
            this.onchangeScholarship,
            Images.Donate,
          )}
          {this.renderInputfield(
            'TOTAL PRICE',
            this.state.total+(this.state.detergentCharge*this.state.Nofofbags),
            'Required field',
            false,
            this.onchangePrice,
            Images.Coin,
          )}
          {/* </View> */}
          <TouchableOpacity
            onPress={() => {
              this.crateStore();
              // this.handleLogin();
            }}
            style={styles.submitButton}>
            <Text
              style={{
                color: 'black',
                fontSize: Metrics.ratio(16),
                fontFamily: Fonts.type.demibold,
              }}>
              SUBMIT
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    );
  };
  // Components Of Findwash

  render() {
    return (
      <View style={styles.container}>
        <Header
          headerText={'FIND A WASH'}
          leftIcon={Images.LeftArrow}
          headerIconStyle={{marginLeft: Metrics.ratio(40)}}
          headerTextStyle={{marginLeft: Metrics.ratio(45)}}
          leftBtnPress={() => {
            if (this.state.showPickup) {
              this.pickupbackbutton();
            } else if (this.state.showDropoff) {
              this.dropoffbackbutton();
            } else if (this.state.showForm) {
              this.formbackbutton();
            }
          }}
        />
        {this.state.showPickup && this.renderPickup()}
        {this.state.showDropoff && this.renderDropOff()}
        {this.state.showForm && this.renderForm()}
        {this.renderOverlaySpinner()}
      </View>
    );
  }
}

const mapStateToProps = state => {
  console.log(state);
  return {
    order: state.orderreducer,
    user: state.userReducer.user,
    // wallet:state.wallet
  };
};

const actions = {
  order_request,
};

export default connect(
  mapStateToProps,
  actions,
)(FindWashScreen);
