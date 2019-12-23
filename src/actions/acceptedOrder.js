// @flow

import { ACCEPTED_ORDER } from "./ActionTypes";

export function request(payload: Object) {
  return {
    payload,
    type: ACCEPTED_ORDER.REQUEST
  };
}

export function success(data: Object) {
  return {
    data,
    type: ACCEPTED_ORDER.SUCCESS
  };
}

export function failure(errorMessage: Object) {
  return {
    errorMessage,
    type: ACCEPTED_ORDER.FAILURE
  };
}
