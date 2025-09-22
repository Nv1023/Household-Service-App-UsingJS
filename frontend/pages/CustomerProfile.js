const CustomerProfile = {
    props: ['id'],
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
                            <h2 class="text-center text-primary">Customer Profile</h2>
                            <form @submit.prevent="customerprofile">
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

                                <div class="d-flex justify-content-between mt-4">
                                    <button type="submit" class="btn btn-primary">Update Profile</button>
                                    <button @click="goBack" id="backButton" class="btn btn-secondary" type="button"><i class="bi bi-arrow-left me-1"></i> Back</button> 
                                </div>
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
        async customerprofile() {
            if (!this.email || !this.password || !this.username || !this.fullname || !this.address || !this.pincode || !this.phoneno) {
                alert('Please fill in all required fields');
                return;
            }

            try {
                const response = await fetch(`${location.origin}/api/customer/profile/${this.id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 
                        'Authentication-Token': this.$store.state.auth_token,
                        'Role': this.$store.state.role,
                    },
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
                    alert('Profile Updation successful');
                    this.$router.push(`/customer/${this.id}/dashboard`);
                } else {
                    alert(data?.message || 'Profile Updation failed');
                }
            } catch (error) {
                console.error(error);
                alert('An error occurred');
            }
        },

        async fetchCustomer() {
            try {
                const response = await fetch(`${location.origin}/api/customer/${this.id}`, {
                    method: 'GET',
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token,
                        'Role': this.$store.state.role,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    this.email = data.email;
                    this.username = data.username;
                    this.fullname = data.fullname;
                    this.address = data.address;
                    this.pincode = data.pincode;
                    this.phoneno = data.phoneno;
                } else {
                    console.error('Failed to fetch customer');
                }
            } catch (error) {
                console.error('Error fetching customer:', error);
            }
        },

        async goBack() {
            try {
                if (this.$router) {
                    this.$router.go(-1);
                } else {
                    window.history.back();
                }
            } catch (error) {
                console.error("Error navigating back:", error);
            }
        },
    },
    mounted() {
        this.fetchCustomer(); 
    }
};

export default CustomerProfile;