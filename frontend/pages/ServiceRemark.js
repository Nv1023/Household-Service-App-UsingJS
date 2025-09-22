const ServiceRemark = {
    props: ['id'], 
    template: `
    <div class="container py-4">
        <div class="row">
            <div class="col-md-8 offset-md-2">        
                <div class="card shadow-sm">
                    <div class="card-header bg-primary text-white">
                        <h3 class="mb-0">Service Remark</h3>
                    </div>
                    <div class="card-body">
                        <div v-if="message" :class="'alert alert-' + category" role="alert">
                            {{ message }}
                        </div>
                        <form @submit.prevent="submitRemark" class="needs-validation">
                            <div class="row mb-3">
                                <div class="col">
                                    <label for="servicerequest-id" class="form-label">Service Request ID</label>
                                    <input type="number" id="servicerequest-id" name="servicerequest_id" class="form-control" placeholder="Service ID" v-model="servicerequest_id" readonly>
                                </div>
                                <div class="col">
                                    <label for="service-name" class="form-label">Service Name</label>
                                    <input type="text" id="service-name" name="service_name" class="form-control" placeholder="Service Name" v-model="service_name" readonly>
                                </div>
                                <div class="col">
                                    <label for="service-date" class="form-label">Date</label>
                                    <input type="text" id="service-date" name="service_date" class="form-control" placeholder="dd/mm/yyyy" v-model="date_of_request" readonly>
                                </div>
                            </div>

                            <div class="row mb-3">
                                <div class="col">
                                    <label for="professional-id" class="form-label">Professional ID</label>
                                    <input type="text" id="professional-id" name="professional_id" class="form-control" placeholder="Professional ID" v-model="professional_id" readonly>
                                </div>
                                <div class="col">
                                    <label for="professional-name" class="form-label">Professional Name</label>
                                    <input type="text" id="professional-name" name="professional_name" class="form-control" placeholder="Professional Name" v-model="professional_name" readonly>
                                </div>
                                <div class="col">
                                    <label for="professional-contact" class="form-label">Contact No.</label>
                                    <input type="text" id="professional-contact" name="professional_contact" class="form-control" placeholder="Contact No." v-model="professional_contact" readonly>
                                </div>
                            </div>

                            <div class="row mb-3">
                                <label for="service-rating" class="form-label">Service Rating</label>
                                <div class="star-rating">
                                    <input type="radio" id="5-stars" name="rating" value="1" v-model="rating" required>
                                    <label for="5-stars" class="star">&#9733;</label>
                                    <input type="radio" id="4-stars" name="rating" value="2" v-model="rating" required>
                                    <label for="4-stars" class="star">&#9733;</label>
                                    <input type="radio" id="3-stars" name="rating" value="3" v-model="rating" required>
                                    <label for="3-stars" class="star">&#9733;</label>
                                    <input type="radio" id="2-stars" name="rating" value="4" v-model="rating" required>
                                    <label for="2-stars" class="star">&#9733;</label>
                                    <input type="radio" id="1-star" name="rating" value="5" v-model="rating" required>
                                    <label for="1-star" class="star">&#9733;</label>
                                </div>
                            </div>

                            <div class="row mb-3">
                                <div class="col">
                                    <label for="remarks" class="form-label">Remarks (if any):</label>
                                    <textarea id="remarks" name="remarks" class="form-control" rows="4" placeholder="Enter remarks here" v-model="remarks"></textarea>
                                </div>
                            </div>

                            <div class="text-center">
                                <button type="submit" class="btn btn-primary me-2">Submit</button>
                                <button type="button" class="btn btn-secondary" @click="goBack">Back</button>
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
            servicerequest_id: "", 
            service_name: "",
            date_of_request: "",
            professional_id: "",
            professional_name: "",
            professional_contact: "",
            rating: null,
            remarks: "",
            message: "",
            category: "info",
            customerid: null,
        };
    },
    methods: {
        async submitRemark() {
            try {
                const formData = {
                    servicerequest_id: this.servicerequest_id,
                    professional_id: this.professional_id,
                    rating: this.rating,
                    remarks: this.remarks,
                };

                const response = await fetch(`${location.origin}/api/service-remark`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authentication-Token": this.$store.state.auth_token,
                        "Role": this.$store.state.role,
                    },
                    body: JSON.stringify(formData),
                });

                const data = await response.json();
                if (response.ok) {
                    this.message = "Remark submitted successfully!";
                    this.category = "success";
                    this.resetForm();
                    alert(`Service Remark for ${this.servicerequest_id} has been successfully added`)
                    this.$router.push(`/customer/${this.customerid}/dashboard`);
                } else {
                    this.message = data?.message || "Failed to submit remark.";
                    this.category = "danger";
                }
            } catch (error) {
                console.error(error);
                this.message = "An error occurred while submitting the remark.";
                this.category = "danger";
            }
        },
        async fetchServiceRequest() {
            try {
                const response = await fetch(`${location.origin}/api/serviceremark/servicerequest/${this.id}`, {
                    method: 'GET',
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token,
                        'Role': this.$store.state.role,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data); 
                    this.servicerequest_id = data.id;
                    this.service_name = data.service.service_name;
                    this.date_of_request = data.date_of_request;
                    this.professional_id = data.professional.id;
                    this.professional_name = data.professional.fullname;
                    this.professional_contact = data.professional.phoneno;
                } else {
                    console.error('Failed to fetch servicerequest');
                }
            } catch (error) {
                console.error('Error fetching servicerequest:', error);
            }
        },
        resetForm() {
            this.rating = null;
            this.remarks = "";
        },
        goBack() {
            this.$router.go(-1); 
        },
    },
    mounted() {
        const urlParams = new URLSearchParams(window.location.search);
        this.customerid = urlParams.get('customerid');
        this.fetchServiceRequest();
    },
};

export default ServiceRemark;