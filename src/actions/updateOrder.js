// @flow

import { UPDATE_ORDER } from "./ActionTypes";

export function request(payload: Object) {
  return {
    payload,
    type: UPDATE_ORDER.REQUEST
  };
}

export function success(data: Object) {
  return {
    data,
    type: UPDATE_ORDER.SUCCESS
  };
}

export function failure(errorMessage: Object) {
  return {
    errorMessage,
    type: UPDATE_ORDER.FAILURE
  };
}
