<script>
  import { fly } from "svelte/transition";
  import { getSets, addCard, removeCard, cardStore, deckStore } from "./store";

  import Filters from "./Filters.svelte";

  let cards = [];
  let deck = [];
  let deckSize = 0;
  let isLoading = false;

  getSets();

  cardStore.subscribe(store => {
    isLoading = store.isLoading;
    cards = store.data;
  });

  deckStore.subscribe(store => {
    let newDeck = [];
    store.data.forEach((value, key) => {
      newDeck.push(value);
    });
    deck = newDeck;
    deckSize = store.total;
  });
</script>

<style>
  #app {
    padding: 50px 20px;
  }

  #cards .card img {
    cursor: pointer;
  }

  .card {
    border: 1px solid #000;
    height: 204px;
    width: 146px;
    transition: transform 0.6s cubic-bezier(0.075, 0.82, 0.165, 1);
  }

  .card:hover {
    transform: scale(1.1);
  }

  #deck li {
    cursor: pointer;
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
</style>

<section id="app" class="uk-container uk-container-expand uk-height-viewport">
  <header>
    <h1>Deck Builder</h1>
  </header>

  <hr />

  <section id="main" class="uk-height-1-1">
    <div class="uk-grid-divider uk-flex" uk-grid>
      <div id="filters" class="uk-width-1-4">
        <Filters />
      </div>
      <div id="cards" class="uk-width-expand">
        {#if isLoading}
          <div uk-spinner class="uk-position-center" />
        {/if}
        <div class="uk-grid uk-grid-small" uk-grid="masonry: true">
          {#if !cards.length && !isLoading}
            <div uk-alert class="uk-alert-warning">No Cards Found</div>
          {/if}
          {#each cards as card}
            <div>
              <div class="card" on:click={() => addCard(card)}>
                <img
                  alt={card.name}
                  src={card.image_uris ? card.image_uris.small : ''} />
              </div>
            </div>
          {/each}
        </div>
      </div>
      <div id="deck" class="uk-width-1-4">
        <div class="uk-container">
          <p>{deckSize}/60 Cards</p>
          <ul class="uk-list uk-list-divider">
            {#each deck as card (card.data.id)}
              <li
                class="uk-text-truncate"
                on:click={() => removeCard(card.data.id)}
                in:fly={{ x: 200, duration: 150 }}
                out:fly={{ x: 200, duration: 150 }}>
                {card.count}
                x
                {card.data.colors}
                {card.data.name}
              </li>
            {/each}
          </ul>
        </div>
      </div>
    </div>
  </section>
</section>
