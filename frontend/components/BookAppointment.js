const BookAppointment = {
    props: ['isModalOpen', 'professionalId', 'serviceId', 'customerId'], 
    template: `
        <div v-if="isModalOpen" class="modal fade show" tabindex="-1" style="display: block; background: rgba(0, 0, 0, 0.5);">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Book Appointment</h5>
                        <button type="button" class="btn-close" @click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="submitForm">
                            <div class="mb-3">
                                <label for="appointmentDate" class="form-label">Select Date</label>
                                <input type="date" class="form-control" v-model="selectedDate" required>
                            </div>
                            <div class="mb-3">
                                <label for="appointmentTime" class="form-label">Select Time</label>
                                <input type="time" class="form-control" v-model="selectedTime" required>
                            </div>
                            <div class="mb-3">
                                <label for="problemDescription" class="form-label">Describe Your Problem</label>
                                <textarea class="form-control" v-model="problemDescription" rows="3" required></textarea>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
                                <button type="submit" class="btn btn-primary">Book Appointment</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            selectedDate: null,  
            selectedTime: '09:00',  
            problemDescription: '', 
        };
    },
    methods: {
        closeModal() {
            this.$emit('close');  
        },
        submitForm() {
            const formattedDateTime = `${this.selectedDate}T${this.selectedTime}`;
            
            const bookingData = {
                service_id: this.serviceId,
                professional_id: this.professionalId,
                date_of_request: formattedDateTime,  
                customer_id: this.customerId,
                service_problem: this.problemDescription,
            };
            
            this.$emit('save', bookingData); 
        },
    },
};

export default BookAppointment;