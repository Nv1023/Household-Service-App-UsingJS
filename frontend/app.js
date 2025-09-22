import router from './utils/routers.js';
import store from './utils/utils.js';

const app = Vue.createApp({
    template: `
    <div>
        <router-view></router-view>
    </div>`,
    components: {
    },
});

app.use(router);
app.use(store);

app.mount('#app');
