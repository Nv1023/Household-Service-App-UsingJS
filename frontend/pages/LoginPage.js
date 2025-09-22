const LoginPage = {
  template: `
    <div class="container-fluid vh-100">
      <div class="row h-100">
        
        <div class="col-md-6 p-0" style="background: url('/static/images/login.jpg') no-repeat center center; background-size: cover;">
          <div class="h-100 d-flex align-items-center justify-content-center" style="background: rgba(0, 0, 0, 0.5);">
            <h1 class="text-white display-4 fw-bold">Welcome to SwiftFix</h1>
          </div>
        </div>

        <div class="col-md-6 d-flex align-items-center justify-content-center" style="background: linear-gradient(135deg, #ff758c, #ff7eb3);">
          <div class="w-75 p-4 rounded shadow-lg" style="background: linear-gradient(135deg, #ffffff, #f8f9fa); border: 1px solid rgba(255, 255, 255, 0.3); box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
            <h3 class="text-center mb-4 text-dark fw-bold">Login</h3>
            
            <div v-if="message" :class="'alert alert-' + category" role="alert">
              {{ message }}
            </div>

            <form @submit.prevent="submitLogin">
              <div class="form-group mb-3">
                <label for="email" class="form-label text-dark">
                  <i class="fas fa-envelope text-primary"></i> E-Mail:
                </label>
                <input type="text" id="email" v-model="email" class="form-control rounded-pill p-2 shadow-sm" required style="border: 1px solid #ced4da; transition: 0.3s;">
              </div>

              <div class="form-group mb-3">
                <label for="password" class="form-label text-dark">
                  <i class="fas fa-lock text-primary"></i> Password:
                </label>
                <input type="password" id="password" v-model="password" class="form-control rounded-pill p-2 shadow-sm" required style="border: 1px solid #ced4da; transition: 0.3s;">
              </div>

              <div class="form-group mb-3">
                <input type="submit" value="Login" class="btn w-100 fw-bold text-white" 
                       style="background: linear-gradient(90deg, #ff758c, #ff7eb3); border: none; padding: 10px; border-radius: 30px; transition: 0.3s;">
              </div>

              <div class="form-group text-center">
                <router-link to="/customer/registration" class="me-3 text-primary fw-bold">Register as Customer</router-link>
                <router-link to="/professional/registration" class="me-3 text-primary fw-bold">Register as Professional</router-link>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  `,
  data() {
    return {
      email: null,
      password: null,
      message: null,
      category: null,
    };
  },
  methods: {
    async submitLogin() {
      try {
        const res = await fetch(`${location.origin}/api/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.email, password: this.password }),
        });
  
        if (res.ok) {
          const claimData = await res.json();
          console.log('Response from backend:', claimData);
  
          if (!claimData) {
            this.message = 'Invalid server response.';
            this.category = 'danger';
            console.error('Missing claims in response:', claimData);
            return;
          }
  
          const user = {
            token: claimData.token, 
            role: claimData.role,    
            id: claimData.id,  
            username : claimData.username,
          };
  
          this.$store.commit('setUser', user);
  
          if (user.role === 'Customer') {
            this.$router.push(`/customer/${user.id}/dashboard`);
          } else if (user.role === 'Professional') {
            this.$router.push(`/professional/${user.id}/dashboard`);
          } else if (user.role === 'Admin') {
            this.$router.push(`/admin/dashboard`);
          }
        } else {
          this.message = 'Invalid email or password.';
          this.category = 'danger';
        }
      } catch (error) {
        console.error(error);
        this.message = 'An unexpected error occurred.';
        this.category = 'danger';
      }
    },
  }
};

export default LoginPage;
