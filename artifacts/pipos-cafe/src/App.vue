<script setup>
import { computed, onBeforeUnmount, onMounted, provide, ref, watch } from "vue";
import { ShoppingBag } from "@lucide/vue";
import CafeHeader from "./components/CafeHeader.vue";
import CafeFooter from "./components/CafeFooter.vue";
import CartDrawer from "./components/CartDrawer.vue";

function readStoredJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

const lines = ref(readStoredJson("pipos-cart", []));
const drawerOpen = ref(false);
const pulse = ref(0);
const quantity = computed(() => lines.value.reduce((sum, line) => sum + line.quantity, 0));
const total = computed(() => lines.value.reduce((sum, line) => sum + line.item.price * line.quantity, 0));

function add(item, qty = 1) {
  const existing = lines.value.find((line) => line.item.id === item.id);
  if (existing) {
    existing.quantity += qty;
  } else {
    lines.value.push({ item, quantity: qty });
  }
  pulse.value += 1;
}

function setQty(id, quantityValue) {
  if (quantityValue < 1) {
    lines.value = lines.value.filter((line) => line.item.id !== id);
    return;
  }
  const line = lines.value.find((entry) => entry.item.id === id);
  if (line) line.quantity = quantityValue;
}

function remove(id) {
  lines.value = lines.value.filter((line) => line.item.id !== id);
}

function clear() {
  lines.value = [];
}

function openDrawer() {
  drawerOpen.value = true;
}

function closeOnEscape(event) {
  if (event.key === "Escape") drawerOpen.value = false;
}

watch(
  lines,
  (currentLines) => {
    try {
      localStorage.setItem("pipos-cart", JSON.stringify(currentLines));
    } catch (error) {
      console.error("Não foi possível guardar o pedido neste navegador.", error);
    }
  },
  { deep: true },
);

provide("cart", {
  lines,
  quantity,
  total,
  pulse,
  add,
  setQty,
  remove,
  clear,
  open: openDrawer,
});

onMounted(() => window.addEventListener("keydown", closeOnEscape));
onBeforeUnmount(() => window.removeEventListener("keydown", closeOnEscape));

const formattedTotal = computed(
  () => `${Math.round(total.value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} Kz`,
);
</script>

<template>
  <CafeHeader />
  <RouterView />
  <CafeFooter />

  <button
    v-if="quantity > 0"
    class="mobile-cart"
    aria-label="Abrir pedido"
    @click="openDrawer"
  >
    <ShoppingBag :size="19" />
    <span>{{ quantity }}</span>
    <b>{{ formattedTotal }}</b>
  </button>

  <div v-if="drawerOpen" class="overlay" @mousedown.self="drawerOpen = false">
    <CartDrawer @close="drawerOpen = false" />
  </div>
</template>
