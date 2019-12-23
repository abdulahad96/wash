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
import {Header, MapDisplayField} from '../../components';
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
import Actions from 'react-native-router-flux';

import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';



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
      getDefaultValue={watch => {
        console.log(getlocation, 'wahhhhhhhhhhhhhhhhhhhhhhh');
        return '';
      }}
      // getDefaultValue={() => getlocation.place}
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


class PickupScreen extends Component {}