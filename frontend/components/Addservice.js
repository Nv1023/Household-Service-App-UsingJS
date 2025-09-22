const Addservice = {
    template: `
    <div class="container py-4">
        <div class="row">
            <div class="col-md-6 offset-md-3">        
                <div class="card shadow-sm">
                    <div class="card-header bg-primary text-white">
                        <h3 class="mb-0">Add Service</h3>
                    </div>
                    <div class="card-body">
                        <div v-if="message" :class="'alert alert-' + category" role="alert">
                            {{ message }}
                        </div>
                        <form @submit.prevent="addservice" class="needs-validation">
                            <div class="mb-3">
                                <label for="service_name" class="form-label fw-bold">Service Name:</label>
                                <input type="text" id="service_name" v-model="service_name" 
                                    class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label for="service_price" class="form-label fw-bold">Service Price:</label>
                                <div class="input-group">
                                    <span class="input-group-text">₹</span>
                                    <input type="number" id="service_price" v-model="service_price" 
                                        class="form-control" required>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="file" class="form-label fw-bold">Choose a File:</label>
                                <input type="file" id="file" @change="handleFileUpload" 
                                    class="form-control" required>
                                <div class="form-text text-muted">Select an image for this service</div>
                            </div>
                            <div class="mb-4">
                                <label for="service_description" class="form-label fw-bold">Service Description:</label>
                                <textarea id="service_description" v-model="service_description" 
                                    class="form-control" rows="3" required></textarea>
                            </div>
                            <div class="d-flex justify-content-between mt-4">
                                <button @click="goBack" id="backButton" 
                                    class="btn btn-secondary" type="button">
                                    <i class="bi bi-arrow-left me-1"></i> Back
                                </button>  
                                <button type="submit" class="btn btn-primary">
                                    <i class="bi bi-save me-1"></i> Save Service
                                </button>
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
            service_name: null,
            service_description: null,
            service_price: null,
            selectedFile: null,  
            message: null,
            category: 'info'
        };
    },
    methods: {
        handleFileUpload(event) {
            this.selectedFile = event.target.files[0];  
        },
        async addservice() {
            try {
                const formData = new FormData();
                formData.append("service_name", this.service_name);
                formData.append("service_description", this.service_description);
                formData.append("service_price", this.service_price);
                
                if (this.selectedFile) {
                    formData.append("file", this.selectedFile);  
                }
        
                const response = await fetch(`${location.origin}/api/services`, {
                    method: "POST",
                    headers: {
                        "Authentication-Token": this.$store.state.auth_token,
                        "Role": this.$store.state.role,
                    },
                    body: formData, 
                });

                const data = await response.json();
                if (response.ok) {
                    this.message = "Service Added Successfully";
                    this.category = "success";
                    this.$router.push(`/admin/dashboard`);;
                } else {
                    this.message = data?.message || "Failed to add service";
                    this.category = "danger";
                }
            } catch (error) {
                console.error(error);
                this.message = "An error occurred";
                this.category = "danger";
            }
        },
        async fetchServices() {
            try {
                const response = await fetch(`${location.origin}/api/services`, { method: "GET" });
                if (response.ok) {
                    const data = await response.json();
                    this.services = Array.isArray(data) ? data : [data];
                } else {
                    console.error("Failed to fetch services");
                }
            } catch (error) {
                console.error("Error fetching services:", error);
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
        }
    },
    mounted() {
        this.fetchServices();
    },
};

export default Addservice;