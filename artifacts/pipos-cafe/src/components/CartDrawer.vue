<script setup>
import { computed, inject, ref } from "vue";
import { ArrowRight, Clock3, Minus, Plus, ShoppingBag, Trash2, X } from "@lucide/vue";
import { cafeConfig } from "../config.js";

const emit = defineEmits(["close"]);
const cart = inject("cart");
const lines = cart.lines;
const quantity = cart.quantity;
const total = cart.total;
const name = ref("");
const phone = ref("");
const mode = ref("Levantamento");
const note = ref("");
const message = ref("");
const formattedTotal = computed(
  () => `${Math.round(total.value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} Kz`,
);

function money(value) {
  return `${Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} Kz`;
}

function send() {
  if (!name.value.trim() || !phone.value.trim()) {
    message.value = "Preenche o teu nome e telefone para continuar.";
    return;
  }
  if (!cafeConfig.whatsapp) {
    message.value = "WhatsApp ainda não configurado. Adiciona o número em src/config.js para receber pedidos.";
    return;
  }
  const itemList = lines.value
    .map((line) => `• ${line.quantity} × ${line.item.name} — ${money(line.item.price * line.quantity)}`)
    .join("\n");
  const body = `Olá, Pipo’s Café! Quero fazer um pedido:\n\n${itemList}\n\nSubtotal: ${formattedTotal.value}\nNome: ${name.value}\nTelefone: ${phone.value}\nEntrega/levantamento: ${mode.value}${note.value ? `\nObservações: ${note.value}` : ""}`;
  window.open(
    `https://wa.me/${cafeConfig.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(body)}`,
    "_blank",
    "noopener,noreferrer",
  );
  message.value = "Pedido preparado para enviar pelo WhatsApp.";
}
</script>

<template>
  <aside class="cart-drawer" aria-label="O teu pedido">
    <div class="drawer-head">
      <div>
        <small>O TEU PEDIDO</small>
        <h2>
          <img class="logo-drawer" src="/assets/brand/logo.png" alt="Pipo's Caffe" width="30" height="32" decoding="async" />
          O teu pedido <span class="count">{{ quantity }}</span>
        </h2>
      </div>
      <button class="icon-button" aria-label="Fechar pedido" @click="emit('close')"><X /></button>
    </div>

    <template v-if="lines.length">
      <div class="cart-lines">
        <article v-for="{ item, quantity: itemQuantity } in lines" :key="item.id" class="cart-line">
          <img
            loading="lazy"
            decoding="async"
            sizes="64px"
            :src="item.image"
            :srcset="`${item.image.replace('.png', '-2x.png')} 480w, ${item.image} 240w`"
            :alt="item.name"
          />
          <div class="line-main">
            <b>{{ item.name }}</b>
            <strong>{{ money(item.price * itemQuantity) }}</strong>
            <div class="qty-control">
              <button :aria-label="`Diminuir ${item.name}`" @click="cart.setQty(item.id, itemQuantity - 1)"><Minus :size="14" /></button>
              <span>{{ itemQuantity }}</span>
              <button :aria-label="`Aumentar ${item.name}`" @click="cart.setQty(item.id, itemQuantity + 1)"><Plus :size="14" /></button>
            </div>
          </div>
          <button class="trash" :aria-label="`Remover ${item.name}`" @click="cart.remove(item.id)"><Trash2 :size="17" /></button>
        </article>
      </div>

      <div class="cart-bottom">
        <button class="text-button" @click="cart.clear">Limpar pedido</button>
        <div class="subtotal"><span>Subtotal</span><b>{{ formattedTotal }}</b></div>
        <div class="pickup">
          <Clock3 :size="17" />
          <span><b>Tempo médio: {{ cafeConfig.preparationMinutes }} min.</b><br />Retirar no Pipo’s Café</span>
        </div>
        <div class="order-form">
          <h3>Finalizar pedido</h3>
          <label>Nome<input v-model="name" placeholder="O teu nome" /></label>
          <label>Telefone<input v-model="phone" placeholder="+244" /></label>
          <label>Como preferes receber?
            <select v-model="mode"><option>Levantamento</option><option>Entrega</option></select>
          </label>
          <label>Observações<textarea v-model="note" rows="2" placeholder="Algum detalhe para o pedido?" /></label>
          <button class="button primary full" @click="send">Finalizar pedido <ArrowRight :size="16" /></button>
          <p v-if="message" class="form-message" role="status">{{ message }}</p>
        </div>
      </div>
    </template>

    <div v-else class="empty-cart">
      <ShoppingBag :size="38" />
      <h3>O teu pedido começa aqui.</h3>
      <p>Escolhe algo do menu para a tua próxima pausa.</p>
      <button class="button primary" @click="emit('close')">Explorar cardápio</button>
    </div>
  </aside>
</template>
