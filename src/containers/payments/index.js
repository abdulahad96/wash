// @flow
import { connect } from 'react-redux';
import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    Image,
    ScrollView,
    TouchableOpacity,
    Alert
} from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import styles from './styles';
import { Header } from '../../components';
import qs from "qs";
import { Fonts, Metrics, Images } from '../../theme';
import DatePicker from 'react-native-datepicker';
import { Actions } from 'react-native-router-flux';
import { request as transaction_request } from '../../actions/transaction';
import SpinnerLoader from '../../components/spinner';
import moment from 'moment';
import { request as get_wallet } from '../../actions/walletAction';
import { request as post_wallet } from '../../actions/postWalletAction';

class PaymentScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: null,
            isloading: false,
            paymentId: null,
            approvalUrl: null,
            isPackageModel: false,
            packageName: null,
            packageDetail: null,
            accessToken: null,
            tokenType: null,
            Orderobject:null,
            paid:false,
            saveamount:null
        };
    }

    componentWillReceiveProps(nextProps) {
        console.log('if se pppppppppppppppp', nextProps);
        if (nextProps.transaction) {
            // console.log('if se pppppppppppppppp', nextProps);
            if (
                !nextProps.postwallet.failure &&
                !nextProps.postwallet.isFetching &&
                nextProps.postwallet.data.data &&
                nextProps.postwallet.data.success === true
            ) {
                
                  if(this.state.paid == false){
                      this.setState({paid:true})
                      this.handleWallet(0-Number(this.state.Orderobject.price))
                  }
                  else if(this.state.paid == true){
                    Alert.alert('SUCCESSFUL', nextProps.postwallet.data.message, [

                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                        
                      ]);
                      this.props.get_wallet({user_id:this.props.user.user.id,access_token:this.props.user.user.access_token})
                    this.props.navigation.navigate('dashboard');  
                  }
                //   this.props.navigation.navigate('dashboard');
                // this.setState({ orders: nextProps.washHistory.data.data });
                // this.setState({ isloading: false });
            }
        }
    }
    componentDidMount() {
       
        console.log(this.props.orderDetails, 'prooooooooooooooooooooooooooops')
    }
    componentWillMount() {
        this.setState({Orderobject:this.props.orderDetails});
        this.getToken();
        this.handlePackageName()
        // this.getData();
    }
    renderOverlaySpinner = () => {
        const { isloading } = this.state;
        return <SpinnerLoader isloading={isloading} />;
    };
    getToken = () => {
        axios
            .post(
                "https://api.sandbox.paypal.com/v1/oauth2/token",
                qs.stringify({
                    grant_type: "client_credentials"
                }),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Authorization: `Basic QVV2TWp6VEZtRXg0X1R0OE9wV2ZNVS1aUTlaekVZcGlQYjI2OG82OVZSdTdhU25veldNV1ZOT3h6X2ZZWDMxQWRWUV93ZkNiZEZIcnA1OFo6RUpTV1lDT282MWNBVXNjQ2ZJMzhCZmFRc1RlZU1LQy1PODg0a2REMHNRU1NvSHNHMGFTaEJuVE9XMHpoVDZVNnRMaWxBOVJwWEhTRE85RFY=` // your Authorization value you get from postman api hit
                    }
                    // headers: {
                    //     "Content-Type": "application/x-www-form-urlencoded",
                    //     Authorization: `Bearer A21AAGs3g1vqcga6xxxAhpptfQclyCBD--_273lfL11CWXj_0t4xwzBXaAWEOQiyLa9GTW5a_7VvQwnB3ev78F8Yne_NJICwg` // your Authorization value you get from postman api hit
                    // }
                }
            )
            
            .then(response => {
                console.log(response.data.access_token, response.data);
                this.setState({
                    accessToken: response.data.access_token,
                    tokenType: response.data.token_type
                });
            })
            .catch(err => {
                console.log("error", { ...err });
            });
    };


    handlePackeges = () => {
        const { packageDetail, accessToken, tokenType } = this.state;

        axios
            .post(
                "https://api.sandbox.paypal.com/v1/payments/payment",
                packageDetail,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `${tokenType} ${accessToken}`
                    }
                }
            )
            .then(response => {
                const { id, links } = response.data;
                console.log(response.data)
                const approvalUrl = links.find(data => data.rel == "approval_url");
                this.setState({
                    paymentId: id,
                    approvalUrl: approvalUrl.href
                });
            })
            .catch(error => {
                console.log({ ...error });
            });
    };
