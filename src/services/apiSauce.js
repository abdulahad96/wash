// import base64 from "base-64";
import {create} from 'apisauce';
import qs from 'qs';
import {Alert} from 'react-native';

const api = create({
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

class ApiSauce {
  async post(url, payload, headers) {
    api.setHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    // const Header = {
    //   headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //   },
    // };

    const response = await api.post(url, payload);
    console.log(response);
    return new Promise((resolve, reject) => {
      this.handlePromise(resolve, reject, response);
    });
  }

  async postWithToken(url, payload, token, headers) {
    // const Header = {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${token}`,
    //   },
    // };
    
    api.setHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const response = await api.post(url, payload);

    return new Promise((resolve, reject) => {
      this.handlePromise(resolve, reject, response);
    });
  }

  async postWithTokenMultipart(url, payload, token, headers) {
    // const Header = {
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'multipart/form-data',
    //     Authorization: `Bearer ${token}`,
    //   },
    // };
    
    api.setHeaders({
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    });

    const response = await api.post(url, payload);
console.log(response);
    return new Promise((resolve, reject) => {
      this.handlePromise(resolve, reject, response);
    });
  }

  async put(url, data, token) {
    // const Header = {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${token}`,
    //   },
    // };
    api.setHeaders({
      'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
    });
    const response = await api.put(url, data);

    return new Promise((resolve, reject) => {
      this.handlePromise(resolve, reject, response);
    });
  }
  // for simple get request

  async get(url, data, headers) {
    const token = data && data.access_token && data.access_token;
    console.log(token, 'hhhhhhhhhhhhhjjjjjjjjjjj');
    api.setHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${token}`,
    });
    const response = await api.get(url);
    console.log(response, 'resjjjjjjjjjjjjjjkkkkkkkkkkkkkkbbbbb');
    return new Promise((resolve, reject) => {
      this.handlePromise(resolve, reject, response);
    });
  }

  handlePromise = (resolve, reject, response) => {
    console.log(response, 'kkkkkkkkkkkkkkk');
    if (response.ok && response.data && response.originalError === null) {
      // console.log("null")
      resolve(response.data);
    } else {
      console.log("elsessssssssssssssssssssssssss",response)
      if (response.originalError && !response.ok &&  response.problem !== 'NETWORK_ERROR') {
        console.log("ye rahahaaa")
        reject(response.data.message);
      } else if (
        response.originalError &&
        response.originalError.response &&
        response.originalError.response.data &&
        response.originalError.response.data.Message &&
        response.originalError.response.data.Message
      ) {
        // console.log("original error")
        reject(response.originalError.response.data.Message);
      } 
      else if (
        response.originalError &&
        !response.ok &&
        response.problem === 'NETWORK_ERROR'
      ) {
        // console.log("network error")
        reject(response.problem);
      }
      // else{
      //   console.log(response,"errr")
      // }
    }
  };

  // async login(data) {
  //   return new Promise((resolve, reject) => {
  //     db.collection("users")
  //       .doc(data)
  //       .get()
  //       .then(snapshot => {
  //         if (snapshot.data()) {
  //           this.handleFirebasePromise(resolve, reject, snapshot.data());
  //         } else {
  //           this.handleFirebasePromise(resolve, reject, {
  //             error: "Something went wrong"
  //           });
  //         }
  //       })
  //       .catch(err => console.log(err, "errrrrrrrrrrrrrr"));
  //   });
  // }

  // async getCollectionData(data) {
  //   console.log("data", data);
  //   let responseData = [];
  //   let errorMessage = "Document does not exists";
  //   return new Promise((resolve, reject) => {
  //     db.collection(data).onSnapshot(
  //       snapshot => {
  //         snapshot.forEach(doc => {
  //           if (doc.exists) {
  //             responseData.push(doc.data());
  //           } else {
  //             this.handleFirebasePromise(resolve, reject, errorMessage);
  //           }
  //         });
  //         this.handleFirebasePromise(resolve, reject, responseData);
  //       },
  //       error => {
  //         console.log(error, "errorrrrrrrrrrrrrrr");
  //         this.handleFirebasePromise(resolve, reject, error);
  //       }
  //     );
  //   });
  // }

  // handleFirebasePromise = (resolve, reject, response) => {
  //   if (response.email) {
  //     resolve(response);
  //   } else if (response.length) {
  //     resolve(response);
  //   } else {
  //     reject(response.error);
  //   }
  // };
}

export default new ApiSauce();
