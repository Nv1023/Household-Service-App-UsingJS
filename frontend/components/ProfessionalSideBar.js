const ProfessionalSideBar = {
    props: ['id'],
    template : `
          <!-- Sidebar -->
          <div class="col-md-2 bg-dark text-white vh-100 p-3" style="position: fixed; left: 0;">
          <h4 class="text-center mb-4">{{ $store.state.username }}</h4>
          <ul class="list-unstyled">
            <li class="mb-3">
              <a :href="'/professional/' + id + '/dashboard'" class="text-white text-decoration-none">
                <i class="fas fa-home me-2"></i>Home
              </a>
            </li>
            <li class="mb-3">
              <a :href="'/professional/' + id + '/profile'" class="text-white text-decoration-none">
                <i class="fas fa-user me-2"></i>Profile
              </a>
            </li>
            <li class="mb-3">
              <a :href="'/professional/' + id + '/search'" class="text-white text-decoration-none">
                <i class="fas fa-search me-2"></i>Search
              </a>
            </li>
            <li class="mb-3">
              <a :href="'/professional/' + id + '/summary'" class="text-white text-decoration-none">
                <i class="fas fa-chart-bar me-2"></i>Summary
              </a>
            </li>
            <li class="mt-auto pt-5">
              <a href="#" @click="logout" class="text-white text-decoration-none">
                <i class="fas fa-sign-out-alt me-2"></i>Logout
              </a>
            </li>
          </ul>
      </div>
    `,
    methods : {
        logout() {
            if (this.$store) {
              this.$store.commit('logout');
            }
            
            if (this.$router) {
              this.$router.push('/');
            } else {
              window.location.href = '/';
            }
          }
    }
}

export default ProfessionalSideBar;