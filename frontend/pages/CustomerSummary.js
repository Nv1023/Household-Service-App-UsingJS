import CustomerSideBar from "../components/CustomerSideBar.js";

const CustomerSummary = {
    props: ['id'],
    template: `
    <div class="container-fluid">
    <div class="row">
        <div class="col-md-2">
            <CustomerSideBar :id ="id" />
        </div>
        <div class="container chart-container mt-5 pt-5">
            <div class="row d-flex justify-content-center">
                <div class="col-md-5">
                    <canvas id="customerChart"></canvas>
                </div>
            </div>
        </div>
    </div>
    </div>
    `,

    data() {
        return {
            labels: [], 
            data: [],  
        };
    },
    components: {
        CustomerSideBar,
    },
    methods: {
        async fetchData() {
            try {
                const response = await fetch(`${location.origin}/api/customer/summary/${this.id}`, {
                    method: 'GET',
                    headers: {
                        'Authentication-Token': this.$store.state.auth_token,
                        'Role': this.$store.state.role,
                    },
                });

                if (response.ok) {
                    const result = await response.json(); 
                    this.labels = result.labels;
                    this.data = result.data;

                    this.renderChart();
                } else {
                    console.error('Failed to fetch data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },

        renderChart() {
            const ctx = document.getElementById('customerChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: this.labels,
                    datasets: [{
                        label: 'Service Status',
                        data: this.data,
                        borderWidth: 1,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    },

    mounted() {
        this.fetchData(); 
    }
};

export default CustomerSummary;