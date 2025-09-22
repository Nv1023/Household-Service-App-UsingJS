import EditServiceModal from '../components/EditServiceModal.js';
import DeleteServiceModal from '../components/DeleteServiceModal.js';
import AdminSideBar from '../components/AdminSideBar.js';

const AdminSearch = {
  template: `
  <div class="container-fluid">
  <div class="row">
    <AdminSideBar />
    <div class="col-md-10 offset-md-2 p-4">
      <!-- Search Form -->
      <div class="mb-4">
        <form @submit.prevent="performSearch">
          <div class="input-group">
            <select v-model="searchParameter" class="form-select">
              <option value="Services">Services</option>
              <option value="Professionals">Professionals</option>
              <option value="ServiceHistory">Service History</option>
              <option value="Customers">Customers</option>
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

      <!-- Display Search Results -->
      <div v-if="searchResults.length > 0">
        <h3>Search Results</h3>

        <!-- Services Table -->
        <div v-if="searchParameter === 'Services'">
          <table class="table table-bordered table-hover">
            <thead class="table-dark">
              <tr>
                <th>ID</th>
                <th>Service Name</th>
                <th>Base Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="service in searchResults" :key="service.id">
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

        <!-- Professionals Table -->
        <div v-if="searchParameter === 'Professionals'">
          <table class="table table-bordered table-hover">
            <thead class="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Experience</th>
                <th>Service Name</th>
                <th>Approved</th>
                <th>Is_Blocked</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="professional in searchResults" :key="professional.id">
                <td>{{ professional.id }}</td>
                <td>{{ professional.fullname }}</td>
                <td>{{ professional.experience }}</td>
                <td>{{ professional.servicename }}</td>
                <td>{{ professional.approved }} </td>
                <td>{{ professional.is_blocked }} </td>
                <td>
                  <button @click="viewDocument(professional.id)" class="btn btn-info btn-sm me-1">
                    <i class="fas fa-file-alt me-1"></i>Document
                  </button>
                  <button @click="changeProfessionalStatus(professional.id, 'approve')" class="btn btn-success btn-sm me-1">
                    <i class="fas fa-check me-1"></i>Approve
                  </button>
                  <button @click="changeProfessionalStatus(professional.id, 'reject')" class="btn btn-danger btn-sm me-1">
                    <i class="fas fa-times me-1"></i>Reject
                  </button>
                  <button @click="changeProfessionalStatus(professional.id, 'block')" class="btn btn-warning btn-sm me-1">
                    <i class="fas fa-ban me-1"></i>Block
                  </button>
                  <button @click="changeProfessionalStatus(professional.id, 'unblock')" class="btn btn-primary btn-sm">
                    <i class="fas fa-unlock me-1"></i>Unblock
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

    <!-- Service History Table -->
    <div v-if="searchParameter === 'ServiceHistory'">
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
        <tr v-for="service_details in searchResults" :key="service_details.id">
          <td>{{ service_details.id }}</td>
          <td>{{ service_details.professional_name }}</td>
          <td>{{ service_details.service_date }}</td>
          <td>
            <span v-if="service_details.rating">
              <i v-for="n in parseInt(service_details.rating)" :key="'full-star-' + n" class="fas fa-star text-warning"></i>
              <i v-for="n in (5 - parseInt(service_details.rating))" :key="'empty-star-' + n" class="far fa-star text-warning"></i>
            </span>
            <span v-else>N/A</span>
          </td>
          <td>{{ service_details.remarks }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
      

        <!-- Customers Table -->
        <div v-if="searchParameter === 'Customers'">
          <table class="table table-bordered table-hover">
            <thead class="table-dark">
              <tr>
                <th>ID</th>
                <th>Customer Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="customer in searchResults" :key="customer.id">
                <td>{{ customer.id }}</td>
                <td>{{ customer.fullname }}</td>
                <td>
                  <button @click="changeCustomerStatus(customer.id, 'block')" class="btn btn-warning btn-sm me-1">
                    <i class="fas fa-ban me-1"></i>Block
                  </button>
                  <button @click="changeCustomerStatus(customer.id, 'unblock')" class="btn btn-primary btn-sm">
                    <i class="fas fa-unlock me-1"></i>Unblock
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else>
        <p>No results found.</p>
      </div>
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
      isEditModalOpen: null,
      isDeleteModalOpen: null,
      selectedService: null,
      showAllServices: false,
      showAllProfessionals: false,
      showAllCustomers: false,
      showAllServiceRemarks: false,
      searchParameter: 'Services',
      searchQuery: '',
      searchResults: [],
    };
  },
  components: {
    EditServiceModal,
    DeleteServiceModal,
    AdminSideBar,
  },
  computed: {
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
    async performSearch() {
        try {
          const response = await fetch(`${location.origin}/api/admin/search?parameter=${this.searchParameter}&query=${this.searchQuery}`, {
            method: 'GET',
            headers: {
              'Authentication-Token': this.$store.state.auth_token,
              'Role': this.$store.state.role,
            },
          });
    
          if (response.ok) {
            this.searchResults = await response.json();
          } else {
            console.error('Failed to fetch search results');
            this.searchResults = [];
          }
        } catch (error) {
          console.error('Error performing search:', error);
          this.searchResults = [];
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

export default AdminSearch;