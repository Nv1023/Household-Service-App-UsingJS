const DeleteServiceModal = {
  props: ['isDeleteModalOpen', 'selectedService'],
  template: `
    <div v-if="isDeleteModalOpen && selectedService" class="modal" tabindex="-1" style="display: block;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Delete Service</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <p v-if="selectedService">Are you sure you want to delete the service "<strong>{{ selectedService.service_name }}</strong>"?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
            <button type="button" class="btn btn-danger" @click="confirmDelete" :disabled="!selectedService">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `,
  methods: {
    closeModal() {
      this.$emit('close');
    },
    confirmDelete() {
      if (this.selectedService) {
        this.$emit('confirmDelete', this.selectedService.id);
        this.closeModal();
      }
    },
  },
};

export default DeleteServiceModal;
