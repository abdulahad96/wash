import React, { Component } from 'react';
import axios from 'axios';
import {
  forget_password,
  verify_reset_code,
  reset_password,
  get_universities,
  get_user,
  logout,
  Editprofile_Api,
  role_Api,
  get_Scholarships,
  verify_otp,
  Resend_Otp,
  pages,
  Cancel_order,
  Checkcancel,
  Report
} from './WebServices';
import moment from 'moment';
import qs from 'qs';

export const resetPassword = data => {
  console.log(data);
  // return {success:true};
  // const bearer = Bearer ${data.access_token};
  const body = qs.stringify(data);
  // return {success:true}
  return new Promise((resolve, reject) => {
    axios
      .post(reset_password, body, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          //Authorization: bearer
        },
      })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error.response);
      });
  });
};


export const getUser = data => {
  console.log(data);
  console.log(data, "consoleeeeeeeeeeeeee")
  // return {success:true};
  const bearer = `Bearer ${data.access_token}`;
  const body = qs.stringify(data);
  // return {success:true}
  return new Promise((resolve, reject) => {
    axios
      .get(`${get_user}/${data.id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: bearer
        },
      })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error.response);
      });
  });
};
export const Logout = data => {
  console.log(data, "adasdasdasda");
  // return {success:true};


  // return {success:true}
  console.log();
  return new Promise((resolve, reject) => {
    const Header = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${data.access_token}`,
      },
    };
    axios
      .post(logout, {}, Header)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        // console.log(error)
        reject(error.response);
      });
  });
};


export const ResendCode = (data) => {

  // return {success:true};


  // return {success:true}
  console.log(data,'data',console.log(Resend_Otp));
  return new Promise((resolve, reject) => {
    const Header = {
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${token}`,
      },
    };
    axios
      .post(Resend_Otp, data, Header)
      .then(response => {
       console.log(response)
        resolve(response);
      })
      .catch(error => {
      console.log(error,'rrrrrrrrrrrrrr')
        reject(error.response);
      });
  });
};



export const VerifyOtp = (data) => {

  // return {success:true};


  // return {success:true}
  console.log(data,'data');
  return new Promise((resolve, reject) => {
    const Header = {
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${token}`,
      },
    };
    axios
      .post(verify_otp, data, Header)
      .then(response => {
       
        resolve(response);
      })
      .catch(error => {
      
        reject(error.response);
      });
  });
};


export const editProfile = (payload, token) => {

  return new Promise((resolve, reject) => {
    fetch(Editprofile_Api,{
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      body:payload

    })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        // console.log(error)
        reject(error.response);
      });
  });
};
export const CancelOrder = (payload, token) => {

  return new Promise((resolve, reject) => {
    const Header = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .post(Cancel_order, payload, Header)
      .then(response => {
       console.log(response)
        resolve(response);
      })
      .catch(error => {
      console.log(error,'rrrrrrrrrrrrrr')
        reject(error.response);
      });
  });
};
export const reportProblem = (payload, token) => {
console.log(payload,token)
  return new Promise((resolve, reject) => {
    const Header = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .post(Report, payload, Header)
      .then(response => {
       console.log(response)
        resolve(response);
      })
      .catch(error => {
      console.log(error,'rrrrrrrrrrrrrr')
        reject(error.response);
      });
  });
};
export const VerifyresetCode = data => {
  console.log(data);
  // return {success:true};
  // const bearer = Bearer ${data.access_token};
  const body = qs.stringify(data);
  // return {success:true}
  console.log();
  return new Promise((resolve, reject) => {
    axios
      .post(`${verify_reset_code}${data.verification_code}`, {
        headers: {
          'Content-Type': 'application/json',
          //Authorization: bearer
        },
      })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
       
        reject(error.response);
      });
  });
};
export const changeRole = (payload, token) => {
console.log(payload)
  const body = qs.stringify(payload);
  console.log(body)
  return new Promise((resolve, reject) => {
    axios
      .post(role_Api,payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
      })
      .then(response => {
        console.log(response,'resss')
        resolve(response);
      })
      .catch(error => {
        console.log(error,'errr')
        reject(error.response);
      });
  });
};
export const checkcancel= (payload, token) => {
  console.log(payload)
    const body = qs.stringify(payload);
    console.log(body)
    return new Promise((resolve, reject) => {
      axios
        .post( Checkcancel,payload, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
        })
        .then(response => {
          console.log(response,'resss')
          resolve(response);
        })
        .catch(error => {
          console.log(error,'errr')
          reject(error.response);
        });
    });
  };
export const  Scholarships = (token) => {
  console.log(token)
    return new Promise((resolve, reject) => {
      axios
        .get(get_Scholarships, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
        })
        .then(response => {
          console.log(response,'resss')
          resolve(response);
        })
        .catch(error => {
          console.log(error,'errr')
          reject(error.response);
        });
    });
  };
export const forgetPassword = data => {
  console.log(data, 'datttttttttttttt');
  // return {success:true}
  // const bearer = Bearer ${data.access_token};
  return new Promise((resolve, reject) => {
    axios
      .get(`${forget_password}${data}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error.response);
      });
  });
};
export const Getuniversity = () => {
  // console.log(data, 'datttttttttttttt');
  // return {success:true}
  // const bearer = Bearer ${data.access_token};
  return new Promise((resolve, reject) => {
    axios
      .get(`${get_universities}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error.response);
      });
  });
};
export const GetPages = () => {
  // console.log(data, 'datttttttttttttt');
  // return {success:true}
  // const bearer = Bearer ${data.access_token};
  return new Promise((resolve, reject) => {
    axios
      .get(`${pages}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error.response);
      });
  });
};