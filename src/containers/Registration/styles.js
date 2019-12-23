// @flow
import { StyleSheet } from "react-native";
import { Colors, Metrics, Fonts } from "../../theme";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f5f6"
  },
  logoheaderView: {
    height: Metrics.screenHeight * 0.08,
    justifyContent: "center",
    alignItems: "center",
    marginBottom:Metrics.ratio(10),

    flexDirection: "row"
  },
  headerView: {
    height: Metrics.screenHeight * 0.05,
    // backgroundColor: "#0f5997",
    // justifyContent: "center",
    // alignItems: "left",
    marginLeft: Metrics.ratio(10),
    flexDirection: "row"
  },
  radioGroup:{
    flexDirection: "row",
  },
  radioOptions:{
    // flexDirection:"col",
    color:"#b4b4b4",
    borderColor:"#b4b4b4",
  },
  headerText: {
    color: "black",
    // fontSize: Metrics.ratio(15),
    fontFamily: Fonts.type.demibold,
    fontSize:Metrics.ratio(19)
  },
  bodyView: {
    width: Metrics.screenWidth * 0.95,
    marginHorizontal: Metrics.screenWidth * 0.025,
    marginTop: Metrics.screenHeight * 0.015,
    marginBottom: Metrics.ratio(10),
    borderRadius: Metrics.ratio(10),
    backgroundColor: "#ffffff",
    paddingVertical: Metrics.ratio(20),
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  inputFieldView: {
    width: Metrics.screenWidth * 0.9,
    marginHorizontal: Metrics.screenWidth * 0.025
  },
  inputnameFieldView: {
    width: Metrics.screenWidth * 0.35,
    
    marginHorizontal: Metrics.screenWidth * 0.025
  },
  inputFieldHeaderText: {
    color: "black",
    fontSize: Metrics.ratio(14),
    fontFamily: Fonts.type.demibold
  },
  inputnameField: {
    width: Metrics.screenWidth * 0.4,
    paddingLeft: Metrics.ratio(3),
    paddingBottom: Metrics.ratio(-10),
    fontSize: Metrics.ratio(15),
    fontFamily: Fonts.type.regular,
    color: "#b4b4b4"
    //
  },
  inputField: {
    width: Metrics.screenWidth * 0.8,
    paddingLeft: Metrics.ratio(10),
    paddingBottom: Metrics.ratio(-10),
    fontSize: Metrics.ratio(16),
    fontFamily: Fonts.type.regular,
    color: "#b4b4b4"
  },
  submitButtonView: {
    width: Metrics.screenWidth * 0.9,
    height: Metrics.ratio(45),
    marginLeft: Metrics.screenWidth * 0.025,
    marginTop: Metrics.ratio(20),
    backgroundColor: "#89f3ff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Metrics.ratio(30),
    flexDirection: "row",
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  AcceptButtonView: {
    width: Metrics.screenWidth * 0.4,
    height: Metrics.ratio(45),
    marginLeft: Metrics.screenWidth * 0.025,
    marginTop: Metrics.ratio(20),
    backgroundColor: "#89f3ff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Metrics.ratio(30),
    flexDirection: "row",
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1
    },
  },
 cancelButtonView: {
    width: Metrics.screenWidth * 0.4,
    height: Metrics.ratio(45),
    marginLeft: Metrics.screenWidth * 0.025,
    marginTop: Metrics.ratio(20),
    backgroundColor: "#89f3ff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Metrics.ratio(30),
    flexDirection: "row",
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1
    },
  },
});
