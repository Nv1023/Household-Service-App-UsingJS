const EditServiceModal = {
  props: ['isEditModalOpen', 'selectedService'],
  template: `
    <div v-if="isEditModalOpen" class="modal" tabindex="-1" style="display: block;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Service</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="editService">
              <div class="mb-3">
                <label for="editServiceName" class="form-label">Service Name:</label>
                <input 
                  type="text" 
                  id="editServiceName" 
                  v-model="localService.service_name" 
                  class="form-control" 
                  required 
                />
              </div>
              <div class="mb-3">
                <label for="editBasePrice" class="form-label">Base Price:</label>
                <input 
                  type="number" 
                  id="editBasePrice" 
                  v-model="localService.service_price" 
                  class="form-control" 
                  required 
                />
              </div>
              <div class="mb-3">
                <label for="editServiceDescription" class="form-label">Service Description:</label>
                <input 
                  type="text" 
                  id="editServiceDescription" 
                  v-model="localService.service_description" 
                  class="form-control" 
                  required 
                />
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
                <button type="submit" class="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      localService: { ...this.selectedService },
    };
  },
  watch: {
    selectedService(newService) {
      this.localService = { ...newService };
    },
  },
  methods: {
    editService() {
      this.$emit('save', this.localService);
    },
    closeModal() {
      this.$emit('close');
      this.localService = { ...this.selectedService };
    },
  },
};

export default EditServiceModal;
