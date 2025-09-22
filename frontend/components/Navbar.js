const Navbar = {
    template : `
    <nav class="navbar navbar-expand-lg navbar-dark" style="background: black;">
    <div class="container">
        <a class="navbar-brand fw-bold d-flex align-items-center" href="/" style="color: white;">
            <i class="fa-solid fa-house-chimney me-2"></i> SwiftFix
        </a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" 
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
                <li class="nav-item">
                    <router-link class="nav-link d-flex align-items-center" to="/login" style="color: white;">
                        <i class="fa-solid fa-sign-in-alt me-1"></i> Login
                    </router-link>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button" 
                        data-bs-toggle="dropdown" aria-expanded="false" style="color: white;">
                        <i class="fa-solid fa-user-plus me-1"></i> Register
                    </a>
                    <ul class="dropdown-menu" style="background: black;">
                        <li>
                            <router-link class="dropdown-item d-flex align-items-center" to="/customer/registration" style="color: white;">
                                <i class="fa-solid fa-user me-2"></i> Register as Customer
                            </router-link>
                        </li>
                        <li>
                            <router-link class="dropdown-item d-flex align-items-center" to="/professional/registration" style="color: white;">
                                <i class="fa-solid fa-toolbox me-2"></i> Register as Professional
                            </router-link>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</nav>
    `
}

export default Navbar;