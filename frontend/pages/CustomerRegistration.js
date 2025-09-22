const CustomerRegistration = {
    template: `
    <div class="d-flex justify-content-center align-items-center vh-100">
        <div class="container p-4 bg-light rounded shadow-lg d-flex">
            <!-- Left Side Image -->
            <div class="container vh-100 d-flex align-items-center">
                <div class="row w-100">
                    <div class="col-md-6 d-flex justify-content-center">
                        <img src="/static/images/customer.jpg" class="img-fluid rounded" alt="Customer">
                    </div>

                    <!-- Right Side Registration Form -->
                    <div class="col-md-6 p-4">
                        <h2 class="text-center text-primary">Customer Signup</h2>
                        <form @submit.prevent="customerregister">
                            
                            <div class="mb-3 input-group">
                                <span class="input-group-text"><i class="fa-solid fa-envelope"></i></span>
                                <input type="email" id="email" v-model="email" class="form-control" placeholder="Email ID" required>
                            </div>

                            <div class="mb-3 input-group">
                                <span class="input-group-text"><i class="fa-solid fa-lock"></i></span>
                                <input type="password" id="password" v-model="password" class="form-control" placeholder="Password" required>
                            </div>

                            <div class="mb-3 input-group">
                                <span class="input-group-text"><i class="fa-solid fa-user"></i></span>
                                <input type="text" id="username" v-model="username" class="form-control" placeholder="Username" required>
                            </div>

                            <div class="mb-3 input-group">
                                <span class="input-group-text"><i class="fa-solid fa-id-card"></i></span>
                                <input type="text" id="fullname" v-model="fullname" class="form-control" placeholder="Full Name" required>
                            </div>

                            <div class="mb-3 input-group">
                                <span class="input-group-text"><i class="fa-solid fa-map-marker-alt"></i></span>
                                <input type="text" id="address" v-model="address" class="form-control" placeholder="Address" required>
                            </div>

                            <div class="mb-3 input-group">
                                <span class="input-group-text"><i class="fa-solid fa-map-pin"></i></span>
                                <input type="number" id="pincode" v-model="pincode" class="form-control" placeholder="Pincode" required>
                            </div>

                            <div class="mb-3 input-group">
                                <span class="input-group-text"><i class="fa-solid fa-phone"></i></span>
                                <input type="tel" id="phoneno" v-model="phoneno" class="form-control" placeholder="Phone Number" required>
                            </div>

                            <button type="submit" class="btn btn-primary w-100">Register</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            email: '',
            password: '',
            username: '',
            fullname: '',
            address: '',
            pincode: '',
            phoneno: '',
        };
    },
    methods: {
        async customerregister() {
            if (!this.email || !this.password || !this.username || !this.fullname || !this.address || !this.pincode || !this.phoneno) {
                alert('Please fill in all required fields');
                return;
            }

            try {
                const response = await fetch(`${location.origin}/api/customerregister`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: this.email,
                        password: this.password,
                        username: this.username,
                        fullname: this.fullname,
                        address: this.address,
                        pincode: parseInt(this.pincode),
                        phoneno: parseInt(this.phoneno),
                    }),
                });

                const data = await response.json();
                if (response.ok) {
                    alert('Registration successful');
                    this.$router.push('/');
                } else {
                    alert(data?.message || 'Registration failed');
                }
            } catch (error) {
                console.error(error);
                alert('An error occurred');
            }
        },
    },
};

export default CustomerRegistration;