handleWallet = (e)=>{
    console.log(e,"wallet")
    var data = {amount:e,user_id:this.props.user.user.id,token:this.props.user.user.access_token, order_id:this.state.Orderobject.order_id,status:2}
   this.props.post_wallet(data)

}
    handlePackageName = packageName => {
        var amount = this.props.orderDetails.price- Number(this.props.wallet.data.data.replace("$", ""))
        // amount.toFixed(2)
console.log(amount.toFixed(2),"Heeeeeeeeeeeeeeeeeeee")
        console.log(typeof this.props.orderDetails.price,this.props.wallet.data.data,amount.toString(),"price")
        let packageDetail = JSON.stringify({
            intent: "sale",
            payer: {
                payment_method: "paypal"
            },
            redirect_urls: {
                return_url: "https://example.com/process",
                cancel_url: "https://example.com/cancel"
            },
            transactions: [
                {
                    amount: {
                        total:amount.toFixed(2),
                        // total: (Number(this.props.orderDetails.price)- Number(this.props.wallet.data.data.replace("$", ""))).toString(),
                        currency: "USD"
                    },
                    description: "This is the payment transaction description."
                }
            ]
        });
        this.setState(
            {
                packageDetail: packageDetail,
                isPackageModel: false
            })
    };


    _onNavigationStateChange = webViewState => {
        const { tokenType, accessToken } = this.state;
        if (webViewState.url.includes("https://example.com/process")) {
            this.setState({
                approvalUrl: null
            });

            var query = webViewState.url;

            query = query.split("+").join(" ");

            var params = {},
                tokens,
                re = /[?&]([^=]+)=([^&]*)/g;

            while ((tokens = re.exec(query))) {
                params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
            }

            let paymentId = params.paymentId;
            let payerId = params.PayerID;

            axios
                .post(
                    `https://api.sandbox.paypal.com/v1/payments/payment/${paymentId}/execute`,
                    { payer_id: payerId },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `${tokenType} ${accessToken}`
                        }
                    }
                )
                .then(response => {
                    console.log(response, "resssssssssssssssssssssssd")
                    if (response.data.state === "approved") {
                        // this.validate();
                        var approvedData = {
                            cart:response.data.cart,
                            payment_id:response.data.id,
                            order_id:this.state.Orderobject.order_id,
                            user_id:this.props.user.user.id,
                            payment_method:response.data.payer.payment_method,
                            create_time:response.data.create_time,
                            payer:response.data.payer,
                            amount:response.data.transactions[0].amount.total,
                            currency:response.data.transactions[0].amount.currency,
                            state:response.data.state
                           
                        }
                        var dataWithtoken = {payload:approvedData,token:this.props.user.user.access_token}
                        console.log(dataWithtoken,"datawithtoken");
                        // this.props.transaction_request(dataWithtoken)
                        this.handleWallet(response.data.transactions[0].amount.total)
                        this.setState({saveamount:response.data.transactions[0].amount.total})
                        

                    }
                    console.log(response);
                })
                .catch(err => {
                    console.log({ ...err });
                });
        }
    };

    renderOrder = order => {
        // console.log(this.props.wallet)
        var wallet = this.props.wallet.data.data.replace("$", "");
        return (
            <View>
                <View style={styles.statuscard}>


                    <View style={styles.statusBody}>
                        <View style={{ alignSelf: 'center', marginBottom: Metrics.ratio(20), borderRadius: Metrics.ratio(50), backgroundColor: '#f3f5f6', padding: Metrics.ratio(30) }}>
                        {this.state.Orderobject && this.state.Orderobject.price &&(<Text
                                style={{
                                    textAlign: "center",
                                    fontFamily: Fonts.type.demibold,
                                    fontSize: Metrics.ratio(18),

                        }}>{Number(this.state.Orderobject.price)}</Text>)}
                            <Text style={{ textAlign: "center" }}>$</Text>
        </View>       
        <View style={styles.bodyTxt,{flexDirection:"row",backgroundColor:'#f3f5f6',padding:Metrics.ratio(15),marginRight:Metrics.ratio(10),borderRadius:Metrics.ratio(15)}}>
                            <Text style={{
                                fontFamily: Fonts.type.regular,
                                fontSize: Metrics.ratio(14),
                                fontWeight: 'bold',
                                
                            }}>Wallet  </Text>
                            <Text style={{
                                fontFamily: Fonts.type.regular,
                                fontSize: Metrics.ratio(14),
                                // fontWeight: 'bold',
                                
                            }}>{Number(wallet)}$ - {Number(this.state.Orderobject.price)}$ = {Number(wallet)-Number(this.state.Orderobject.price)}$</Text>
                        </View>  
                        {/* <View style={styles.bodyTxt}>
                            <Text style={{
                                fontFamily: Fonts.type.regular,
                                fontSize: Metrics.ratio(14),
                                fontWeight: 'bold'
                            }}>Recommended Payment Method(s)</Text>
                        </View> */}


                    </View>
                    {(Number(wallet) - Number(this.state.Orderobject.price))  < 0 && <TouchableOpacity
                        onPress={() => {
                            this.handlePackeges();
                        }}>
                        <View style={{ backgroundColor: '#f3f5f6', marginHorizontal: Metrics.ratio(10), marginTop: Metrics.ratio(10) }}>

                            <Image
                                style={{
                                    width: Metrics.ratio(100),
                                    height: Metrics.ratio(56),
                                    marginBottom: Metrics.ratio(15),
                                }}
                                resizeMethod="auto"
                                resizeMode="cover"
                                source={Images.Paypal} />

                        </View>
                    </TouchableOpacity>}
                    {((Number(wallet) - Number(this.state.Orderobject.price))  > 0 || (Number(wallet) - Number(this.state.Orderobject.price)) == 0) && <TouchableOpacity
                        onPress={() => {
                            this.setState({paid:true})
                            this.handleWallet(0-Number(this.state.Orderobject.price));
                        }}>
                        <View style={{ backgroundColor: '#f3f5f6', marginHorizontal: Metrics.ratio(10), marginTop: Metrics.ratio(10) }}>
<View style={{flexDirection:"row",padding:Metrics.ratio(10)}}>
                            <Image
                                style={{
                                    // width: Metrics.ratio(100),
                                    // height: Metrics.ratio(56),
                                    // marginBottom: Metrics.ratio(15),
                                }}
                                resizeMethod="auto"
                                resizeMode="cover"
                                source={Images.Wallet} />
<Text style={{  fontFamily: Fonts.type.regular,
                                fontSize: Metrics.ratio(14),
                                fontWeight: 'bold',marginTop:Metrics.ratio(5)}}> PAY FROM WALLET</Text>
</View>
                        </View>
                    </TouchableOpacity>}
                </View>

            </View>
        );
    };
    render() {
        const { approvalUrl } = this.state;
        console.log(approvalUrl)
        return (
            <View style={styles.container}>
                <Header
                    headerText={'PAYMENT'}
                    leftIcon={Images.LeftArrow}
                    leftBtnPress={() => this.props.navigation.navigate('dashboard')}
                    headerIconStyle={{ marginLeft: Metrics.ratio(50) }}
                    headerTextStyle={{ marginLeft: Metrics.ratio(60) }}
                />
                {approvalUrl ? (
                    <WebView
                        style={{ height: Metrics.screenHeight, width: Metrics.screenWidth }}
                        source={{ uri: approvalUrl }}
                        onNavigationStateChange={this._onNavigationStateChange}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        startInLoadingState={false}
                    // style={{ marginTop: 0 }}
                    />
                ) :
                    (<View>
                        <ScrollView style={{ marginBottom: Metrics.ratio(80) }}>
                            {this.renderOrder()}
                        </ScrollView>
                    </View>)}
                {this.renderOverlaySpinner()}
            </View>
        );
    }
}

const mapStateToProps = state => ({
    user: state.userReducer.user,
    transaction: state.transaction,
    wallet:state.wallet,
    postwallet:state.postwallet
});

const actions = { transaction_request,get_wallet,post_wallet };

export default connect(
    mapStateToProps,
    actions,
)(PaymentScreen);
