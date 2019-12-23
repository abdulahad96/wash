// @flow
import { connect } from 'react-redux';
import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    Image,
    ScrollView, TouchableOpacity
} from 'react-native';
import styles from './styles';
import { Header } from '../../components';
import { Fonts, Metrics, Images } from '../../theme';
import axios from 'axios';


class MapInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            suggestedPlaces: [],
            text: this.props.place,
            lat: null,
            lng: null,
            discription: null,
            changeTxt: false
        };
    }
    componentDidMount() {
        console.log(this.props)

    }
componentWillReceiveProps(nextprops){
    console.log(nextprops)
    this.setState({text:nextprops.place})
}
    getdata = (e) => {
        this.setState({ text: e, changeTxt: false })
        setTimeout(() => {
            this.setState({ changeTxt: true })
        }, 1500);

        // console.log()
        // if (this.state.changeTxt == true) {
            axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${e}&key=AIzaSyCIGENLCfCwZwPaumiUQs21GfgMhgppa7s&language=en`).then((res) => {
                console.log(res, "count")
                this.setState({ suggestedPlaces: res.data.predictions })
            }).catch((err) => { console.log(err) })
        // }
    }


    getlatlng = (data) => {
        console.log(data)
        axios.get(`https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyCIGENLCfCwZwPaumiUQs21GfgMhgppa7s&placeid=${data.place_id}&language=en`).then((res) => {
            console.log(res)
            this.setState({ lat: res.data.result.geometry.location.lat, lng:  res.data.result.geometry.location.lat, suggestedPlaces: [] })
            this.props.getpicklatLng( res.data.result.geometry.location.lat, res.data.result.geometry.location.lat)

        }).catch((err) => { console.log(err) })
    }
    render() {
        const { location, suggestedPlaces } = this.state;
      
        return (
            <View>
                <View style={{
                    // ...StyleSheet.absoluteFillObject,
                    // height: Metrics.screenHeight,
                    // width: Metrics.screenWidth,
                    // justifyContent: 'flex-end',
                    // alignItems: 'center',
                }}>
                </View>
                <View style={{ position: "absolute", width: Metrics.screenWidth, justifyContent: 'center', paddingHorizontal: 10, top: Metrics.ratio(0), backgroundColor: "#b4b4b4" }}>
                    {/* <Text style={{textAlign:'center'}}>{this.state.place}</Text> */}
                    <View style={{ marginVertical: Metrics.ratio(10), backgroundColor: "white", paddingVertical: Metrics.ratio(-15), height: Metrics.ratio(35), borderRadius: Metrics.ratio(15) }}>
                        <TextInput style={{}} editable={true} value={this.state.text} placeholder={this.props.headerTxt} onChangeText={(e) => { this.getdata(e) }} />
                    </View>
                    <ScrollView>
                        <View style={{ flexDirection: "column", backgroundColor: 'white' }}>

                            {suggestedPlaces.map((v, i) => {
                                console.log(v, "assssssssssssssssssssss")
                                return (
                                    <TouchableOpacity onPress={() => {
                                        this.setState({ text: v.description })
                                        this.getlatlng(v)
                                    }}>
                                        <View style={{ borderBottomWidth: Metrics.ratio(1), padding: Metrics.ratio(10) }}><Text>{v.description}</Text></View>
                                    </TouchableOpacity>
                                )
                            })}

                        </View>
                    </ScrollView>
                 </View>

            </View>
        );
    }
}



export default MapInput;
