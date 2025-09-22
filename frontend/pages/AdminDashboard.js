import EditServiceModal from '../components/EditServiceModal.js';
import DeleteServiceModal from '../components/DeleteServiceModal.js';
import AdminSideBar from '../components/AdminSideBar.js';

const AdminDashboard = {
  template: `
    <div class="container-fluid">
      <div class="row">
      <AdminSideBar/>
        <!-- Service Table -->
        <div class="col-md-10 offset-md-2 p-4">
          <section class="mb-5">
            <h3><i class="fas fa-cogs me-2"></i>Services</h3>
            <div class="table-responsive">
              <table class="table table-bordered table-hover">
                <thead class="table-dark">
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Service Name</th>
                    <th scope="col">Base Price</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="service in limitedServices" :key="service.id">
                    <td>{{ service.id }}</td>
                    <td>{{ service.service_name }}</td>
                    <td>{{ service.service_price }}</td>
                    <td>
                      <button @click="openEditModal(service)" class="btn btn-warning btn-sm me-1">
                        <i class="fas fa-edit me-1"></i>Edit
                      </button>
                      <button @click="openDeleteModal(service)" class="btn btn-danger btn-sm">
                        <i class="fas fa-trash-alt me-1"></i>Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="d-flex gap-2">
              <button v-if="services.length > 5" @click="showAllServices = !showAllServices" class="btn btn-secondary">
                <i class="fas fa-list me-1"></i>{{ showAllServices ? 'Show Less' : 'See More' }}
              </button>
              <button @click="navigateToAddService" class="btn btn-primary">
                <i class="fas fa-plus me-1"></i>Add Service
              </button>
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
                    <th scope="col">Service Name</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="professional in limitedProfessionals" :key="professional.id">
                    <td>{{ professional.id }}</td>
                    <td>{{ professional.fullname }}</td>
                    <td>{{ professional.experience }}</td>
                    <td>{{ professional.servicename }}</td>
                    <td>
                      <button @click="viewDocument(professional.id)" class="btn btn-info btn-sm me-1">
                        <i class="fas fa-file-alt me-1"></i>Document
                      </button>
                      <button @click="changeProfessionalStatus(professional.id,'approve')" class="btn btn-success btn-sm me-1">
                        <i class="fas fa-check me-1"></i>Approve
                      </button>
                      <button @click="changeProfessionalStatus(professional.id,'reject')" class="btn btn-danger btn-sm me-1">
                        <i class="fas fa-times me-1"></i>Reject
                      </button>
                      <button @click="changeProfessionalStatus(professional.id,'block')" class="btn btn-warning btn-sm me-1">
                        <i class="fas fa-ban me-1"></i>Block
                      </button>
                      <button @click="changeProfessionalStatus(professional.id,'unblock')" class="btn btn-primary btn-sm">
                        <i class="fas fa-unlock me-1"></i>Unblock
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="d-flex gap-2">
              <button v-if="professionals.length > 5" @click="showAllProfessionals = !showAllProfessionals" class="btn btn-secondary">
                <i class="fas fa-list me-1"></i>{{ showAllProfessionals ? 'Show Less' : 'See More' }}
              </button>
              <button @click="changeAllProfessionalsStatus" class="btn btn-primary">
                <i class="fas fa-check-double me-1"></i>Approve All Professionals
              </button>
            </div>
          </section>

          <!-- Customers Table -->
          <section class="mb-5">
            <h3><i class="fas fa-users me-2"></i>Customers</h3>
            <div class="table-responsive">
              <table class="table table-bordered table-hover" v-if="customers.length">
                <thead class="table-dark">
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Customer Name</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="customer in limitedCustomers" :key="customer.id">
                    <td>{{ customer.id }}</td>
                    <td>{{ customer.fullname }}</td>
                    <td>
                      <button @click="changeCustomerStatus(customer.id,'block')" class="btn btn-warning btn-sm me-1">
                        <i class="fas fa-ban me-1"></i>Block
                      </button>
                      <button @click="changeCustomerStatus(customer.id,'unblock')" class="btn btn-primary btn-sm">
                        <i class="fas fa-unlock me-1"></i>Unblock
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button v-if="customers.length > 5" @click="showAllCustomers = !showAllCustomers" class="btn btn-secondary">
              <i class="fas fa-list me-1"></i>{{ showAllCustomers ? 'Show Less' : 'See More' }}
            </button>
          </section>

          <!-- Service Remarks Table -->
          <section>
            <h3><i class="fas fa-comment-alt me-2"></i>Service Remarks</h3>
            <div class="table-responsive">
              <table class="table table-bordered table-hover">
                <thead class="table-dark">
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Professional Name</th>
                    <th scope="col">Date of Request</th>
                    <th scope="col">Rating</th>
                    <th scope="col">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="serviceremark in limitedServiceRemarks" :key="serviceremark.id">
                    <td>{{ serviceremark.id }}</td>
                    <td>{{ serviceremark?.professionals?.fullname }}</td>
                    <td>{{ serviceremark.service_date }}</td>
                    <td>
                      <span v-if="serviceremark.rating">
                        <i v-for="n in parseInt(serviceremark.rating)" class="fas fa-star text-warning"></i>
                        <i v-for="n in (5 - parseInt(serviceremark.rating))" class="far fa-star text-warning"></i>
                      </span>
                      <span v-else>N/A</span>
                    </td>
                    <td>{{ serviceremark.remarks }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button v-if="serviceremarks.length > 5" @click="showAllServiceRemarks = !showAllServiceRemarks" class="btn btn-secondary">
              <i class="fas fa-list me-1"></i>{{ showAllServiceRemarks ? 'Show Less' : 'See More' }}
            </button>
          </section>
          <section class="mb-5">
          <h3><i class="fas fa-file-csv me-2"></i>Download Service Requests</h3>
          <button @click="downloadServiceRequestsCSV" class="btn btn-success">
            <i class="fas fa-download me-1"></i>Download CSV
          </button>
        </section>
        </div>
      </div>
    </div>



    <EditServiceModal
      :isEditModalOpen="isEditModalOpen"
      :selectedService="selectedService"
      @close="isEditModalOpen = false"
      @save="saveService"
    />

    <DeleteServiceModal
      :isDeleteModalOpen="isDeleteModalOpen"
      :selectedService="selectedService"
      @close="closeModal"
      @confirmDelete="confirmDelete"
    />

    
  `,
  data() {
    return {
      name: null,
      services: [],
      professionals: [],
      customers: [],
      serviceremarks: [],
      isEditModalOpen: null,
      isDeleteModalOpen: null,
      selectedService: null,
      showAllServices: false,
      showAllProfessionals: false,
      showAllCustomers: false,
      showAllServiceRemarks: false,
    };
  },
  components: {
    EditServiceModal,
    DeleteServiceModal,
    AdminSideBar,
  },
  computed: {
    limitedServices() {
      return this.showAllServices ? this.services : this.services.slice(0, 5);
    },
    limitedProfessionals() {
      return this.showAllProfessionals ? this.professionals : this.professionals.slice(0, 5);
    },
    limitedCustomers() {
      return this.showAllCustomers ? this.customers : this.customers.slice(0, 5);
    },
    limitedServiceRemarks() {
      return this.showAllServiceRemarks ? this.serviceremarks : this.serviceremarks.slice(0, 5);
    },
    userId() {
      return this.$store.state.user_id;
    },
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
          console.error('Failed to fetch services');
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    },
    openEditModal(service) {
      this.selectedService = { ...service };
      this.isEditModalOpen = true;
    },
    async saveService(updatedService) {
      try {
        const response = await fetch(`${location.origin}/api/service/${updatedService.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': this.$store.state.auth_token,
            'Role': this.$store.state.role,
          },
          body: JSON.stringify(updatedService),
        });
        if (response.ok) {
          this.fetchServices();
          this.closeModal();
        } else {
          console.error('Failed to save service');
        }
      } catch (error) {
        console.error('Error saving service:', error);
      }
    },
    closeModal() {
      this.isEditModalOpen = false;
      this.selectedService = null;
      this.isDeleteModalOpen = false;
    },
    openDeleteModal(service) {
      this.selectedService = service;
      this.isDeleteModalOpen = true;
    },
    async confirmDelete(serviceId) {
      try {
        const response = await fetch(`${location.origin}/api/service/${serviceId}`, {
          method: 'DELETE',
          headers: {
            'Authentication-Token': this.$store.state.auth_token,
            'Role': this.$store.state.role,
          },
        });
        if (response.ok) {
          this.fetchServices();
          this.closeModal();
        } else {
          alert('Failed to delete the service');
        }
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    },
    async fetchProfessionals() {
      try {
        const response = await fetch(`${location.origin}/api/professionals`, {
          method: 'GET',
          headers: {
            'Authentication-Token': this.$store.state.auth_token,
            'Role': this.$store.state.role,
          },
        });
        if (response.ok) {
          this.professionals = await response.json();
        } else {
          console.error('Failed to fetch professionals');
        }
      } catch (error) {
        console.error('Error fetching professionals:', error);
      }
    },
    async fetchCustomers() {
      try {
        const response = await fetch(`${location.origin}/api/customers`, {
          method: 'GET',
          headers: {
            'Authentication-Token': this.$store.state.auth_token,
            'Role': this.$store.state.role,
          },
        });
        if (response.ok) {
          const data = await response.json();
          this.customers = Array.isArray(data) ? data : [data];
        } else {
          console.error('Failed to fetch customers');
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    },
    async fetchServiceRemarks() {
      try {
        const response = await fetch(`${location.origin}/api/serviceremarks/${this.userId}`, {
          method: 'GET',
          headers: {
            'Authentication-Token': this.$store.state.auth_token,
            'Role': this.$store.state.role,
          },
        });
        if (response.ok) {
          this.serviceremarks = await response.json();
        } else {
          console.error('Failed to fetch serviceremarks');
        }
      } catch (error) {
        console.error('Error fetching serviceremarks:', error);
      }
    },
    async changeProfessionalStatus(professionalId, action) {
      try {
        const response = await fetch(`${location.origin}/api/professional/action/${professionalId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': this.$store.state.auth_token,
            'Role': this.$store.state.role,
          },
          body: JSON.stringify({ action }),
        });
        if (response.ok) {
          this.fetchProfessionals();
          alert(`Professional ${action}d successfully`);
        } else {
          alert(`Failed to ${action} the professional`);
        }
      } catch (error) {
        console.error(`Error changing professional status to ${action}:`, error);
      }
    },
    async changeAllProfessionalsStatus() {
      try {
        const response = await fetch(`${location.origin}/api/professional/approve-all`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': this.$store.state.auth_token,
            'Role': this.$store.state.role,
          },
        });
        if (response.ok) {
          this.fetchProfessionals();
          alert('All pending professionals approved successfully');
        } else {
          alert('Failed to approve all professionals');
        }
      } catch (error) {
        console.error('Error changing all professionals status to approve:', error);
      }
    },
    viewDocument(professionalId) {
      fetch(`${location.origin}/api/professionaldocument/${professionalId}`, {
        method: 'GET',
        headers: {
          'Authentication-Token': this.$store.state.auth_token,
          'Role': this.$store.state.role,
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.blob();
          } else {
            throw new Error('Failed to download the document');
          }
        })
        .then((blob) => {
          const downloadUrl = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = `professional_${professionalId}_document`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          alert('Document Downloaded successfully');
        })
        .catch((err) => {
          console.error(err);
          alert('Failed to download the document');
        });
    },
    async downloadServiceRequestsCSV() {
      try {
          const response = await fetch(`${location.origin}/api/service_requests/export?admin_email=your_admin_email@example.com`, {
              method: 'GET',
              headers: {
                  'Authentication-Token': this.$store.state.auth_token,
                  'Role': this.$store.state.role,
              },
          });
  
          if (response.ok) {
              const blob = await response.blob();
              const downloadUrl = window.URL.createObjectURL(blob);
  
              const a = document.createElement('a');
              a.href = downloadUrl;
              a.download = `ServiceRequests_${new Date().toISOString().slice(0, 10)}.csv`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
  
              alert('✅ Service requests CSV downloaded successfully!');
          } else {
              alert('❌ Failed to download CSV. Please try again.');
          }
      } catch (error) {
          console.error('❌ Error downloading CSV:', error);
          alert('An error occurred while downloading the CSV.');
      }
  },  
    async changeCustomerStatus(customerID, action) {
      try {
        const response = await fetch(`${location.origin}/api/customer/action/${customerID}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': this.$store.state.auth_token,
            'Role': this.$store.state.role,
          },
          body: JSON.stringify({ action }),
        });
        if (response.ok) {
          this.fetchCustomers();
          alert(`Customer ${action} successfully`);
        } else {
          alert(`Failed to ${action} the customer`);
        }
      } catch (error) {
        console.error(`Error changing customer status to ${action}:`, error);
      }
    },
    async navigateToAddService() {
      try {
        if (this.$router) {
          await this.$router.push('/addservice');
        } else {
          throw new Error('Router instance not found.');
        }
      } catch (error) {
        console.error('Error navigating to Add Service:', error);
      }
    },

  },
  mounted() {
    this.fetchServices();
    this.fetchProfessionals();
    this.fetchCustomers();
    this.fetchServiceRemarks();
  },
};

export default AdminDashboard;