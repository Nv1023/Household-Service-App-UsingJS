import CustomerSideBar from "../components/CustomerSideBar.js";
import BookAppointment from '../components/BookAppointment.js';
import ServiceCardSearch from "../components/ServiceCardSearch.js";

const CustomerSearch = {
  props: ['id'],
  template: `
      <CustomerSideBar :id="id"/>
      <div class="container-fluid">
          <div class="row">
              <div class="col-md-2"></div> 
              <div class="col-md-10 py-4">
                <div class="mb-4">
                <form @submit.prevent="performSearch">
                    <div class="input-group">
                    <select v-model="searchParameter" class="form-select">
                        <option value="Services"> Available Services</option>
                        <option value="Professionals">Professionals</option> 
                    </select>
                <input
                    type="text"
                    v-model="searchQuery"
                    class="form-control"
                    placeholder="Enter search query"
                    required
                />
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-search"></i> Search
                </button>
                </div>
                </form>
                </div>
                <!-- Available Service -->
                <section class="mb-5">
                    <div v-if="searchParameter === 'Services'">
                        <h3 class="mb-4"><i class="fas fa-tasks me-2"></i>Services</h3>
                        <ServiceCardSearch
                        :services="services" 
                        :customerid="id" 
                        :searchParameter="searchParameter"
                        />
                    </div>
                </section>


                  <!-- Professionals Table -->
                  <div v-if="searchParameter === 'Professionals'">
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
                                          <span v-if="professional.average_rating">
                                              <i v-for="n in parseInt(professional.average_rating)" class="fas fa-star text-warning"></i>
                                              <i v-for="n in (5 - parseInt(professional.average_rating))" class="far fa-star text-warning"></i>
                                          </span>
                                          <span v-else>N/A</span>
                                      </td>
                                      <td>
                                          <button @click="openBookingModal(professional)" class="btn btn-primary btn-sm">
                                              <i class="fas fa-unlock me-1"></i>Book Service
                                          </button>
                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                      </div>
                  </div>

                  <!-- Book Appointment Modal -->
                  <BookAppointment
                  :isModalOpen="isBookingModalOpen"
                  :professionalId="selectedProfessionalId"
                  :serviceId="selectedServiceId"
                  :customerId="id"
                  @close="closeBookingModal"
                  @save="handleBooking"
              />
              
              </div>
          </div>
      </div>
  `,
  data() {
      return {
          services: [],
          serviceprofessionals: [],
          isBookingModalOpen: false, 
          selectedProfessionalId: null, 
          searchParameter: 'Services',
          searchQuery: '', 
      };
  },
  components: {
      BookAppointment, 
      CustomerSideBar,
      ServiceCardSearch, 
  },
  methods: {
    openBookingModal(professional) {
        this.selectedProfessionalId =  professional.id; 
        this.selectedServiceId = professional.service_id;
        this.isBookingModalOpen = true;
    },
    closeBookingModal() {
        this.isBookingModalOpen = false; 
        this.selectedProfessionalId = null; 
        this.selectedServiceId = null;
    },
    async handleBooking(bookingData) {
        try {
            const response = await fetch(`${location.origin}/api/service-request/${this.selectedServiceId}/${this.id}`, { 
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
    async performSearch() {
        try {
            const parameter = this.searchParameter;
            const query = this.searchQuery;

            const response = await fetch(`${location.origin}/api/customer/search/${this.id}?parameter=${parameter}&query=${query}`, {
                method: 'GET',
                headers: {
                    'Authentication-Token': this.$store.state.auth_token,
                    'Role': this.$store.state.role,
                },
            });

            const data = await response.json();
            if (parameter === 'Services') {
                this.services = Array.isArray(data) ? data : [data];
            } else if (parameter === 'Professionals') {
                this.serviceprofessionals = Array.isArray(data) ? data : [data];
            }
        } catch (error) {
            console.error('Error performing search:', error);
        }
    }
},


};         

export default CustomerSearch;