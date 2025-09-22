import ProfessionalSideBar from "../components/ProfessionalSideBar.js";

const ProfessionalDashboard = {
  props: ['id'],
  template: `
      <ProfessionalSideBar :id="id"/>
      <div class="container-fluid">
          <div class="row">
              <div class="col-md-2"></div> 
              <div class="col-md-10 py-4">
                  <!-- Available Service -->
                  <section class="mb-5">
                      <h3 class="mb-4"><i class="fas fa-tasks me-2"></i>Available Services</h3>
                      <div class="table-responsive">
                          <table class="table table-striped table-hover">
                              <thead class="table-dark">
                                  <tr>
                                      <th scope="col">ID</th>
                                      <th scope="col">Name</th>
                                      <th scope="col">Date of Request</th>
                                      <th scope="col">Phone</th>
                                      <th scope="col">Address</th>
                                      <th scope="col">Pincode</th>
                                      <th scope="col">Action</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  <tr v-for="request in servicerequest" :key="request.id">
                                      <td>{{ request?.id || 'N/A' }}</td>
                                      <td>{{ request?.customer?.fullname || 'N/A' }}</td>
                                      <td>{{ request?.date_of_request || 'N/A' }}</td>
                                      <td>{{ request?.customer?.phoneno || 'N/A' }}</td>
                                      <td>{{ request?.customer?.address || 'N/A' }}</td>
                                      <td>{{ request?.customer?.pincode || 'N/A' }}</td>  
                                      <td>
                                          <button 
                                              @click="changeServiceRequestStatus(request.id, 'accept')" 
                                              class="btn btn-primary btn-sm me-1" 
                                              :disabled="disabledRequests[request.id]">
                                              <i class="fas fa-check me-1"></i> Accept
                                          </button>
                                          <button 
                                              @click="changeServiceRequestStatus(request.id, 'reject')" 
                                              class="btn btn-danger btn-sm" 
                                              :disabled="disabledRequests[request.id]">
                                              <i class="fas fa-times me-1"></i> Reject
                                          </button>
                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                      </div>
                  </section>
                  
                  <!-- Service Remarks -->
                  <section>
                      <h3 class="mb-4"><i class="fas fa-clipboard-list me-2"></i>Service Remarks</h3>
                      <div class="table-responsive">
                          <table class="table table-striped table-hover">
                              <thead class="table-dark">
                                  <tr>
                                      <th scope="col">ID</th>
                                      <th scope="col">Name</th>
                                      <th scope="col">Date of Completion</th>
                                      <th scope="col">Phone</th>
                                      <th scope="col">Address</th>
                                      <th scope="col">Pincode</th>
                                      <th scope="col">Rating</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  <tr v-for="remark in filteredRemarks" :key="remark.id">
                                      <td>{{ remark?.id || 'N/A' }}</td>
                                      <td>{{ remark?.service_request?.customer?.fullname || 'N/A' }}</td>
                                      <td>{{ remark?.service_request?.date_of_completion || 'N/A' }}</td>
                                      <td>{{ remark?.service_request?.customer?.phoneno || 'N/A' }}</td>
                                      <td>{{ remark?.service_request?.customer?.address || 'N/A' }}</td>
                                      <td>{{ remark?.service_request?.customer?.pincode || 'N/A' }}</td>  
                                      <td>
                                          <span v-if="remark?.rating">
                                              <i v-for="n in parseInt(remark.rating)" class="fas fa-star text-warning"></i>
                                              <i v-for="n in (5 - parseInt(remark.rating))" class="far fa-star text-warning"></i>
                                          </span>
                                          <span v-else>N/A</span>
                                      </td>
                                  </tr>
                                  <tr v-if="filteredRemarks.length === 0">
                                      <td colspan="7" class="text-center py-3">No service remarks available</td>
                                  </tr>
                              </tbody>
                          </table>
                          <div class="text-center mt-3" v-if="serviceremarks.length > initialRemarksCount">
                              <button 
                                  v-if="!showAllRemarks" 
                                  @click="showAllRemarks = true" 
                                  class="btn btn-primary">
                                  See More
                              </button>
                              <button 
                                  v-else 
                                  @click="showAllRemarks = false" 
                                  class="btn btn-secondary">
                                  See Less
                              </button>
                          </div>
                      </div>
                  </section>
              </div>
          </div>
      </div>
  `,

  data() {
    return {
      name: null,
      servicerequest: [],  
      serviceremarks: [],
      disabledRequests: {},
      showAllRemarks: false,
      initialRemarksCount: 5
    };
  },

  computed: {
    filteredRemarks() {
        return this.showAllRemarks 
            ? this.serviceremarks 
            : this.serviceremarks.slice(0, this.initialRemarksCount);
    }
  },

  components: {
    ProfessionalSideBar,
  },

  methods: {
    async fetchServiceRemarks() {
        try {
            const response = await fetch(`${location.origin}/api/serviceremarks/${this.id}`, {
                method: 'GET',
                headers: {
                    'Authentication-Token': this.$store.state.auth_token,
                    'Role': this.$store.state.role,
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                this.serviceremarks = Array.isArray(data) ? data : [];
            } else {
                console.error('Failed to fetch serviceremarks');
                this.serviceremarks = [];
            }
        } catch (error) {
            console.error('Error fetching serviceremarks:', error);
            this.serviceremarks = [];
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
            } else {
                console.error('Failed to fetch servicerequest');
                this.servicerequest = [];
            }
        } catch (error) {
            console.error('Error fetching servicerequest:', error);
            this.servicerequest = [];
        }
    },

    async changeServiceRequestStatus(servicerequestId, action) {
        try {
            this.disabledRequests[servicerequestId] = true;

            const response = await fetch(`${location.origin}/api/servicerequest/${servicerequestId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.$store.state.auth_token,
                    'Role': this.$store.state.role,
                },
                body: JSON.stringify({ action }),
            });

            if (response.ok) {
                await this.fetchServiceRequest();
                alert(`Service Request ${action}ed successfully`);
            } else {
                alert(`Failed to ${action} the Service Request`);
            }
        } catch (error) {
            console.error(`Error changing Service Request status to ${action}:`, error);
        } finally {
            this.disabledRequests[servicerequestId] = false;
        }
    },
  },

  mounted() {
    this.fetchServiceRequest();
    this.fetchServiceRemarks();
  }
};

export default ProfessionalDashboard;
