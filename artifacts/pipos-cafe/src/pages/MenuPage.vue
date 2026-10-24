<script setup>
import { computed, ref, watchEffect, inject } from "vue";
import { RouterLink } from "vue-router";
import {
  CakeSlice,
  ChevronDown,
  Coffee,
  CupSoda,
  Heart,
  Leaf,
  Minus,
  Plus,
  Search,
  Sandwich,
} from "@lucide/vue";
import { categories, menu } from "../data/menu.js";

const props = defineProps({ category: { type: String, default: "" } });
const cart = inject("cart");
const search = ref("");
const sort = ref("popular");
const tag = ref("Todos");
const filtersOpen = ref(false);

function slug(value) {
  return value.toLowerCase().replaceAll(" ", "-").replace("/", "-");
}

function iconFor(name) {
  if (name.includes("quente")) return Coffee;
  if (name.includes("gelada")) return CupSoda;
  if (name.includes("Lanches")) return Sandwich;
  if (name === "Crepes") return Leaf;
  return CakeSlice;
}

function money(value) {
  return `${Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} Kz`;
}

const active = computed(() => categories.find((value) => slug(value) === props.category) || categories[0]);
const filterOptions = computed(() =>
  [...new Set(menu.filter((item) => item.category === active.value).flatMap((item) => item.preferences || []))]
    .sort((left, right) => left.localeCompare(right)),
);
const filtered = computed(() =>
  menu
    .filter(
      (item) =>
        item.category === active.value &&
        (!search.value ||
          `${item.name} ${item.description} ${(item.preferences || []).join(" ")}`
            .toLowerCase()
            .includes(search.value.toLowerCase())) &&
        (tag.value === "Todos" || item.preferences?.includes(tag.value)),
    )
    .sort((left, right) => {
      if (sort.value === "az") return left.name.localeCompare(right.name);
      if (sort.value === "up") return left.price - right.price;
      if (sort.value === "down") return right.price - left.price;
      return 0;
    }),
);
const hero = computed(() =>
  active.value === "Bebidas quentes"
    ? "/assets/banners/hot-hero.png"
    : active.value === "Bebidas geladas"
      ? "/assets/banners/cold-hero.png"
      : active.value === "Lanches/Real"
        ? "/assets/banners/snacks-hero.png"
        : active.value === "Crepes"
          ? "/assets/banners/crepes-hero.png"
          : "/assets/banners/dessert-hero.png",
);
const heroDescription = computed(() =>
  active.value === "Bebidas quentes"
    ? "Cafés especiais, chás seleccionados e bebidas quentes para tornar o teu momento ainda mais especial."
    : active.value === "Bebidas geladas"
      ? "Refresca o teu dia. Bebidas geladas, sabor real e aquele clima especial que só o Pipo’s tem."
      : active.value === "Crepes"
        ? "Massa leve, recheios generosos e combinações que transformam o simples em especial."
        : active.value === "Sobremesas"
          ? "Mais do que sobremesas, são pequenas felicidades."
          : "Sabores que fazem parte do teu dia.",
);

function resetFilters() {
  tag.value = "Todos";
  search.value = "";
  sort.value = "popular";
  filtersOpen.value = false;
}

watchEffect(() => {
  document.title = `${active.value} | Pipo’s Café`;
  let description = document.querySelector('meta[name="description"]');
  if (!description) {
    description = document.createElement("meta");
    description.name = "description";
    document.head.appendChild(description);
  }
  description.content = `Explora ${active.value.toLowerCase()} no Pipo’s Café, em Luanda.`;
});
</script>

