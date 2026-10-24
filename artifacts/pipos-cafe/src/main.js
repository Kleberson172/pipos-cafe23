import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import HomePage from "./pages/HomePage.vue";
import MenuPage from "./pages/MenuPage.vue";
import VibesPage from "./pages/VibesPage.vue";
import SimplePage from "./pages/SimplePage.vue";
import NotFoundPage from "./pages/NotFoundPage.vue";
import "./index.css";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", component: HomePage },
    { path: "/cardapio", component: MenuPage },
    { path: "/cardapio/:category", component: MenuPage, props: (route) => ({ category: route.params.category }) },
    { path: "/vibes", component: VibesPage },
    { path: "/sobre", component: SimplePage, props: { type: "sobre" } },
    { path: "/localizacao", component: SimplePage, props: { type: "localizacao" } },
    { path: "/:pathMatch(.*)*", component: NotFoundPage },
  ],
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  },
});

createApp(App).use(router).mount("#root");
