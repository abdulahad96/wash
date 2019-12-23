import { Alert } from "react-native";
// import utils from "../util";

class SuccessHelper {
  handleSuccess(msg, doAlert) {
    console.log("chintoooooooooooo")
    if (doAlert) {
      if (msg) {
        setTimeout(() => {
          Alert.alert("Successful", msg);
        },500)
        // utils.showAlertWithDelay("Error", err, 1000);
      }
    }
  }
}

export default new SuccessHelper();
