<script setup>
import { computed, inject, watchEffect, ref } from "vue";
import { RouterLink } from "vue-router";
import {
  ArrowRight,
  ArrowUpRight,
  CakeSlice,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Coffee,
  CupSoda,
  Heart,
  Leaf,
  MapPin,
  Plus,
  Sandwich,
  ShoppingCart,
  Star,
} from "@lucide/vue";
import { cafeConfig } from "../config.js";
import { categories, menu } from "../data/menu.js";

const cart = inject("cart");
const slide = ref(0);
const filter = ref("Todos");
const size = ref("M");
const extras = ref([]);
const dough = ref("Clássica");
const fill = ref("Nutella");
const topping = ref("Caramelo");
const mood = ref("Cheio de energia");
const review = ref(0);

const quick = menu.filter((item) =>
  ["cheesecake-lotus", "laranja", "iced-caramel", "milkshake-lotus", "milkshake-chocolate", "crepe-classico", "cocktail"].includes(item.id),
);
const homeCategories = [
  { name: "Menu", url: "/cardapio", icon: Sandwich },
  ...categories.map((category) => ({ name: category, url: `/cardapio/${slug(category)}`, icon: iconFor(category) })),
  { name: "Pipo’s Vibes", url: "/vibes", icon: Heart },
];
const visibleCategories = computed(() =>
  homeCategories.map((_, index) => homeCategories[(slide.value + index) % homeCategories.length]).slice(0, 6),
);
const shown = computed(() =>
  quick.filter(
    (item) =>
      filter.value === "Todos" ||
      item.category.toLowerCase().includes(filter.value.toLowerCase()) ||
      (filter.value === "Sobremesas" && item.category === "Sobremesas"),
  ),
);
const lotus = menu.find((item) => item.id === "milkshake-lotus");
const lotusPrice = computed(
  () => lotus.price + (size.value === "G" ? 500 : 0) + extras.value.length * 500,
);
const crepe = menu.find((item) => item.id === "crepe-classico");
const crepePrice = computed(
  () =>
    4000 +
    (dough.value !== "Clássica" ? 1000 : 0) +
    (fill.value === "Nutella" || fill.value === "Chocolate" ? 1500 : fill.value === "Banana" ? 1000 : 0) +
    500,
);
const recommendation = computed(
  () =>
    menu.find((item) =>
      mood.value === "Relaxado"
        ? item.id === "hot-fruit-tea"
        : mood.value === "Com saudades de casa"
          ? item.id === "laranja"
          : item.id === "iced-caramel",
    ),
);
const reviews = [
  "“O melhor café que encontrei em Luanda! Ambiente incrível e a equipa é atenciosa.”",
  "“Adoro o Pipo’s. Bom atendimento, e o cardápio tem tudo o que gosto.”",
  "“Ambiente super calmo, ideal para trabalhar ou relaxar.”",
];
const filterTabs = ["Todos", "Bebidas Quentes", "Bebidas Geladas", "Lanches", "Crepes", "Sobremesas"];

function iconFor(name) {
  if (name.includes("quente")) return Coffee;
  if (name.includes("gelada")) return CupSoda;
  if (name.includes("Lanches")) return Sandwich;
  if (name === "Crepes") return Leaf;
  return CakeSlice;
}

function slug(category) {
  return category.toLowerCase().replaceAll(" ", "-").replace("/", "-");
}

function money(value) {
  return `${Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} Kz`;
}

function addCrepe() {
  cart.add({ ...crepe, name: `Crepe ${fill.value} com ${topping.value}`, price: crepePrice.value });
}

watchEffect(() => {
  document.title = "Início | Pipo’s Café";
  let description = document.querySelector('meta[name="description"]');
  if (!description) {
    description = document.createElement("meta");
    description.name = "description";
    document.head.appendChild(description);
  }
  description.content = "Café, comida e momentos partilhados no Pipo’s Café, em Luanda.";
});
</script>

