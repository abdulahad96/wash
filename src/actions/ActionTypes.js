// @flow
const REQUEST = "REQUEST";
const SUCCESS = "SUCCESS";
const FAILURE = "FAILURE";
const CANCEL = "CANCEL";

function createRequestTypes(base) {
  const res = {};
  [REQUEST, SUCCESS, FAILURE, CANCEL].forEach(type => {
  // [REQUEST].forEach(type => {
    res[type] = `${base}_${type}`;
  });
  return res;
}

export const LOGIN = createRequestTypes("LOGIN");
export const LOGOUT = "LOGOUT";
export const REGISTER = createRequestTypes("REGISTER");
export const ORDER = createRequestTypes("ORDER");
export const GET_ORDER = createRequestTypes("GET_ORDER");
export const ACCEPT_ORDER = createRequestTypes("ACCEPT_ORDER");
export const ACCEPTED_ORDER = createRequestTypes("ACCEPTED_ORDER");
export const UPDATE_ORDER = createRequestTypes("UPDATE_ORDER");
export const WASHHISTORY = createRequestTypes("WASHHISTORY");
export const LAUNDARYSTATUS = createRequestTypes("LAUNDARYSTATUS");
export const EDITPROFILE = createRequestTypes("EDITPROFILE");
export const GET_PROFILE = createRequestTypes("GET_PROFILE");
export const GET_WALLET = createRequestTypes("GET_WALLET");
export const POST_WALLET = createRequestTypes("POST_WALLET");
export const TRANSACTION = createRequestTypes("TRANSACTION");
export const DRAWAR_MENU_SWITCHED = "DRAWAR_MENU_SWITCHED";


