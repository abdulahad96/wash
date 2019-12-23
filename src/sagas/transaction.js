import {take, put, call, fork} from 'redux-saga/effects';
// import { Actions } from "react-native-router-flux";
import ApiSauce from '../services/apiSauce';
import * as types from '../actions/ActionTypes';
import {success, failure} from '../actions/transaction';
import {Transaction} from '../config/WebServices';
import {ErrorHelper} from '../helpers';
// import { strings } from "../I18n";

function callRequest(data) {
  let token = data.token;
console.log(token,'tokkkkkkkkkkkkkkkkkkkkkkkkkken')
  let payload = data.payload;
  return ApiSauce.postWithToken(Transaction, payload, token);
}

function* watchRequest() {
  while (true) {
    // a++;
    const {payload} = yield take(types.TRANSACTION.REQUEST);
    console.log(payload, 'sssssssvvvvvvvsssssskkkkkkkkkkkkk');
    try {
      const response = yield call(callRequest, payload);
      yield put(success(response));
      console.log('oreder====>', response);
      //   setTimeout(() => {
      //     Actions.verify({
      //       phoneNumber: JSON.stringify(payload.phoneNumber).replace(/\"/g, ""),
      //       targetView: targetView,

      //       title: strings("navtitles.otp")
      //     });
      //   }, 800);
    } catch (err) {
      console.log('errrrrrrrrrr', err);
      yield put(failure(err));
      ErrorHelper.handleErrors(err, true);
    }
  }
}

export default function* root() {
  yield fork(watchRequest);
}
