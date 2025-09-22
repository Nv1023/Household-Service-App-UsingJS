import BookAppointment from '../components/BookAppointment.js'; 
import CustomerSideBar from '../components/CustomerSideBar.js';

const ServiceDetails = {
    props: ['id','customerid'],
    template: `
        <CustomerSideBar :id ="customerid"/>
        <div class="col-md-10 offset-md-2 p-4">
            <!-- Service Table -->
            <section class="mb-5">
                <h3><i class="fas fa-cogs me-2"></i>Service Details</h3>
                <div class="table-responsive">
                    <table class="table table-bordered table-hover">
                        <thead class="table-dark">
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Service Name</th>
                                <th scope="col">Base Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="service in services" :key="service.id">
                                <td>{{ service.id }}</td>
                                <td>{{ service.service_name }}</td>
                                <td>{{ service.service_price }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- Professionals Table -->
            <section class="mb-5">
                <h3><i class="fas fa-user-tie me-2"></i>Professionals</h3>
                <div class="table-responsive">
                    <table class="table table-bordered table-hover">
                        <thead class="table-dark">
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Name</th>
                                <th scope="col">Experience (in yrs)</th>
                                <th scope="col">Phoneno</th>
                                <th scope="col">Rating</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="professional in serviceprofessionals" :key="professional.id">
                                <td>{{ professional.id }}</td>
                                <td>{{ professional.fullname }}</td>
                                <td>{{ professional.experience }}</td>
                                <td>{{ professional.phoneno }}</td>
                                <td>
                                <span v-if="professional?.average_rating">
                                    <i v-for="n in parseInt(professional.average_rating)" class="fas fa-star text-warning"></i>
                                    <i v-for="n in (5 - parseInt(professional.average_rating))" class="far fa-star text-warning"></i>
                                </span>
                                <span v-else>N/A</span>
                            </td>
                                <td>
                                    <button @click="openBookingModal(professional.id)" class="btn btn-primary btn-sm">
                                        <i class="fas fa-unlock me-1"></i>Book Service
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- Book Appointment Modal -->
            <BookAppointment
            :isModalOpen="isBookingModalOpen"
            :professionalId="selectedProfessionalId"
            :serviceId="id"
            :customerId="customerid"
            @close="closeBookingModal"
            @save="handleBooking"
        />
        </div>
    `,
    data() {
        return {
            services: [],
            serviceprofessionals: [],
            isBookingModalOpen: false, 
            selectedProfessionalId: null, 
        };
    },
    components: {
      BookAppointment, 
      CustomerSideBar,
  },
    methods: {
        async fetchServices() {
            try {
                const response = await fetch(`${location.origin}/api/service/${this.id}`, {
                    method: 'GET',
                    headers: {
                      'Authentication-Token': this.$store.state.auth_token,
                      'Role': this.$store.state.role,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    this.services = Array.isArray(data) ? data : [data];
                } else {
                    console.error('Failed to fetch services');
                }
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        },
        async fetchServiceProfessionals() {
            try {
                const response = await fetch(`${location.origin}/api/service/professional/${this.id}`, {
                    method: 'GET',
                    headers: {
                      'Authentication-Token': this.$store.state.auth_token,
                      'Role': this.$store.state.role,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    this.serviceprofessionals = Array.isArray(data) ? data : [data];
                    console.log(data);
                } else {
                    console.error('Failed to fetch service professionals');
                }
            } catch (error) {
                console.error('Error fetching service professionals:', error);
            }
        },
        openBookingModal(professionalId) {
            this.selectedProfessionalId = professionalId; 
            this.isBookingModalOpen = true;
        },
        closeBookingModal() {
            this.isBookingModalOpen = false; 
            this.selectedProfessionalId = null; 
        },
        async handleBooking(bookingData) {
            try {
                const response = await fetch(`${location.origin}/api/service-request/${this.id}/${this.customerid}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': this.$store.state.auth_token,
                        'Role': this.$store.state.role,
                    },
                    body: JSON.stringify(bookingData),
                });

                if (response.ok) {
                    alert('Appointment booked successfully!');
                    this.closeBookingModal();
                } else {
                    const errorData = await response.json();
                    console.error('Failed to book appointment:', errorData);
                }
            } catch (error) {
                console.error('Error booking appointment:', error);
            }
        },
    },
    mounted() {
        this.fetchServices();
        this.fetchServiceProfessionals();
    },
};

export default ServiceDetails;