<template>
  <section class="menu-hero" :style="{ backgroundImage: `linear-gradient(90deg,rgba(0,45,35,.9),rgba(0,45,35,.07)),url(${hero})` }">
    <div>
      <small>PIPO’S CAFÉ · SABORES REAIS</small>
      <h1>{{ active.toUpperCase() }}</h1>
      <p>{{ heroDescription }}</p>
    </div>
  </section>

  <main class="menu-page">
    <div class="category-row">
      <RouterLink
        v-for="categoryName in categories"
        :key="categoryName"
        :to="`/cardapio/${slug(categoryName)}`"
        :class="['category-pill', { selected: active === categoryName }]"
      >
        <span><component :is="iconFor(categoryName)" /></span><b>{{ categoryName }}</b>
      </RouterLink>
      <RouterLink to="/vibes" class="category-pill"><span><Heart /></span><b>Pipo’s Vibes</b></RouterLink>
    </div>

    <div class="menu-toolbar">
      <div>
        <small>EXPLORA O MENU</small><h2>{{ active.toUpperCase() }}</h2><p>{{ filtered.length }} itens encontrados</p>
      </div>
      <div class="toolbar-controls">
        <label class="search-field">
          <Search :size="17" />
          <input v-model="search" placeholder="Procurar no menu..." aria-label="Pesquisar menu" />
        </label>
        <button class="filter-button" @click="filtersOpen = !filtersOpen">Filtros <ChevronDown :size="15" /></button>
        <select v-model="sort" aria-label="Ordenar por">
          <option value="popular">Mais populares</option><option value="up">Preço ↑</option><option value="down">Preço ↓</option><option value="az">A–Z</option>
        </select>
      </div>
    </div>

    <div :class="['filter-tags', { visible: filtersOpen }]">
      <button
        v-for="option in ['Todos', ...filterOptions]"
        :key="option"
        :class="{ selected: tag === option }"
        @click="tag = option"
      >{{ option }}</button>
      <button @click="resetFilters">Limpar filtros</button>
    </div>

    <div class="menu-layout">
      <section class="product-grid">
        <article v-for="item in filtered" :key="item.id" class="product-card" :data-category="item.category">
          <div class="product-image">
            <img
              loading="lazy"
              decoding="async"
              sizes="(max-width: 767px) 46vw, (max-width: 1279px) 28vw, 20vw"
              :src="item.image"
              :srcset="`${item.image.replace('.png', '-2x.png')} 480w, ${item.image} 240w`"
              :alt="item.name"
            />
          </div>
          <div class="product-info">
            <h3>{{ item.name }}</h3>
            <p>{{ item.description }}</p>
            <small v-if="item.preferences?.length" class="ingredients">{{ item.preferences.join(" · ") }}</small>
            <div class="product-bottom">
              <b>{{ money(item.price) }}</b>
              <div class="card-actions">
                <div v-if="cart.lines.value.find((line) => line.item.id === item.id)" class="qty-control">
                  <button :aria-label="`Diminuir ${item.name}`" @click="cart.setQty(item.id, cart.lines.value.find((line) => line.item.id === item.id).quantity - 1)"><Minus :size="13" /></button>
                  <span>{{ cart.lines.value.find((line) => line.item.id === item.id).quantity }}</span>
                  <button :aria-label="`Aumentar ${item.name}`" @click="cart.setQty(item.id, cart.lines.value.find((line) => line.item.id === item.id).quantity + 1)"><Plus :size="13" /></button>
                </div>
                <button class="add-button" :aria-label="`Adicionar ${item.name}`" @click="cart.add(item)"><Plus :size="15" /><span>Adicionar</span></button>
              </div>
            </div>
          </div>
        </article>

        <div v-if="!filtered.length" class="no-results">
          <Coffee /><h3>Nada por aqui ainda.</h3><p>Experimenta limpar os filtros ou outra pesquisa.</p>
          <button class="button primary" @click="resetFilters">Limpar filtros</button>
        </div>
      </section>

      <aside class="menu-aside">
        <div class="aside-note">
          <Leaf /><h3>CAFÉ, PESSOAS,<br />BONS ENCONTROS.</h3>
          <p>Cada escolha preparada com cuidado, ingredientes de qualidade e muito amor pelo café.</p>
        </div>
        <div class="aside-quote"><span>“</span><p>Uma chávena de café muda tudo.</p><small>— Pipo’s Café</small></div>
      </aside>
    </div>
  </main>
</template>
