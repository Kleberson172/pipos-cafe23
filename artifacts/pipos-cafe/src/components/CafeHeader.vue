<script setup>
import { computed, inject, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { Menu as MenuIcon, ShoppingBag, X } from "@lucide/vue";

const nav = [
  ["Início", "/"],
  ["Sobre nós", "/sobre"],
  ["Nosso Cardápio", "/cardapio"],
  ["Pipo’s Vibes", "/vibes"],
  ["Localização", "/localizacao"],
];
const cart = inject("cart");
const route = useRoute();
const open = ref(false);
const quantity = computed(() => cart.lines.value.reduce((sum, line) => sum + line.quantity, 0));

function isActive(url) {
  return (
    route.path === url ||
    (url === "/cardapio" && route.path.startsWith("/cardapio")) ||
    (url === "/vibes" && route.path.startsWith("/vibes"))
  );
}
</script>

<template>
  <header class="site-header">
    <RouterLink to="/" class="brand-mark" aria-label="Pipo’s Café início">
      <img class="logo logo-header" src="/assets/brand/logo.png" alt="Pipo's Caffe" width="43" height="46" decoding="async" />
    </RouterLink>

    <nav :class="open ? 'main-nav open' : 'main-nav'" aria-label="Navegação principal">
      <RouterLink
        v-for="[label, url] in nav"
        :key="url"
        :to="url"
        :class="{ active: isActive(url) }"
        @click="open = false"
      >
        {{ label }}
      </RouterLink>
    </nav>

    <div class="header-actions">
      <button
        class="header-order"
        :aria-label="`Pedir agora; ${quantity} ${quantity === 1 ? 'item' : 'itens'} no pedido`"
        @click="cart.open"
      >
        <ShoppingBag :key="cart.pulse.value" :class="cart.pulse.value ? 'cart-mark' : undefined" :size="16" />
        <span>Pedir agora</span>
        <span v-if="quantity > 0" class="header-order-count" aria-live="polite">{{ quantity }}</span>
      </button>
      <button
        class="menu-toggle"
        :aria-label="open ? 'Fechar menu' : 'Abrir menu'"
        @click="open = !open"
      >
        <X v-if="open" />
        <MenuIcon v-else />
      </button>
    </div>
  </header>
</template>
