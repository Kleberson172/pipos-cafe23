<script setup>
import { RouterLink } from "vue-router";
import { MapPin } from "@lucide/vue";
import { cafeConfig } from "../config.js";

const nav = [
  ["Início", "/"],
  ["Sobre nós", "/sobre"],
  ["Nosso Cardápio", "/cardapio"],
  ["Pipo’s Vibes", "/vibes"],
  ["Localização", "/localizacao"],
];
</script>

<template>
  <footer class="site-footer">
    <div class="footer-brand">
      <RouterLink to="/" class="brand-mark small" aria-label="Pipo’s Café início">
        <img class="logo logo-footer" src="/assets/brand/logo.png" alt="Pipo's Caffe" width="64" height="69" decoding="async" />
      </RouterLink>
      <p><b>O SABOR É SEMPRE REAL.</b><br />Café, pessoas e momentos que importam.</p>
    </div>
    <div class="footer-links">
      <RouterLink v-for="[label, url] in nav" :key="url" :to="url">{{ label }}</RouterLink>
    </div>
    <p class="footer-address"><MapPin :size="15" /> {{ cafeConfig.address }}</p>
    <div class="footer-bottom">
      Pipo’s Café © 2024. Todos os direitos reservados.
      <span>Feito em Luanda, com café e alma.</span>
    </div>
  </footer>
</template>
