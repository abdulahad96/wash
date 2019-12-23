// @flow
import { connect } from "react-redux";
import React, { Component } from "react";
import { Text, View, StyleSheet, TextInput, Image,ScrollView } from "react-native";
import styles from "./styles";
import { Header } from "../../components";
import { Fonts, Metrics, Images } from "../../theme";
import {Actions} from 'react-native-router-flux';
import {GetPages} from '../../config/simpleApiCall';
import SpinnerLoader from '../../components/spinner';
import moment from 'moment';
class AboutScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
     message: null,
    };
  }




  componentWillMount() {
  this.getData();
  }

  getData = () => {
  GetPages().then(response=>{
    console.log(response)
    this.setState({message:response.data.data[1]})
  }).catch(error=>{
      console.log(error)
  })
  };
  renderOverlaySpinner = () => {
    const {isloading} = this.state;
    return <SpinnerLoader isloading={isloading} />;
  };

render() {


  return (
    <View style={styles.container}>
      <Header
        headerText={'ABOUT US'}
        leftIcon={Images.LeftArrow}
        leftBtnPress={() => {
          Actions.pop();
        }}
        headerIconStyle={{marginLeft: Metrics.ratio(40)}}
        headerTextStyle={{marginLeft: Metrics.ratio(50)}}
      />
      <View>
        <ScrollView style={{}}>
         {/* <Text style={{fontSize:Metrics.ratio(24),textAlign:'center'}}>
             About Us
         </Text> */}
         {this.state.message && <Text style={{width:Metrics.screenWidth * 0.9,marginVertical:Metrics.ratio(50),textAlign:'center',justifyContent:'center',alignSelf:'center',fontSize:Metrics.ratio(18)}}>
             {this.state.message.content}
             </Text>}
        </ScrollView>
      </View>
      {this.renderOverlaySpinner()}
    </View>
  );
}
}

const mapStateToProps = (state) => ({
 

});

const actions = {
 
};
export default connect(
  mapStateToProps,
  actions
)(AboutScreen);
