const store = new Vuex.Store({
    state: {
      auth_token: null,
      role: null,
      loggedIn: false,
      user_id: null,
      username: null,
    },
    mutations: {
      initializeUser(state) {
        try {
          const user = JSON.parse(localStorage.getItem('user'));
          if (user) {
            state.auth_token = user.token;
            state.role = user.role;
            state.loggedIn = true;
            state.user_id = user.id;
            state.username = user.username;
          }
        } catch (error) {
          console.warn("Error initializing user from localStorage:", error);
        }
      },
      setUser(state, user) {
        state.auth_token = user.token;
        state.role = user.role;
        state.loggedIn = true;
        state.user_id = user.id;
        state.username = user.username;
  
        localStorage.setItem('user', JSON.stringify(user));
      },
      logout(state) {
        state.auth_token = null;
        state.role = null;
        state.loggedIn = false;
        state.user_id = null;
        state.username = null;
  
        localStorage.removeItem('user');
      },
    },
    actions: {
      login({ commit }, user) {
        commit('setUser', user);
      },
      logout({ commit }) {
        commit('logout');
      },
    },
  });
  
  store.commit('initializeUser');
  
  export default store;
  