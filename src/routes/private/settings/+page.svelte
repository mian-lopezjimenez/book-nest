<script lang="ts">
  import { Button } from "$components";
  import { getUserState } from "$state/user-state.svelte";

  let userState = getUserState();
  let userName: string = $state(userState.userName ?? "");
  let email: string = $state(userState.user?.email ?? "");
  let isEditMode: boolean = $state(false);
  let averageRating: string | number = $derived.by(() => {
    const booksWithRating = userState.books.filter((book) => book.rating);

    if (booksWithRating.length === 0) {
      return "No ratings yet.";
    }

    const sumOfRatings: number = booksWithRating.reduce(
      (acc, book) => (acc += book.rating ?? 0),
      0
    );
    const averageRating: string = (
      sumOfRatings / booksWithRating.length
    ).toFixed(2);

    return averageRating;
  });

  $effect(() => {
    if (userState.userName) {
      userName = userState.userName;
    }
  });

  function getFinishedBooks() {
    return userState.books.filter((book) => Boolean(book.finished_reading_on));
  }

  async function saveChanges() {
    if (isEditMode) {
      await userState.updateAccountData({ userName, email });
    }

    isEditMode = !isEditMode;
  }

  async function deleteAccount() {
    const confirmDelete = confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (confirmDelete) {
      await userState.deleteAccount();
    }
  }
</script>

<div class="settings-page">
  <div class="settings-container">
    <h2>Settings</h2>

    <h5 class="mt-m mb-xs semi-bold">Username</h5>

    {#if isEditMode}
      <input type="text" name="userName" bind:value={userName} />
    {:else}
      <h3>{userName}</h3>
    {/if}

    <h5 class="mt-m mb-xs semi-bold">Email Address</h5>
    {#if isEditMode}
      <input type="text" name="email" bind:value={email} />
    {:else}
      <h3>{email}</h3>
    {/if}

    <div class="buttons-container mt-l">
      <Button onclick={saveChanges} variant="secondary">
        {isEditMode ? "Save changes" : "Edit"}
      </Button>

      <Button onclick={deleteAccount} variant="danger">Delete account</Button>
    </div>
  </div>

  <div class="stats-container">
    <h5 class="semi-bold">Books in library</h5>
    <h3>{userState.books.length}</h3>

    <h5 class="semi-bold mt-m">Finished books</h5>
    <h3>{getFinishedBooks().length}</h3>

    <h5 class="semi-bold mt-m">Avergage rating</h5>
    <h3>{averageRating}</h3>
  </div>
</div>

<style>
  .settings-page {
    display: flex;
    width: 100%;
    justify-content: flex-start;
    align-items: center;
  }

  .settings-container {
    margin-right: 80px;
  }

  .settings-container input {
    width: 100%;
  }

  .stats-container {
    min-width: 25%;
    border-radius: 12px;
    padding: 8px 24px;
    background-color: rgba(255, 255, 255, 0.5);
    margin-bottom: 40px;
  }
</style>
