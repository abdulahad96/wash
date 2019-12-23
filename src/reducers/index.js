import login from './login';
import register from './register';
import userReducer from './userReduces';
import orderreducer from './OrderReducer';
import washHistory from './washhistoryreducer';
import editProfile from './editprofilereducer';
import getorder from './getOrderReducer';
import acceptorder from './acceprOrderReducer';
import {combineReducers} from 'redux';
import acceptedOrder from './acceptedOrderReducer';
import updateOrder from './updateOrderreducer';
import transaction from './transactionreducer'
import wallet from './walletReducer'
import postwallet from './postwalletReducer'

export const rootReducer = combineReducers({
  login,
  register,
  userReducer,
  orderreducer,
  washHistory,
  editProfile,
  getorder,
  acceptorder,
  acceptedOrder,
  updateOrder,
  transaction,
  wallet,postwallet
});