<template>
  <main class="home">
    <section class="home-hero">
      <div class="hero-copy">
        <small>O SABOR É SEMPRE REAL</small>
        <h1>A PAUSA MAIS<br />DOCE DO DIA.</h1>
        <p>Café e arte. O Pipo’s Café junta o doce com o real, sem pressa.</p>
        <div class="hero-links">
          <RouterLink class="button primary" to="/cardapio">Ver Menu <ArrowRight :size="16" /></RouterLink>
          <RouterLink class="button outline" to="/localizacao">Como Chegar</RouterLink>
        </div>
        <div class="hero-meta">
          <span><Clock3 /> Horário: {{ cafeConfig.hours || "informação a confirmar" }}</span>
          <span><MapPin /> {{ cafeConfig.address }}</span>
        </div>
      </div>
      <picture class="hero-photo">
        <source
          media="(min-width: 768px)"
          srcset="/assets/banners/pipos-hero-desktop.webp"
          type="image/webp"
        />
        <img
          src="/assets/banners/pipos-hero-mobile.webp"
          width="800"
          height="1035"
          alt="Homem a segurar um copo gigante de café gelado dentro do Pipo’s Café"
          loading="eager"
          fetchpriority="high"
          decoding="async"
        />
      </picture>
    </section>

    <section class="today-section">
      <div class="section-heading">
        <div><small>ESCOLHE O TEU MOMENTO</small><h2>O que te apetece hoje?</h2></div>
        <div class="round-arrows">
          <button aria-label="Anterior" @click="slide = (slide + homeCategories.length - 1) % homeCategories.length"><ChevronLeft /></button>
          <button aria-label="Seguinte" @click="slide = (slide + 1) % homeCategories.length"><ChevronRight /></button>
        </div>
      </div>
      <div class="home-category-strip">
        <RouterLink
          v-for="category in visibleCategories"
          :key="category.url"
          :to="category.url"
          class="home-category"
        >
          <span><component :is="category.icon" /></span><b>{{ category.name }}</b>
        </RouterLink>
      </div>
    </section>

    <section class="snack-section">
      <div class="section-heading">
        <div><small>PEQUENAS PAUSAS GRANDES</small><h2>SÓ MAIS UM BOCADINHO.</h2><p>Os prazeres que te fazem respirar.</p></div>
      </div>
      <div class="filter-tabs">
        <button
          v-for="tab in filterTabs"
          :key="tab"
          :class="{ chosen: filter === tab }"
          @click="filter = tab"
        >{{ tab }}</button>
      </div>
      <div class="quick-grid">
        <article v-for="item in shown" :key="item.id" class="quick-card">
          <img
            loading="lazy"
            decoding="async"
            sizes="(max-width: 767px) 46vw, (max-width: 1279px) 30vw, 22vw"
            :src="item.image"
            :srcset="`${item.image.replace('.png', '-2x.png')} 480w, ${item.image} 240w`"
            :alt="item.name"
          />
          <div>
            <small>{{ item.category.toUpperCase() }}</small>
            <h3>{{ item.name }}</h3>
            <p>{{ item.description }}</p>
            <strong>{{ money(item.price) }}</strong>
            <button :aria-label="`Adicionar ${item.name}`" @click="cart.add(item)"><Plus /></button>
          </div>
        </article>
      </div>
    </section>

    <section class="lotus-section">
      <div class="lotus-image"><img :src="lotus.image" alt="Milkshake de Lotus" /></div>
      <div class="lotus-content">
        <small>A TUA BEBIDA DE HOJE</small>
        <h2>MILKSHAKE DE LOTUS</h2>
        <p>Uma explosão de sabor e cremosidade. Leite, baunilha e caramelo, perfeita a autenticidade nesta bebida.</p>
        <span>Tamanho</span>
        <div class="choice-row">
          <button v-for="choice in ['P', 'M', 'G']" :key="choice" :class="{ on: size === choice }" @click="size = choice">{{ choice }}</button>
        </div>
        <span>Extras</span>
        <div class="choice-row">
          <button
            v-for="extra in ['Em Fruta', 'Chantilly', 'Topping']"
            :key="extra"
            :class="{ on: extras.includes(extra) }"
            @click="extras = extras.includes(extra) ? extras.filter((entry) => entry !== extra) : [...extras, extra]"
          >{{ extra }} + 500 Kz</button>
        </div>
        <div class="lotus-price">
          <b>{{ money(lotusPrice) }}</b>
          <button class="button primary" @click="cart.add({ ...lotus, price: lotusPrice })"><ShoppingCart :size="15" /> Adicionar ao pedido</button>
        </div>
        <div class="pause-ribbon">
          <span>♡</span>
          <p><b>A tua pausa está quase pronta.</b><br />Tempo médio: {{ cafeConfig.preparationMinutes }} min. · Retirar no Pipo’s Café</p>
          <button @click="cart.open">Enviar pedido por WhatsApp <ArrowRight :size="15" /></button>
        </div>
      </div>
    </section>

    <section class="crepe-section">
      <div class="crepe-photo"><img src="/assets/products/crepe-nutella.png" alt="Crepe preparado no Pipo’s Café" /></div>
      <div class="crepe-content">
        <small>ESCOLHE O TEU MOMENTO</small><h2>MONTA O TEU CREPE.</h2>
        <p>Aqui quem manda no sabor és tu.</p>
        <label>1. MASSA<select v-model="dough"><option>Clássica</option><option>Fibras</option></select></label>
        <label>2. RECHEIO<select v-model="fill"><option>Nutella</option><option>Chocolate</option><option>Banana</option></select></label>
        <label>3. COBERTURA<select v-model="topping"><option>Caramelo</option><option>Chocolate</option><option>Avelãs</option></select></label>
        <div class="crepe-total"><span>O teu crepe:<br /> {{ dough }} × {{ fill }}</span><b>{{ money(crepePrice) }}</b></div>
        <button class="button primary" @click="addCrepe"><ShoppingCart :size="16" /> Pedir este crepe</button>
      </div>
    </section>

    <section class="drink-section">
      <div class="drink-prompt">
        <small>ENERGIA NATURAL. AUTENTICIDADE REAL.</small><h2>ESPRESSE<br />O DIA.</h2>
        <p>Só no aqui. Sorri na cara. Fruta fresca, um impulso na tua rotina, a medida de vida tem sempre o melhor sabor.</p>
        <RouterLink class="button primary" to="/cardapio/bebidas-geladas">Explorar bebidas <ArrowRight :size="16" /></RouterLink>
      </div>
      <img src="/assets/banners/cold-hero.png" alt="Bebidas frescas com fruta" />
    </section>

    <section class="recommend-section">
      <div>
        <small>QUAL É A TUA BEBIDA?</small><h2>ESCOLHE COMO TE SENTES.</h2>
        <button
          v-for="choice in ['Cheio de energia', 'Relaxado', 'Com saudades de casa']"
          :key="choice"
          :class="['mood-choice', { selected: mood === choice }]"
          @click="mood = choice"
        >
          {{ choice }}<Check v-if="mood === choice" :size="16" />
        </button>
      </div>
      <article class="recommend-card">
        <img :src="recommendation.image" :alt="recommendation.name" />
        <div>
          <small>A NOSSA SUGESTÃO</small><h3>{{ recommendation.name }}</h3><p>{{ recommendation.description }}</p>
          <strong>{{ money(recommendation.price) }}</strong>
          <button class="button primary" @click="cart.add(recommendation)">Adicionar ao pedido</button>
        </div>
      </article>
    </section>

    <section class="vibes-teaser">
      <div>
        <small>UM POUCO DE INSPIRAÇÃO</small><h2>PIPO’S VIBES.</h2><p>Tira uma foto e vê-nos. Pipo’s é inspirar real.</p>
        <RouterLink class="button outline" to="/vibes">Segue-nos no Instagram <ArrowUpRight :size="16" /></RouterLink>
      </div>
      <img src="/assets/vibes/vibe-friends.png" alt="Momentos partilhados no Pipo’s Café" />
    </section>

    <section class="reviews-section">
      <div class="section-heading">
        <div><small>HISTÓRIAS REAIS. PESSOAS REAIS.</small><h2>QUEM PROVA, VOLTA.</h2></div>
        <div class="rating"><Star fill="currentColor" /> <b>4,8</b><span>/ 126 avaliações</span></div>
      </div>
      <div class="review-card">
        <button aria-label="Avaliação anterior" @click="review = (review + 2) % 3"><ChevronLeft /></button>
        <p>{{ reviews[review] }}</p>
        <button aria-label="Próxima avaliação" @click="review = (review + 1) % 3"><ChevronRight /></button>
      </div>
      <a class="google-link" href="https://www.google.com/search?q=Pipo%27s+Caf%C3%A9+Luanda" target="_blank" rel="noreferrer">Ver no Google <ArrowUpRight :size="15" /></a>
    </section>
  </main>
</template>
