// import { take, put, call, fork } from "redux-saga/effects";

// import ApiSauce from "../services/apiSauce";
// import { login_Api } from "../config/WebServices";
// import * as types from "../actions/ActionTypes";

// import { success, failure } from "../actions/Login";

// import { ErrorHelper } from "../helpers";
// function callRequest(data) {
//   return ApiSauce.post(login_Api, data);

// }
// let a = 1
// function* watchRequest() {

//   while (a === 1) {
//     a++;
//     const { payload } = yield take(types.LOGIN.REQUEST);
//     console.log("aaaaaaaaaaaaaaaaaaaaaaaaa",payload)
//     // const { targetView } = payload;
//     // delete payload.targetView;
//     try {
//       const response = yield call(callRequest, payload);

//       yield put(success(response));
//         // setTimeout(() => {
//         //   Actions.verify({
//         //     phoneNumber: JSON.stringify(payload.phoneNumber).replace(/\"/g, ""),
//         //     targetView: targetView,

//         //     title: strings("navtitles.otp")
//         //   });
//         // }, 800);
//     } catch (err) {
//       console.log(err)
//       yield put(failure(err));
//       ErrorHelper.handleErrors(err, true);
//     }
//   }
// }

// export default function* root() {
//   yield fork(watchRequest);
// }
