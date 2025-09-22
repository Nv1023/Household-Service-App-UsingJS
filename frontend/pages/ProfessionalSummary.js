import ProfessionalSideBar from "../components/ProfessionalSideBar.js";

const ProfessionalSummary = {
    props: ['id'], 
    template: `
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-2">
                    <ProfessionalSideBar :id="id" />
                </div>

                <!-- Main Content -->
                <div class="col-md-10">
                    <div class="container chart-container mt-5 pt-5">
                        <div class="row d-flex justify-content-center">
                            <div class="col-md-5">
                                <canvas id="professionalChart1"></canvas>
                            </div>
                            <div class="col-md-5">
                                <canvas id="professionalChart2"></canvas>
                            </div>
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
            labels1: [],       
            data1: [],         
        };
    },
    components: {
        ProfessionalSideBar, 
    },
    methods: {
        async fetchData() {
            try {
                const response = await fetch(`${location.origin}/api/professional/summary/${this.id}`, {
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
                    this.labels1 = result.labels1;
                    this.data1 = result.data1;

                    this.renderCharts();
                } else {
                    console.error('Failed to fetch data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },

        renderCharts() {
            const ctx1 = document.getElementById('professionalChart1').getContext('2d');
            new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: this.labels,
                    datasets: [{
                        label: 'Number Of Ratings',
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

            const ctx2 = document.getElementById('professionalChart2').getContext('2d');
            new Chart(ctx2, {
                type: 'bar',
                data: {
                    labels: this.labels1,
                    datasets: [{
                        label: 'Service Status',
                        data: this.data1,
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

export default ProfessionalSummary;