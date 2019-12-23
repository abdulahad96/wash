// @flow

import { GET_WALLET } from "./ActionTypes";

export function request(payload: Object) {
  return {
    payload,
    type: GET_WALLET.REQUEST
  };
}

export function success(data: Object) {
  return {
    data,
    type: GET_WALLET.SUCCESS
  };
}

export function failure(errorMessage: Object) {
  return {
    errorMessage,
    type: GET_WALLET.FAILURE
  };
}
