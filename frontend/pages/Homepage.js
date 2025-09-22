import Navbar from "../components/Navbar.js";


const Homepage = {
    template: `
    <div class="home-container">
      <Navbar/>

      <div class="hero-section text-center py-5" style="background: linear-gradient(135deg, #2575fc, #6a11cb); color: white;">
        <h1 class="display-3 fw-bold">SwiftFix</h1>
        <p class="lead">Quick, Reliable, and Hassle-Free Home Services!</p>
      </div>
  
      <div class="container my-5">
        <div class="row align-items-center">
          <div class="col-md-6">
            <img src="/static/images/household.jpg" alt="Home Services" class="img-fluid rounded shadow">
          </div>
          <div class="col-md-6">
            <h2 class="fw-bold">About Us</h2>
            <p class="lead">
              At <b>SwiftFix</b>, we bring professional home services right to your doorstep. Whether you need a skilled electrician, a reliable plumber, or an expert handyman, we connect you with trusted professionals in just a few clicks.
            </p>
            <p>
              Our mission is to make home maintenance hassle-free, ensuring that you receive top-quality service at affordable prices. With SwiftFix, your home is in good hands.
            </p>
          </div>
        </div>
      </div>
  
      <footer class="footer text-white py-4" style="background: linear-gradient(135deg, #6a11cb, #2575fc);">
        <div class="container">
          <div class="row">
            <div class="col-md-6">
              <h5>About Us</h5>
              <p>We are dedicated to providing the best home services for your needs. From plumbing to electrical work, we ensure quality and efficiency in every task.</p>
            </div>
            <div class="col-md-6 text-end">
              <h5>Contact Us</h5>
              <p>Email: info@swiftfix.com</p>
              <p>Phone: +123 456 7890</p>
              <div class="social-icons">
                <a href="#" class="text-white me-3"><i class="fab fa-instagram"></i></a>
                <a href="#" class="text-white me-3"><i class="fab fa-facebook"></i></a>
                <a href="#" class="text-white"><i class="fab fa-linkedin"></i></a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
    `,
    components: { Navbar },
    methods: {
      redirect(page) {
        if (page === 'login') {
          this.$router.push('/login');
        } else if (page === 'register-customer') {
          this.$router.push('/customer/registration');
        } else if (page === 'register-professional') {
          this.$router.push('/professional/registration');
        }
      }
    },
  };
  
  export default Homepage;