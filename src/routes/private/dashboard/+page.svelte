<script lang="ts">
  import Icon from "@iconify/svelte";

  import { getUserState } from "$state/user-state.svelte";
  import { BookCard } from "$components";

  const userState = getUserState();
  let { books, userName } = $derived(userState);
</script>

<div class="dashboard">
  <div class="dashboard-header mb-m">
    <a href="/private/scan-shelf" class="add-book">
      <Icon icon="icons8:plus" width="72" height="72" />
      <p>Add a book</p>
    </a>

    <div class="headline">
      <h3 class="bold mb-xs">Welcome back, {userName}</h3>
      <p>
        There's nothing quite like the journey a good book can take you on. Have
        you discovered any new favorites recently?
      </p>
    </div>
  </div>

  {#each books as book (book.id)}
    <BookCard {book} />
  {/each}
</div>

<style>
  .dashboard-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
  }

  .add-book {
    align-items: center;
    display: flex;
    gap: 8px;
    text-decoration: none;
  }

  .add-book p {
    margin: 0;
  }

  .headline {
    text-align: right;
    max-width: 30%;
    min-width: 300px;
  }
</style>
