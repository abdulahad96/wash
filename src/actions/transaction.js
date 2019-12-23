// @flow

import { TRANSACTION } from "./ActionTypes";

export function request(payload: Object) {
  console.log('55555555555555555555555666666666666666666666666777777777777777777')
  return {
    payload,
    type: TRANSACTION.REQUEST
  };
}

export function success(data: Object) {
  return {
    data,
    type: TRANSACTION.SUCCESS
  };
}

export function failure(errorMessage: Object) {
  return {
    errorMessage,
    type: TRANSACTION.FAILURE
  };
}
