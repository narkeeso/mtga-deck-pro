import { writable } from "svelte/store";

const ORIGIN = "https://api.scryfall.com";
const MAX_DUPLICATE_CARDS = 4;

export const setStore = writable({
  data: []
});

export async function getSets() {
  const resp = await fetch(`${ORIGIN}/sets`);
  const sets = await resp.json();
  const now = new Date();

  setStore.update(store => ({
    ...store,
    data: sets.data.filter(set => {
      return (
        Date.parse(set.released_at) < now &&
        (set.set_type === "expansion" || set.set_type === "core")
      );
    })
  }));
}

export const cardStore = writable({
  isLoading: false,
  data: []
});

export async function getCards(filters, sort) {
  const colon = encodeURIComponent(":");

  let queries = ["game:arena"];
  let sorting = `order=${sort.by}&dir=${sort.dir}`;

  if (filters.setCode) {
    const set = `edition${colon}${filters.setCode}`;
    queries.push(set);
  }

  if (filters.color) {
    const color = `color${colon}${filters.color}`;
    queries.push(color);
  }

  if (filters.type) {
    const type = `type${colon}${filters.type}`;
    queries.push(type);
  }

  cardStore.update(store => ({ ...store, data: [], isLoading: true }));

  try {
    const resp = await fetch(
      `${ORIGIN}/cards/search?${sorting}&q=${queries.join(" ")}`
    );
    const cards = await resp.json();

    cardStore.update(store => ({
      ...store,
      isLoading: false,
      data: cards.data || []
    }));
  } catch (err) {
    console.log(err);
    cardStore.update(store => ({
      ...store,
      isLoading: false
    }));
  }
}

export const deckStore = writable({
  total: 0,
  data: new Map()
});

export function addCard(card) {
  deckStore.update(store => {
    let newCard = { count: 1, data: card };
    const stack = store.data.get(card.id);

    if (stack) {
      if (!card.type_line.includes("Basic Land") && stack.count >= MAX_DUPLICATE_CARDS) {
        return { ...store };
      }

      newCard.count = store.data.get(card.id).count + 1;
    }

    store.data.set(card.id, newCard);

    return {
      ...store,
      total: store.total + 1
    };
  });
}

export function removeCard(cardId) {
  deckStore.update(store => {
    const stack = store.data.get(cardId);

    if (stack.count === 1) {
      store.data.delete(cardId);
    }

    stack.count -= 1;

    return {
      ...store,
      total: store.total - 1
    };
  });
}
