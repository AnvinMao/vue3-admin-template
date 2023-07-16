import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import { setupStore } from "@/store";

import "@/permission";
import "virtual:svg-icons-register";
import "@/styles/index.scss";
import "uno.css";

const app = createApp(App);

setupStore(app);

app.use(router).mount("#app");
