const updateUser = user => {
  return {
    type: 'UPDATE_USER',
    user,
  };
};

const removeUser = () => {
  console.log('user wala');
  return {
    type: 'REMOVE_USER',
  };
};

export {updateUser, removeUser};
