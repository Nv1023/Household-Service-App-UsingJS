const PaymentModal = {
    props: ['isPaymentModalOpen', 'selectedRequestId', 'customerid'],
    template: `
      <div v-if="isPaymentModalOpen" class="modal fade show" tabindex="-1" style="display: block; background: rgba(0, 0, 0, 0.5);">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="paymentModalLabel">Payment Portal</h5>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="processPayment">
                <div class="mb-3">
                  <label for="cardNumber" class="form-label">Card Number</label>
                  <input type="text" class="form-control" id="cardNumber" placeholder="1234 5678 9012 3456" required>
                </div>
                <div class="mb-3">
                  <label for="expiryDate" class="form-label">Expiry Date</label>
                  <input type="text" class="form-control" id="expiryDate" placeholder="MM/YY" required>
                </div>
                <div class="mb-3">
                  <label for="cvv" class="form-label">CVV</label>
                  <input type="text" class="form-control" id="cvv" placeholder="123" required>
                </div>
                <div class="mb-3">
                    <label for="pay" class="form-label">Amount(₹)</label>
                    <input type="number" class="form-control" id="pay" placeholder="100" required>
                </div>
                <button type="submit" class="btn btn-primary w-100">Pay Now</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `,
    methods: {
      closeModal() {
        this.$emit('close'); 
      },
      processPayment() {
        this.$emit('paymentSuccess', this.selectedRequestId); 
        this.closeModal(); 
        this.$router.push(`/serviceremark/${this.selectedRequestId}?customerid=${this.customerid}`);
      },
    },
  };
  
  export default PaymentModal;