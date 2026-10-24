<script setup>
import { watchEffect } from "vue";
import { RouterLink } from "vue-router";
import { Coffee } from "@lucide/vue";

watchEffect(() => {
  document.title = "Página não encontrada | Pipo’s Café";
});
</script>

<template>
  <main class="simple-page">
    <div class="no-results">
      <Coffee /><h1>Página não encontrada.</h1>
      <RouterLink class="button primary" to="/">Voltar ao início</RouterLink>
    </div>
  </main>
</template>
