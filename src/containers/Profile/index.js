// @flow
import {connect} from 'react-redux';
import React, {Component} from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  ImageBackground,
  Alert,
  Platform,
} from 'react-native';
import moment from 'moment';
import {Header} from '../../components';
import {Fonts, Metrics, Colors, Images} from '../../theme';
import {updateUser, removeUser} from '../../actions/userAction';
import StarRating from 'react-native-star-rating';
import {request as Edit_profile} from '../../actions/EditProfileAction';
import DatePicker from 'react-native-datepicker';
import SpinnerLoader from '../../components/spinner';
import styles from './styles';
import ImagePicker from 'react-native-image-picker';
import {getUser} from '../../config/simpleApiCall';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

class ProfileScreeen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      starCount: 3.5,
      user: null,
      userDetails: null,
      showProfile: true,
      dob: null,
      name: '',
      bio: '',
      
      graduation: null,
      // profile_pic:'',
      profileImg: null,
      showUpdateProfile: false,
      isloading: false,
      access_token: null,
      dobErr: false,
    };
  }

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating,
    });
  }
  getuser =async()=>{
   const {user}= this.props
   let token = user.user.access_token
   let userId = user.user.id;
   let payload = {id:userId,access_token:token}
   console.log(token)
   try {
     let response = await getUser(payload)
    
      this.setState({
        user:response.data.data,
        userDetails:response.data.data.details,
        dob: response.data.data.details.dob,
      isloading:false})
   }
   catch(err){
     console.log(err)
     this.setState({isloading:false});
   }
  }
  componentDidMount() {
    // console.log(this.props.user.user, '`iiiiiiiiiiiiiiiii`');
    this.setState({isloading:true});
    this.getuser()
 
    this.setState({
 
      access_token: this.props.user.user.access_token,
   
    });
  }
  componentWillReceiveProps(nextProps) {
    // console.log(nextProps, 'nennnnnnnnnnnnnnn');
    if (nextProps.editProfile) {
      if (
        !nextProps.editProfile.failure &&
        !nextProps.editProfile.isFetching &&
        nextProps.editProfile.data.data &&
        nextProps.editProfile.data.success
      ) {
        this.setState({isloading: false});
        console.log(
          nextProps.editProfile.data.data,
          'nennnnnnnnnnnnnnnnnnnnnnn',
          this.setState({
            user:nextProps.editProfile.data.data,
            userDetails:nextProps.editProfile.data.data.details,
            dob:nextProps.editProfile.data.data.details.dob,
            showProfile:true,
            showUpdateProfile:false,
            isloading:false,
          })
        );
        let access_token = this.state.access_token;
        let obj = {access_token};
        console.log(obj);
        let user = nextProps.editProfile.data.data;
        user = {...user, ...obj};
        // nextProps.editProfile.data.data.access_token = this.state.access_token;
        console.log(
          user,
          nextProps.editProfile.data.data,
          'kkkkkkkkkkkjjjjjjjjjnnnnnnnnn',
        );
        // this._storeUserdata({user: user});
        // this.getData();
        // this.props.updateUser({user: user});
      } else if (
        nextProps.editProfile.failure &&
        !nextProps.editProfile.isFetching
      ) {
        this.setState({isloading: false});
        this.props.navigation.navigate('dashboard')
      }
    }
  }

  _storeUserdata = async user => {
    try {
      await AsyncStorage.setItem('@storage_Key', JSON.stringify(user));
      // this.props.updateUser(user)
    } catch (e) {
      // saving error
    }
  };

  openCamera = async get => {
    let options = {
      allowsEditing: true,
      aspect: [3, 3],
      noData: true,
      storageOptions: { skipBackup: true, path: 'images', cameraRoll: true, waitUntilSaved: true }
    };
    if (get == 0) {
      ImagePicker.launchCamera(options, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          let ImageObj = {
            uri: (Platform.OS==='android') ? response.uri : response.uri.replace('file://', ''),
            type: response.type,
            name: response.fileName,
          };
          console.log(response, 'kkkkkkjjjjjjjjjjjjjjjj');
          this.setState({profileImg: ImageObj});
        }
        // Same code as in above section!
      });
    }
  };
  renderOverlaySpinner = () => {
    const { isloading } = this.state;
    return <SpinnerLoader isloading={isloading} />;
  };
  onchangeName = e => {
    console.log("change ",e)
    this.setState({name: e});
  };
  onchangeDob = e => {
    this.setState({dob: e});
  };
  onchangeBio = e => {
    this.setState({bio: e});
  };

  oncahngeGraduation = e => {
    this.setState({graduation: e});
  };

  save = () => {
    const {user, userDetails, dob,access_token} = this.state;
    console.log("nameeeeeeeeee",this.state.name)
    console.log(userDetails);
    var bio;
    var graduation;
    var image;
    var name;
    var birthDate;
    var age;
    var today = new Date();
    console.log('dob', dob);
    // console.log(doob);
    if (this.state.bio == '' || this.state.bio == ' ') {
      bio = this.state.userDetails.bio;
    } else {
      bio = this.state.bio;
    }
    if (this.state.graduation == null) {
      graduation = this.state.userDetails.graduation;
    } else {
      graduation = this.state.graduation;
    }
    if (this.state.profileImg == null) {
      image = null;
    } else {
      image = this.state.profileImg;
    }
    if (this.state.name == '' || this.state.name == ' ') {
      name = this.state.user.name;
    } else {
      name = this.state.name;
    }
    if (dob !== null) {
      console.log(dob);
      birthDate = new Date(dob);
      age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        this.setState({dobErr: true});
        setTimeout(() => {
          this.setState({dobErr: false});
        }, 3000);
      } else {
        // console('asasasasasass');
        var payload = {
          id: this.state.user.id,
          bio: bio,
          graduation: graduation,
          image: image,
          name: name,
          dob: dob,
        };
        console.log(payload, 'payyyyyyyyyyyyyyy');
        var token = user.access_token;
        console.log(token);
        // this.setState({showProfile: true, showUpdateProfile: false})
        var datawithtoken = {token: access_token, payload: payload};
        this.setState({isloading:true})
        this.props.Edit_profile(datawithtoken);
        console.log(datawithtoken);
      }
    }
    // this.props.navigation.navigate('dashborad')
  };
  renderInputfield = (
    headerText,
    placeholder,
    ErrTxt,
    Iserr,
    onChangeText,
    image,
  ) => {
    // const [value, onChangeText] = React.useState('Useless Placeholder');
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
            // editable={false}
            placeholderTextColor="#b4b4b4"
            // secureTextEntry={rightIcon ? this.state.showpassword : false}
            // placeholder={placeholder}
            defaultValue={placeholder}
            onChangeText={text => {
              console.log(text)
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
  renderStartDatepicker = dob => {
    return (
      <DatePicker
        style={{width: Metrics.ratio(200)}}
        date={this.state.Dob}
        mode="date"
        date={dob}
        format="MM-DD-YYYY"
        minDate="01-05-1950"
        maxDate={moment(new Date()).format('MM-DD-YYYY')}
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        style={{
          width: Metrics.screenWidth * 0.9,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: '#b4b4b4',
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
              height: 1,
            },
            shadowOpacity: 0.18,
            shadowRadius: 1.0,
          },
          dateText: {
            // textAlign:"left",
            position: 'absolute',
            left: Metrics.ratio(0),
            color: '#b4b4b4',
          },
          dateInput: {borderColor: 'transparent'},
          placeholderText: {
            fontSize: Metrics.ratio(14),
            fontFamily: Fonts.type.regular,
            textAlign: 'left',
            position: 'absolute',
            left: Metrics.ratio(0),
            color: '#b4b4b4',
            marginRight: Metrics.ratio(10),
            // backgroundColor: "green"
          },
        }}
        onDateChange={date => {
          this.onchangeDob(date);
        }}
      />
    );
  };
  renderNumberInputfield = (
    headerText,
    placeholder,
    ErrTxt,
    Iserr,
    onChangeText,
    image,
    rightIcon,
    onRightIconClick,
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
            placeholderTextColor="#b4b4b4"
            // placeholder={placeholder}
            defaultValue={placeholder}
            keyboardType={'numeric'}
            onChangeText={text => {
              onChangeText(text);
            }}
          />
          {/* {rightIcon && <TouchableOpacity  style={{position:"absolute",right:Metrics.ratio(0)}} onPress={() => onRightIconClick()}>
            <Image source={this.state.showpassword ? Images.view : Images.hide} />
          </TouchableOpacity>} */}
        </View>
        {Iserr && (
          <View>
            <Text style={{color: 'red'}}>*{ErrTxt}</Text>
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
            multiline = {true}
            numberOfLines = {4}
            placeholderTextColor="#b4b4b4"
            // secureTextEntry={rightIcon ? this.state.showpassword : false}
            // placeholder={placeholder}
            defaultValue={placeholder}
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
  renderUpdateProfile = () => {
    const {user, userDetails, profileImg} = this.state;

    return (
      <View>
         <KeyboardAwareScrollView>
        <View style={styles.Profilecard}>
          
          <View>

            <View style={styles.ProfileImgContainer}>
              {profileImg ? (
                <Image
                  source={{uri: profileImg.uri}}
                  style={styles.profileImg}
                />
              ) : (
                <Image
                  source={{uri: userDetails.image_url}}
                  style={styles.profileImg}
                />
              )}
              <TouchableOpacity
                onPress={() => {
                  this.openCamera(0);
                }}
                style={{
                  position: 'absolute',
                  backgroundColor: '#f3f5f6',
                  padding: Metrics.ratio(10),
                  left: Metrics.ratio(70),
                  top: Metrics.ratio(70),
                  borderRadius: Metrics.ratio(50),
                }}>
                <Image source={Images.Camera} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={(styles.profileBody, {marginTop: Metrics.ratio(80)})}>
            {this.renderInputfield(
              'NAME',
              user.name,
              'Email Required',
              false,
              this.onchangeName,
              // Images.emailIcon
            )}

            {this.renderNumberInputfield(
              'GRADUATION YEAR',
              userDetails.graduation,
              'mobile No Required',
              false,
              this.oncahngeGraduation,
              // Images.mobileNumber
            )}
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  marginLeft: Metrics.ratio(10),
                  marginBottom: Metrics.ratio(5),
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: Metrics.ratio(14),
                    fontFamily: Fonts.type.demibold,
                  }}>
                  DATE OF BIRTH
                </Text>
                {this.renderStartDatepicker(this.state.dob)}
                {this.state.dobErr && (
                  <View>
                    <Text style={{color: 'red'}}>*You age must be 18+</Text>
                  </View>
                )}
              </View>
            </View>
            {this.renderInputArea(
              'BIO',
              userDetails.bio,
              'Required no of bags',
              false,
              this.onchangeBio,
            )}
          </View>
          {/* <View style={styles.BioBody}></View> */}
          <View
            style={{
              width: Metrics.screenWidth,

              flexDirection: 'row',
            }}>
            <TouchableOpacity
              style={{
                width: Metrics.screenWidth * 0.4,
                height: Metrics.ratio(45),
                marginLeft: Metrics.screenWidth * 0.05,
                marginTop: Metrics.ratio(20),
                backgroundColor: '#89f3ff',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: Metrics.ratio(30),
                // flexDirection: "row",
                elevation: 4,
                shadowColor: Colors.black,
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.18,
                shadowRadius: 1.0,
              }}
              onPress={() => {
                this.save();
              }}>
              <Text
                style={{
                  fontSize: Metrics.ratio(13),
                  color: 'black',
                  fontFamily: Fonts.type.demibold,
                }}>
                Save
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: Metrics.screenWidth * 0.4,
                height: Metrics.ratio(45),
                marginLeft: Metrics.screenWidth * 0.05,
                marginTop: Metrics.ratio(20),
                backgroundColor: '#89f3ff',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: Metrics.ratio(30),
                // flexDirection: "row",
                elevation: 4,
                shadowColor: Colors.black,
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.18,
                shadowRadius: 1.0,
              }}
              onPress={() => {
                this.setState({showProfile: true, showUpdateProfile: false});
              }}>
              <Text
                style={{
                  fontSize: Metrics.ratio(13),
                  color: 'black',
                  fontFamily: Fonts.type.demibold,
                }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        </KeyboardAwareScrollView>
      </View>
    );
  };
  
  renderProfile = () => {
    const {user, userDetails} = this.state;
    console.log(user, 'iiiiiiiiiiiiiiooooo');
    console.log(userDetails, 'userDetailsuserDetailsuserDetailsuserDetails');
    // console.log(userDetails)
    return (
      <View>
        <View style={styles.Profilecard}>
          <View style={styles.ProfileImgContainer}>
            {userDetails && userDetails.image_url && (
              <Image
                source={{uri: userDetails.image_url}}
                style={styles.profileImg}
              />
            )}
          </View>
          <View style={styles.UserName}>
            <Text style={styles.UserNameTxt}>
              {user && user.name && user.name}
            </Text>
            <StarRating
              disabled={true}
              maxStars={5}
              starSize={15}
              rating={this.state.starCount}
              fullStarColor={'#fec057'}
              selectedStar={rating => this.onStarRatingPress(rating)}
              containerStyle={{
                paddingTop: 5,
                marginTop: Metrics.ratio(5),
                width: Metrics.screenWidth * 0.25,
              }}
              starStyle={{
                paddingLeft: Metrics.ratio(0),
                paddingRight: Metrics.ratio(0),
              }}
            />
          </View>
          <View style={styles.profileBody}>
            <View style={styles.bodyTxt}>
              <Text style={styles.bodyHeading}>Email</Text>
              <Text style={styles.bodyFree}>  {user && user.email}</Text>
            </View>
            <View style={styles.bodyTxt}>
              <Text style={styles.bodyHeading}>Graduation Year</Text>
              {userDetails && userDetails.graduation !== null && (
                <Text style={styles.bodyFree}>
                  {' '}
                  {' '}
                  {userDetails &&
                    userDetails.graduation &&
                    userDetails.graduation}
                </Text>
              )}
             
            </View>
            <View style={styles.bodyTxt}>
              <Text style={styles.bodyHeading}>Date Of Birth</Text>
              {userDetails && userDetails.dob && (
                <Text style={styles.bodyFree}>  {userDetails.dob}</Text>
              )}
              
            </View>
          </View>
          
          <View style={styles.BioBody}>
            <Text style={styles.bodyHeading}>Bio</Text>
            {/* {!userDetails.bio && <Text style={styles.TxtBio}></Text>} */}

            {userDetails && userDetails.bio && (
              <Text style={styles.TxtBio}>{userDetails.bio}</Text>
            )}
          </View>
          <View
            style={{
              width: Metrics.screenWidth,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
           {userDetails && <TouchableOpacity
              style={styles.submitButtonView}
              onPress={() => {
                this.setState({showProfile: false, showUpdateProfile: true});
              }}>
              <Text
                style={{
                  fontSize: Metrics.ratio(13),
                  color: 'black',
                  fontFamily: Fonts.type.demibold,
                }}>
                EDIT
              </Text>
            </TouchableOpacity>}
          </View>
        </View>
      </View>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <Header
          headerText={'BRAINWASH PROFILE'}
          leftIcon={Images.LeftArrow}
          // headerIconStyle={{marginLeft: Metrics.ratio(15)}}
          // headerTextStyle={{marginLeft: Metrics.ratio(20)}}
          leftBtnPress={() => this.props.navigation.navigate('dashboard')}
        />
        <ScrollView keyboardShouldPersistTaps="always">
          <View style={{marginBottom: Metrics.ratio(80)}}>
            {this.state.showProfile && this.renderProfile()}
            {this.state.showUpdateProfile && this.renderUpdateProfile()}
          </View>
        </ScrollView>
        {this.renderOverlaySpinner()}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: state.userReducer.user,
  profile: state,
  editProfile: state.editProfile,
});

const actions = {
  updateUser,
  removeUser,
  Edit_profile,
};

export default connect(
  mapStateToProps,
  actions,
)(ProfileScreeen);
