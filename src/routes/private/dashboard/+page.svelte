<script lang="ts">
  import Icon from "@iconify/svelte";

  import { getUserState } from "$state/user-state.svelte";
  import { BookCategory } from "$components";

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

  {#if books.length}
    {#if userState.getHighestRatedBooks().length}
      <BookCategory
        categoryName="Your favorite books"
        books={userState.getHighestRatedBooks()}
      />
    {/if}

    <BookCategory
      categoryName="Recent added, unread books"
      books={userState.getUnreadBooks()}
    />

    {#if userState.getFavoriteGenre()}
      <BookCategory
        categoryName={`Your highest rated books from your favorite genre: ${userState.getFavoriteGenre()}`}
        books={userState.getBooksFromFavoriteGenre()}
      />
    {/if}

    {#if userState.getCurrentlyReadingBooks().length}
      <BookCategory
        categoryName="Currently reading"
        books={userState.getCurrentlyReadingBooks()}
      />
    {/if}
  {:else}
    <a class="upload-hint mt-l" href="/private/scan-shelf">
      <h3>You have no books in your library. Click here to add some!</h3>
      <div class="mt-m">
        <Icon icon="icons8:plus" width="72" height="72" />
        <p>Add books</p>
      </div>
    </a>
  {/if}
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

  .upload-hint {
    display: flex;
    text-decoration: none;
    width: 100%;
    flex-direction: column;
    align-items: center;
  }

  .upload-hint div {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
