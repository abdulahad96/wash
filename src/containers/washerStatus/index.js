// @flow
import { connect } from "react-redux";
import React, { Component } from "react";
import { Text, View, StyleSheet, TextInput, Image, Dimensions,Alert, TouchableOpacity } from "react-native";
import styles from "./styles";
import { Header } from "../../components";
import { Fonts, Metrics, Images } from "../../theme";
import { Actions } from 'react-native-router-flux';
import { TabView, SceneMap } from 'react-native-tab-view';
import moment from 'moment';
import { ScrollView } from "react-native-gesture-handler";
import SpinnerLoader from '../../components/spinner';
import { request as Accepted_order_request } from '../../actions/acceptedOrder';
import StatusScreen from './statusScreen'; 
import firebase from 'react-native-firebase';

class WashstatusScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      new:null,
      pickup:null,
      washer:null,
      Dryer:null,
      Folded:null,
      DropOff:null,
      routeIndex: 0,
      isloading:false,
      preTxt:null,
      success: false,previousIndex:null,

    };
  }
componentDidMount(){
 this.getAcceptedOrder()
// this.setState({isloading:true})
}
  componentWillReceiveProps(nextProps) {
    this.setState({success: false})
    console.log(nextProps.changeStatus,"=================================>")
    if (nextProps.acceptedOrder) {
      var neworders = [];
      var pickup = [];
      var washer = [];
      var dryer = [];
      var folded = [];
      var dropoff = [];

      if (
        !nextProps.acceptedOrder.failure &&
        !nextProps.acceptedOrder.isFetching &&
        nextProps.acceptedOrder.data.data &&
        nextProps.acceptedOrder.data.success === true 
      ) {
        console.log(nextProps.acceptedOrder.data.data,"Aceeeeeeeeaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
        for(var i = 0 ; i < nextProps.acceptedOrder.data.data.length; i++){
          if(nextProps.acceptedOrder.data.data[i].status===1){
            console.log("hello")
            neworders.push(nextProps.acceptedOrder.data.data[i]);
          }
          else if(nextProps.acceptedOrder.data.data[i].status===2){
            console.log('pickup')
            pickup.push(nextProps.acceptedOrder.data.data[i]);
          }
          else if(nextProps.acceptedOrder.data.data[i].status===3){
            console.log('wash')
            washer.push(nextProps.acceptedOrder.data.data[i]);
          }
          else if(nextProps.acceptedOrder.data.data[i].status===4){
            console.log('dryer')
            dryer.push(nextProps.acceptedOrder.data.data[i]);
          }
          else if(nextProps.acceptedOrder.data.data[i].status===5){
            console.log('folded')
            folded.push(nextProps.acceptedOrder.data.data[i]);
          }
          else if(nextProps.acceptedOrder.data.data[i].status===6){
            console.log('dropoff')
            dropoff.push(nextProps.acceptedOrder.data.data[i]);
          }
        }
        this.setState({
          
          new:neworders,
          pickup:pickup,
          Dropoff:dropoff,
          Dryer:dryer,
          washer:washer,
          Folded:folded
          // order: nextProps.order.data.data
        },() => {
        setTimeout(() => {
          this.setState({success: true,isloading:false,})
      
        }, 5000);
        });
        
      }
      else if (nextProps.acceptedOrder.failure && !nextProps.acceptedOrder.isFetching) {
        this.setState({isloading: false});
      }
    }
  }


  

  getAcceptedOrder = () => {
    this.setState({success:false,isloading:true})
    console.log("hellllllllllllllllllll")
    console.log(this.props);
    console.log("propsssssssssssssss",this.props.user)
    var data = {
      access_token: this.props.user.user.access_token,
       user_id: this.props.user.user.id,
    
     }
     this.props.Accepted_order_request(data);
    
  }
 
  
  renderOverlaySpinner = () => {
    const { isloading } = this.state;
    return <SpinnerLoader isloading={isloading} />;
  };
  tab = (txt, activation, index, routeindex) => {
    const {pickup, Dropoff, Dryer, washer, Folded} = this.state
   
    if(routeindex === 0 && pickup.length == 0){
      
            // Alert.alert('SUCCESSFUL','no data', [

            //     { text: 'OK', onPress: () => console.log('OK Pressed') },
                
            //   ]);
       
    }
    return (
      <View style={{ paddingHorizontal: Metrics.ratio(10) }}>

        {index !== routeindex && <TouchableOpacity
          // style={{ borderBottomColor: 'black', borderBottomWidth: Metrics.ratio(2) }}
          onPress={() => {
            console.log("index",index)

            this.setState({ activeNavigation: activation,previousIndex:routeindex, routeIndex: index });
            // Actions.ownProject();
          }}
        >
          <Text style={{height:Metrics.ratio(20)}}>{txt}</Text>
        </TouchableOpacity>}
      
        {index === routeindex && <TouchableOpacity
          style={{ borderBottomColor: 'black', borderBottomWidth: Metrics.ratio(2) }}
          onPress={() => {
            this.setState({ activeNavigation: activation,previousIndex:routeindex, routeIndex: index });
            // Actions.ownProject();
            // console.log("index",index)
          }}
        >
          <Text style={{height:Metrics.ratio(20)}}>{txt}</Text>
        </TouchableOpacity>}
      
      </View >
    )
  }
  renderNavigateButton = () => {
    const { activeNavigation } = this.state;
    return (
      <View
        style={{
          // marginHorizontal: Metrics.ratio(25),
          flexDirection: "row",
          // justifyContent: "center",
          marginTop: Metrics.ratio(25),
          height: Metrics.ratio(40),
          // width: Metrics.screenWidth * 0.865,

        }}
      >
        <ScrollView  style={{borderBottomWidth:Metrics.ratio(1),borderBottomColor:'black'}} horizontal={true} showsHorizontalScrollIndicator={false}>
          {this.tab('NEW', true, 0, this.state.routeIndex)}
          {this.tab('PICK UP', false, 1, this.state.routeIndex)}
          {this.tab('WASHER', false, 2, this.state.routeIndex)}
          {this.tab('DRYER', false, 3, this.state.routeIndex)}
          {this.tab('FOLDED', false, 4, this.state.routeIndex)}
          {this.tab('DROP OFF', false, 5, this.state.routeIndex)}
        </ScrollView>
      </View>
    );
  };

  FirstRoute = () => (
    // console.log(this.state.new)
    // <View style={[styles.scene, { backgroundColor: '#ff4081' }]} />
    <StatusScreen order={this.state.new} type="new" getAcceptedOrder={()=>{this.getAcceptedOrder()}} {...this.props} />
  );
  SecondRoute = () => (
    <StatusScreen order={this.state.pickup} type="picup" getAcceptedOrder={()=>{this.getAcceptedOrder()}} {...this.props} />
    // <View style={[styles.scene, { backgroundColor: 'blue' }]} />
  );
  ThirdRoute = () => (
    <StatusScreen order={this.state.washer} type="wash" getAcceptedOrder={()=>{this.getAcceptedOrder()}} {...this.props} />
    // <View style={[styles.scene, { backgroundColor: 'yellow' }]} />
  );
  FourthRoute = () => (
    <StatusScreen order={this.state.Dryer} type="dry" getAcceptedOrder={()=>{this.getAcceptedOrder()}} {...this.props} />
    // <View style={[styles.scene, { backgroundColor: 'red' }]} />
  );
  FifthRoute = () => (
    <StatusScreen order={this.state.Folded} type="fold" getAcceptedOrder={()=>{this.getAcceptedOrder()}} {...this.props} />
    // <View style={[styles.scene, { backgroundColor: 'green' }]} />
  );
  SixthRoute = () => (
    <StatusScreen order={this.state.Dropoff} type="dropoff" getAcceptedOrder={()=>{this.getAcceptedOrder()}} {...this.props} />
    // <View style={[styles.scene, { backgroundColor: 'pink' }]} />
  );


showtab = ()=>{
  let route = {
    index: this.state.routeIndex,
    routes: [
      { key: "first", title: "ReportAgencyScreen" },
      { key: "second", title: "ReportIndividualScreen" },
      { key: "third", title: "ReportAgencyScreen" },
      { key: "fourth", title: "ReportIndividualScreen" },
      { key: "fifth", title: "ReportAgencyScreen" },
      { key: "sixth", title: "ReportIndividualScreen" }
    ]
  };
  return(
    <TabView
          swipeEnabled={false}
          navigationState={route}
          renderScene={SceneMap({
            first: this.FirstRoute,
            second: this.SecondRoute,
            third:this.ThirdRoute,
            fourth:this.FourthRoute,
            fifth:this.FifthRoute,
            sixth:this.SixthRoute
          })}
          onIndexChange={index => this.setState({ index })}
          initialLayout={{ width: Metrics.screenWidth }}
          renderTabBar={() => {
            return <View>{this.renderNavigateButton()}</View>;
          }}
        />
  )
}
showAlert = (txt)=>{

  // Alert.alert('Alert!',txt, [


  //   { text: 'OK', onPress: () => console.log('OK Pressed') },
    
  // ]);
  
  
}

  render() {
    const {routeIndex,previousIndex,success} =this.state
    console.log(this.state,"as","shabash")
    console.log("as",routeIndex,previousIndex)
  
    let route = {
      index: this.state.routeIndex,
      routes: [
        { key: "first", title: "ReportAgencyScreen" },
        { key: "second", title: "ReportIndividualScreen" },
        { key: "third", title: "ReportAgencyScreen" },
        { key: "fourth", title: "ReportIndividualScreen" },
        { key: "fifth", title: "ReportAgencyScreen" },
        { key: "sixth", title: "ReportIndividualScreen" }
      ]
    };
   
    if(this.state.new && success && previousIndex != routeIndex  && routeIndex === 0 && this.state.new.length ===0){
      
      setTimeout(() => {
        this.showAlert('No New Request Found')
      }, 5000);
    }
    if(this.state.pickup && success && previousIndex != routeIndex  && routeIndex === 1 && this.state.pickup.length ===0){
      
 
      this.showAlert('No Washes To Pick Up')
   
    }

  if(this.state.washer && success && routeIndex !=previousIndex && routeIndex === 2 && this.state.washer.length ===0){
  
   
      this.showAlert('No Washes In Washer Found')
   
   
}

if(this.state.Dryer && success && previousIndex != routeIndex  && routeIndex === 3 && this.state.Dryer.length ===0){
 
 
    this.showAlert('No Washes In Dryer')

}
if(this.state.Folded && success && previousIndex != routeIndex  && routeIndex === 4 && this.state.Folded.length ===0){
  
    this.showAlert('No Washes In Folding')
 
}
if(this.state.Dropoff && success && previousIndex != routeIndex  && routeIndex === 5 && this.state.Dropoff.length ===0){
  
    this.showAlert('No Washes to Drop Off')
  
}

    return (
      <View style={styles.container}>
        <Header
          headerText={"LAUNDRY STATUS"}
          leftIcon={Images.LeftArrow}
          leftBtnPress={() => {
            Actions.pop()
          }}
          headerIconStyle={{marginLeft: Metrics.ratio(30)}}
          headerTextStyle={{marginLeft: Metrics.ratio(40)}}

        />
        {success && this.showtab()}
        {this.renderOverlaySpinner()}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.userReducer.user,
  acceptedOrder:state.acceptedOrder,
  changeStatus:state
});

const actions = {
  Accepted_order_request
};

export default connect(
  mapStateToProps,
  actions
)(WashstatusScreen);
