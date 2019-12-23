// @flow

import { POST_WALLET } from "./ActionTypes";

export function request(payload: Object) {
  return {
    payload,
    type: POST_WALLET.REQUEST
  };
}

export function success(data: Object) {
  return {
    data,
    type: POST_WALLET.SUCCESS
  };
}

export function failure(errorMessage: Object) {
  return {
    errorMessage,
    type: POST_WALLET.FAILURE
  };
}
