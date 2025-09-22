import Servicecard from "../components/Servicecard.js";
import CustomerSideBar from "../components/CustomerSideBar.js";
import PaymentModal from "../components/PaymentModal.js";

const CustomerDashboard = {
  props: ['id'],
  template: `
    <div class="container-fluid">
      <div class="row">
        <CustomerSideBar :id="id"/>
        <div class="col-md-10 offset-md-2 p-4">
          <h3 class="mb-4"><i class="fas fa-tasks me-2"></i>Available Services</h3>
          <Servicecard :services="services" :customerid="id" />
          
          <!-- Your Services -->
          <section class="mb-5">
            <h3 class="mb-4"><i class="fas fa-tasks me-2"></i>Your Services</h3>
            <div class="table-responsive">
              <table class="table table-striped table-hover">
                <thead class="table-dark">
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Professional Name</th>
                    <th scope="col">Date of Request</th>
                    <th scope="col">Professional PhoneNo</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="request in servicerequest" :key="request.id">
                    <td>{{ request?.id || 'N/A' }}</td>
                    <td>{{ request?.professional?.fullname || 'N/A' }}</td>
                    <td>{{ request?.date_of_request || 'N/A' }}</td>
                    <td>{{ request?.professional?.phoneno || 'N/A' }}</td>
                    <td>
                      <button 
                        @click="openPaymentModal(request.id)" 
                        class="btn btn-success btn-sm">
                        <i class="fas fa-credit-card me-1"></i> Pay Now
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      <PaymentModal
        :isPaymentModalOpen="isPaymentModalOpen"
        :selectedRequestId="selectedRequestId"
        @close="closePaymentModal"
        :customerid="id"
        @paymentSuccess="handlePaymentSuccess"
      />
    </div>
  `,
  data() {
    return {
      services: [], 
      servicerequest: [], 
      isPaymentModalOpen: false,
      selectedRequestId: null,
    };
  },
  components: { 
    Servicecard,
    CustomerSideBar,
    PaymentModal,
  },
  methods: {
    async fetchServices() {
      try {
        const response = await fetch(`${location.origin}/api/services`, {
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
          console.error("Failed to fetch services");
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    },

    async fetchServiceRequest() {
      try {
        const response = await fetch(`${location.origin}/api/servicerequest/${this.id}`, {
          method: 'GET',
          headers: {
            'Authentication-Token': this.$store.state.auth_token,
            'Role': this.$store.state.role,
          },
        });

        if (response.ok) {
          const data = await response.json();
          this.servicerequest = Array.isArray(data) ? data : [];
          console.log(this.servicerequest);
        } else {
          console.error('Failed to fetch servicerequest');
          this.servicerequest = [];
        }
      } catch (error) {
        console.error('Error fetching servicerequest:', error);
        this.servicerequest = [];
      }
    },

    openPaymentModal(requestId) {
      this.selectedRequestId = requestId; 
      this.isPaymentModalOpen = true; 
    },

    closePaymentModal() {
      this.isPaymentModalOpen = false; 
      this.selectedRequestId = null; 
    },

    handlePaymentSuccess(requestId) {
      alert(`Payment for request #${requestId} was successful!`);
    },
  },
  mounted() {
    this.fetchServices(); 
    this.fetchServiceRequest(); 
  }
};

export default CustomerDashboard;