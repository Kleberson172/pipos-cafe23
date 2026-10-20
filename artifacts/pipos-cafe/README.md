# Pipo’s Café

Interface React + Vite para o Pipo’s Café, Luanda. Conteúdo em pt-AO, menu e navegação responsivos e carrinho guardado localmente no navegador.

## Desenvolvimento

```sh
pnpm install
pnpm dev
```

## Verificação e build

```sh
pnpm typecheck
pnpm build
```

## Configuração comercial

Editar `src/config.ts` para configurar telefone, WhatsApp, horário e links sociais confirmados. O mapa abre uma pesquisa pela morada confirmada, Via Luanda Sul, Luanda. Sem WhatsApp configurado, a interface informa como concluir a configuração, sem criar um link de contacto fictício.

As fotografias em `public/assets` são recortes e referências retirados exclusivamente das imagens de design fornecidas. Os recortes derivados da captura têm resolução limitada; substituir por originais do cliente quando disponíveis.
