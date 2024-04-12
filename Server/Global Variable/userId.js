let user_id;

module.exports = {
  getUser_id: () => user_id,
  setUser_id: (id) => {
    user_id = id;
  },
};