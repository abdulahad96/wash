// @flow
import { StyleSheet } from "react-native";
import { Colors, Metrics, Fonts } from "../../theme";

export default StyleSheet.create({
    container: {
        width: Metrics.screenWidth,
        height: Metrics.screenHeight,
        backgroundColor: "#f3f5f6" //#0f5997
    },
    statuscard: {
        width: Metrics.screenWidth * 0.95,
        marginLeft: Metrics.screenWidth * 0.025,
        borderRadius: Metrics.ratio(10),
        marginTop: Metrics.ratio(100),
        marginBottom: Metrics.ratio(100),
        paddingVertical: Metrics.ratio(20),
        backgroundColor: "white",
        elevation: 8,
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
        flexDirection: 'column'
    },
    statusHead: {
        // justifyContent:"center",
        alignItems: "center",
        borderBottomWidth: 2,
        borderBottomColor: '#b4b4b4',
        // flex:1,
    },
    statusHeadTxt: {
        fontFamily: Fonts.type.demibold,
        fontSize: Metrics.ratio(18),
        color: 'black'
    },
    statusImg: {
        marginLeft: Metrics.ratio(10),
        marginTop: Metrics.ratio(10),
        flexDirection: 'row'
        // flex:1,
    },
    statusBody: {
        // flex:1,
        marginTop: Metrics.ratio(10),
        marginLeft: Metrics.ratio(10)
    },
    bodyTxt: {
        flexDirection: "row",
        marginTop: Metrics.ratio(5)
    },
    bodyFree: {
        fontFamily: Fonts.type.demibold,
        fontSize: Metrics.ratio(14),
        color: '#b4b4b4',
    },
    bodyProp: {
        fontFamily: Fonts.type.regular,
        fontSize: Metrics.ratio(14),
        color: 'black',
    },
    bodyHeading: {
        fontFamily: Fonts.type.demibold,
        fontSize: Metrics.ratio(14),
        color: 'black',
    },

    UserName: {
        marginTop: Metrics.ratio(30),
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: '#b4b4b4',
        borderBottomWidth: Metrics.ratio(1)
    },
    ProfileImgContainer: {
        width: Metrics.ratio(110),
        height: Metrics.ratio(110),
        borderColor: '#b4b4b4',
        borderWidth: 1,
        borderRadius: Metrics.ratio(100),
        position: 'absolute',
        top: Metrics.ratio(-60),
        left: Metrics.ratio(120),
        backgroundColor: 'grey',
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
        elevation: 4
    },
    profileImg: {
        width: Metrics.ratio(110),
        height: Metrics.ratio(110),
        borderRadius: 100,
    },
    userDetail: {
        position: 'absolute',
        left: Metrics.ratio(70),
        top: Metrics.ratio(10)
    },
    userName: {
        fontFamily: Fonts.type.demibold,
        fontSize: Metrics.ratio(16),
        color: 'black'
    },
    userEmail: {
        color: '#b4b4b4'

    },
    dropDown: {
        marginTop: Metrics.ratio(40),
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        alignContent: 'center',
    },
    dropDownheading: {
        flexDirection: "row",
        backgroundColor: '#89f4ff',
        height: Metrics.ratio(50),
        width: Metrics.screenWidth * 0.80,
    },
    dropDownheadingTxt: {

        marginVertical: Metrics.ratio(15),
        marginHorizontal: Metrics.ratio(10),
        fontFamily: Fonts.type.demibold,
        fontSize: Metrics.ratio(16),
        color: 'white',
        width: Metrics.screenWidth * 0.65
    },
    dropDownBody:
    {
        backgroundColor: 'white',
        elevation: 4,
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,

    },
    dropDownbodyListTxt: {
        marginVertical: Metrics.ratio(15),
        marginHorizontal: Metrics.ratio(10),
        fontFamily: Fonts.type.regular,
        fontSize: Metrics.ratio(16),
        color: 'black',
     
        width: Metrics.screenWidth * 0.65

    },
    dropdownList:
    {
        borderBottomWidth:Metrics.ratio(1),
        borderBottomColor:'#b4b4b4',
        flexDirection: "row",
        height: Metrics.ratio(50),
        width: Metrics.screenWidth * 0.80
    }
});
