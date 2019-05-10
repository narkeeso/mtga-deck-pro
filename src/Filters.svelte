<script>
  import debounce from "lodash.debounce";
  import { setStore, getCards } from "./store";

  const DEFAULT_SET_CODE = "war";
  const DEFAULT_SORT_BY = "cmc";
  const COLORS = [
    {
      name: "All",
      code: ""
    },
    {
      name: "Colorless",
      code: "c"
    },
    {
      name: "White",
      code: "w"
    },
    {
      name: "Blue",
      code: "u"
    },
    {
      name: "Black",
      code: "b"
    },
    {
      name: "Red",
      code: "r"
    },
    {
      name: "Green",
      code: "g"
    }
  ];
  const SORT_BY = [
    {
      name: "Mana Cost",
      code: "cmc"
    }
  ];

  let sets = [];

  let filters = {
    setCode: DEFAULT_SET_CODE,
    color: "",
    type: ""
  };

  let sorting = {
    by: "cmc",
    dir: "auto"
  };

  // Get new cards whenever filters change
  $: {
    getCards(filters, sorting);
  }

  const searchType = debounce(event => {
    filters.type = event.target.value;
  }, 500);

  setStore.subscribe(store => {
    sets = store.data;
  });
</script>

<section id="filters">
  <div class="uk-margin">
    <label>Set:</label>
    <select class="uk-select uk-width-1-1" bind:value={filters.setCode}>
      {#each sets as set (set.id)}
        <option
          selected={set.code === DEFAULT_SET_CODE ? 'selected' : ''}
          value={set.code}>
          {set.name}
        </option>
      {/each}
    </select>
  </div>
  <div class="uk-margin">
    <label>Colors:</label>
    <select class="uk-select uk-width-1-1" bind:value={filters.color}>
      {#each COLORS as color (color.code)}
        <option value={color.code}>{color.name}</option>
      {/each}
    </select>
  </div>
  <div class="uk-margin">
    <label for="type">Type:</label>
    <input
      class="uk-input uk-width-1-1"
      type="text"
      placeholder="Land"
      on:input={searchType} />
  </div>
  <div class="uk-margin">
    <label>Sort:</label>
    <select class="uk-select uk-width-1-1" bind:value={sorting.by}>
      {#each SORT_BY as sortField}
        <option value={sortField.code}>{sortField.name}</option>
      {/each}
    </select>
  </div>
</section>
