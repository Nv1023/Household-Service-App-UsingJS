const ServiceCardSearch = {
    props: ["services", "customerid", "searchParameter"],  
    template: `
      <div class="row">
        <div v-if="servicesWithImages.length" class="d-flex flex-wrap">
          <div v-for="service in servicesWithImages" :key="service.id" class="col-md-4 mb-4">
            <div class="card h-100">
              <div v-if="service.computedImageUrl" class="card-img-top-container">
                <img 
                  :src="service.computedImageUrl" 
                  class="card-img-top" 
                  :alt="service.service_name"
                >
              </div>
              <div v-else class="card-img-top bg-light d-flex align-items-center justify-content-center" style="height: 200px;">
                <span class="text-muted">No Image Available</span>
              </div>
  
              <div class="card-body">
                <h5 class="card-title">
                  <a href="#" @click.prevent="goToServiceDetails(service.id)">
                    {{ service.service_name }}
                  </a>
                </h5>
                <p class="card-text">{{ service.service_description }}</p>
  
              </div>
            </div>
          </div>
        </div>
        <div v-else class="col-12">
          <h3 class="text-center">No Services Available</h3>
        </div>
      </div>
    `,
    computed: {
      servicesWithImages() {
        return this.services.map(service => {
          const computedImageUrl = service.image_url || null;
          return {
            ...service,
            computedImageUrl
          };
        });
      }
    },
    methods: {
      goToServiceDetails(serviceId) {
        this.$router.push({ 
          name: "ServiceDetails", 
          params: { 
            id: Number(serviceId), 
            customerid: Number(this.customerid), 
            parameter: this.searchParameter  
          } 
        });
      },
    }
  };
  
  export default ServiceCardSearch;
  