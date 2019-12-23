import { Alert } from "react-native";
// import utils from "../util";

class ErrorHelper {
  handleErrors(err, doAlert) {
    console.log(err,'errrrrrrrrrrrrrrrrrrorrrrrr')
    if(err == 1){
      console.log("hello")
    }
   else if (err != 1 && doAlert) {
      if (err) {
        setTimeout(() => {
          Alert.alert("Error", err)
        },500)
        // utils.showAlertWithDelay("Error", err, 1000);
      }
    }
  }
}

export default new ErrorHelper();
