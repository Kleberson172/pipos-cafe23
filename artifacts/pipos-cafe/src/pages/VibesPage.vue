<script setup>
import { computed, ref, watchEffect } from "vue";
import { ArrowUpRight, ChevronLeft, ChevronRight, Copy, Heart, Upload, X } from "@lucide/vue";
import { cafeConfig } from "../config.js";

const vibeCats = ["Todos", "Café & Bebidas", "Comida", "Amigos", "Ambiente", "Eventos", "Clientes", "Selfies", "Luanda"];
const gallery = [
  { image: "/assets/vibes/vibe-atmosphere.png", width: 203, cat: "Ambiente", label: "Momentos no Pipo’s Café" },
  { image: "/assets/vibes/vibe-drink.png", width: 172, cat: "Café & Bebidas", label: "Uma pausa para café" },
  { image: "/assets/vibes/vibe-food.png", width: 203, cat: "Comida", label: "Sabores partilhados" },
  { image: "/assets/vibes/vibe-friends.png", width: 295, cat: "Amigos", label: "À mesa com amigos" },
  { image: "/assets/vibes/vibe-cafe.png", width: 295, cat: "Eventos", label: "Pipo’s Café" },
  { image: "/assets/vibes/vibe-toast.png", width: 222, cat: "Clientes", label: "O sabor do dia" },
  { image: "/assets/vibes/vibe-work.png", width: 237, cat: "Selfies", label: "Uma pausa no Pipo’s" },
  { image: "/assets/vibes/vibe-interior.png", width: 288, cat: "Luanda", label: "Doce momento" },
];
const cat = ref("Todos");
const uploads = ref(readStored("pipos-vibe-uploads", []));
const caption = ref("");
const selected = ref(null);
const quote = ref(0);
const copied = ref(false);
const likes = ref(readStored("pipos-likes", {}));
const fileInput = ref(null);
const cards = computed(() => gallery.filter((item) => cat.value === "Todos" || item.cat === cat.value));
const quotes = [
  "Café é feito de momentos como estes.",
  "Um bom encontro começa à mesa.",
  "Pessoas, sabores e boa energia.",
];

function readStored(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function store(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Não foi possível guardar os dados neste navegador.", error);
  }
}

function upload(event) {
  const file = event?.target?.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const fresh = [`${reader.result}|${caption.value || "Um momento no Pipo’s Café"}`, ...uploads.value];
    uploads.value = fresh;
    store("pipos-vibe-uploads", fresh);
    caption.value = "";
    if (event.target) event.target.value = "";
  };
  reader.readAsDataURL(file);
}

function like(label) {
  likes.value = { ...likes.value, [label]: (likes.value[label] || 0) + 1 };
  store("pipos-likes", likes.value);
}

async function copy() {
  await navigator.clipboard?.writeText("#PiposVibes");
  copied.value = true;
  setTimeout(() => (copied.value = false), 1500);
}

watchEffect(() => {
  document.title = "Pipo’s Vibes | Pipo’s Café";
  let description = document.querySelector('meta[name="description"]');
  if (!description) {
    description = document.createElement("meta");
    description.name = "description";
    document.head.appendChild(description);
  }
  description.content = "Momentos reais, pessoas reais. Descobre um pouco do que se vive no Pipo’s Café.";
});
</script>

<template>
  <main class="vibes-page">
    <section class="vibes-hero">
      <div>
        <small>MOMENTOS REAIS. PESSOAS REAIS.</small>
        <h1>PIPO’S VIBES<br />EM CADA REGISTO.</h1>
        <p>Mais do que café, criamos encontros, histórias e momentos que sabem bem. Descobre um pouco do que se vive no Pipo’s Café.</p>
      </div>
      <img
        src="/assets/banners/vibes-hero.png"
        srcset="/assets/banners/vibes-hero.png 849w, /assets/banners/vibes-hero-2x.png 1200w"
        sizes="(max-width: 767px) 100vw, 58vw"
        alt="Ambiente e café no Pipo’s Café"
      />
    </section>

    <div class="vibe-filters">
      <button v-for="category in vibeCats" :key="category" :class="{ selected: cat === category }" @click="cat = category">{{ category }}</button>
    </div>

    <div class="vibe-layout">
      <section class="vibe-grid">
        <article v-for="item in cards" :key="item.label" class="vibe-photo" @click="selected = item.image">
          <img
            loading="lazy"
            decoding="async"
            :sizes="`(max-width: 767px) 46vw, 22vw`"
            :src="item.image"
            :srcset="`${item.image.replace('.png', '-2x.png')} 600w, ${item.image} ${item.width}w`"
            :alt="item.label"
          />
          <div class="photo-overlay">
            <span>{{ item.label }}</span>
            <button aria-label="Gostar desta fotografia" @click.stop="like(item.label)"><Heart :size="17" />{{ likes[item.label] || 0 }}</button>
          </div>
        </article>

        <article
          v-for="(entry, index) in uploads"
          :key="`user-${index}`"
          class="vibe-photo"
          @click="selected = entry.split('|')[0]"
        >
          <img loading="lazy" decoding="async" :src="entry.split('|')[0]" :alt="entry.split('|')[1]" />
          <div class="photo-overlay"><span>{{ entry.split("|")[1] }}</span></div>
        </article>
      </section>

      <aside class="follow-card">
        <small>FAZ PARTE DESTA HISTÓRIA</small>
        <h2>SEGUE-NOS</h2>
        <p>Mais cafés, mais momentos, mais Pipo’s Vibes. Segue-nos nas redes sociais e fica a par de tudo o que acontece no nosso mundo.</p>
        <div class="social-rounds">
          <span>
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="18" cy="6" r="1" fill="currentColor" stroke="none" />
            </svg>
          </span><span>f</span><span>♪</span>
        </div>
        <a
          :href="cafeConfig.instagram || undefined"
          :class="{ 'disabled-link': !cafeConfig.instagram }"
          target="_blank"
          rel="noreferrer"
        >Seguir no Instagram <ArrowUpRight :size="15" /></a>
        <blockquote>“{{ quotes[quote] }}”</blockquote>
        <div class="quote-arrows">
          <button aria-label="Citação anterior" @click="quote = (quote + 2) % 3"><ChevronLeft /></button>
          <button aria-label="Próxima citação" @click="quote = (quote + 1) % 3"><ChevronRight /></button>
        </div>
      </aside>
    </div>

    <section class="share-vibe">
      <div>
        <small>PARTILHA O TEU MOMENTO</small>
        <h2>FAZ PARTE DA HISTÓRIA.</h2>
        <p>Um registo do teu momento no Pipo’s Café.</p>
      </div>
      <label class="upload-button">
        <Upload :size="18" /> Escolher fotografia
        <input ref="fileInput" type="file" accept="image/*" @change="upload" />
      </label>
      <input v-model="caption" aria-label="Legenda da fotografia" placeholder="Escreve uma legenda..." />
      <button class="button primary" @click="fileInput?.click()">Publicar fotografia</button>
      <button class="copy-hash" @click="copy"><Copy :size="15" />{{ copied ? "Copiado!" : "Copiar #PiposVibes" }}</button>
    </section>

    <div v-if="selected" class="lightbox" @click="selected = null">
      <button aria-label="Fechar fotografia" @click="selected = null"><X /></button>
      <img :src="selected" alt="Fotografia ampliada" />
    </div>
  </main>
</template>
