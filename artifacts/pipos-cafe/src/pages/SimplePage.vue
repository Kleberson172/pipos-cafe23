<script setup>
import { computed, watchEffect } from "vue";
import { RouterLink } from "vue-router";
import { ArrowRight, ArrowUpRight, MapPin } from "@lucide/vue";
import { cafeConfig } from "../config.js";

const props = defineProps({ type: { type: String, default: "sobre" } });
const isLoc = computed(() => props.type === "localizacao");

watchEffect(() => {
  document.title = `${isLoc.value ? "Localização" : "Sobre Nós"} | Pipo’s Café`;
  let description = document.querySelector('meta[name="description"]');
  if (!description) {
    description = document.createElement("meta");
    description.name = "description";
    document.head.appendChild(description);
  }
  description.content = isLoc.value
    ? `Encontra o Pipo’s Café em ${cafeConfig.address}.`
    : "Pipo’s Café, café, comida e momentos partilhados em Luanda.";
});
</script>

<template>
  <main class="simple-page">
    <section
      class="simple-hero"
      :style="{ backgroundImage: `linear-gradient(90deg,rgba(0,45,35,.9),rgba(0,45,35,.16)),url('/assets/banners/home-hero.png')` }"
    >
      <small>{{ isLoc ? "VISITA-NOS EM LUANDA" : "PIPO’S CAFÉ" }}</small>
      <h1>{{ isLoc ? "COMO CHEGAR." : "O SABOR É SEMPRE REAL." }}</h1>
      <p>{{ isLoc ? cafeConfig.address : "Um café acolhedor em Luanda onde café, comida e momentos partilhados fazem parte do dia." }}</p>
      <a v-if="isLoc" class="button primary" target="_blank" rel="noreferrer" :href="cafeConfig.mapsUrl"><MapPin :size="16" /> Abrir no Google Maps</a>
    </section>

    <section v-if="isLoc" class="location-card">
      <MapPin :size="28" />
      <div>
        <small>ENCONTRA-NOS</small><h2>{{ cafeConfig.address }}</h2>
        <p>Informações de telefone e horário serão actualizadas quando confirmadas.</p>
      </div>
      <a :href="cafeConfig.mapsUrl" target="_blank" rel="noreferrer" class="button outline">Como chegar <ArrowUpRight :size="15" /></a>
    </section>

    <section v-else class="about-story">
      <img src="/assets/vibes/vibe-interior.png" alt="Café e momentos partilhados" />
      <div>
        <small>CAFÉ · PESSOAS · MOMENTOS</small>
        <h2>UM LUGAR PARA SABER BEM.</h2>
        <p>Pipo’s Café é um café acolhedor em Luanda onde café, comida e momentos partilhados fazem parte do dia.</p>
        <RouterLink class="button primary" to="/cardapio">Explorar o cardápio <ArrowRight :size="16" /></RouterLink>
      </div>
    </section>
  </main>
</template>
