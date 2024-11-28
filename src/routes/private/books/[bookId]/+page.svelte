<script lang="ts">
  import Icon from "@iconify/svelte";

  import { Button, StarRating } from "$components";

  interface Props {
    data: { book: Book };
  }

  let { data }: Props = $props();
  let book = $derived(data.book);
  let isEditMode = $state(false);
  let bookData = $state({
    title: book.title,
    author: book.author,
    description: book.description ?? "",
    genre: book.genre ?? "",
  });

  function toggleEditMode() {
    isEditMode = !isEditMode;
  }

  function goBack() {
    history.back();
  }
</script>

{#snippet bookInfo()}
  <h2 class="book-title mt-m">{book.title}</h2>
  <p class="book-author">by {book.author}</p>
  <h4 class="mt-m mb-xs semi-bold">Your rating</h4>
  <StarRating rating={book.rating ?? 0} />
  <p class="small-font">Click to {book.rating ? "change" : "give"} rating</p>

  {#if book.description}
    <h4 class="mt-m mb-xs semi-bold">Description</h4>
    <p class="mb-m">{book.description}</p>
  {:else}
    <h4 class="mt-m mb-xs semi-bold">No description yet</h4>
    <button class="block mb-m" onclick={() => {}}>
      <p>Click to add one.</p>
    </button>
  {/if}

  {#if !book.finished_reading_on}
    <Button variant="secondary" onclick={() => {}}>
      {book.started_reading_on
        ? "I finished reading this book"
        : "I started reading this book"}
    </Button>
  {/if}

  {#if book.genre}
    <h4 class="mt-m mb-xs semi-bold">Genre</h4>
    <p>{book.genre}</p>
  {/if}
{/snippet}

{#snippet editFields()}
  <form action="">
    <input
      class="input input-title mt-m mb-xs"
      type="text"
      bind:value={bookData.title}
      name="title"
    />
    <div class="input-author">
      <p>by</p>
      <input
        class="input"
        type="text"
        bind:value={bookData.author}
        name="author"
      />
    </div>

    <h4 class="mt-m mb-xs semi-bold">Your rating</h4>
    <StarRating rating={book.rating ?? 0} />
    <p class="small-font">Click to {book.rating ? "change" : "give"} rating</p>

    <h4 class="mt-m mb-xs semi-bold">Description</h4>
    <textarea
      class="textarea mb-m"
      bind:value={bookData.description}
      name="description"
      placeholder="Give a description of the book..."
    ></textarea>

    {#if !book.finished_reading_on}
      <Button variant="secondary" onclick={() => {}}>
        {book.started_reading_on
          ? "I finished reading this book"
          : "I started reading this book"}
      </Button>
    {/if}

    {#if book.genre}
      <h4 class="mt-m mb-xs semi-bold">Genre</h4>
      <input
        class="input"
        type="text"
        bind:value={bookData.genre}
        name="genre"
      />
    {/if}
  </form>
{/snippet}

<div class="book-page">
  <button onclick={goBack} aria-label="Go back">
    <Icon icon="ep:back" width="40" />
  </button>

  <div class="book-container">
    <div class="book-info">
      {#if isEditMode}
        {@render editFields()}
      {:else}
        {@render bookInfo()}
      {/if}

      <div class="buttons-container mt-m">
        <Button variant="secondary" onclick={toggleEditMode}
          >{isEditMode ? "Save changes" : "Edit"}</Button
        >
        <Button variant="danger" onclick={() => {}}>Delete</Button>
      </div>
    </div>

    <div class="book-cover">
      {#if book.cover_image}
        <img src={book.cover_image} alt="" />
      {:else}
        <button class="add-cover">
          <Icon icon="bi:camera-fill" width="40" />
          <p>Add book cover</p>
        </button>
      {/if}
    </div>
  </div>
</div>

<style>
  .book-container {
    display: flex;
    justify-content: flex-start;
  }

  .book-info {
    width: 50%;
  }

  .book-cover {
    align-items: center;
    border-radius: 15px;
    border: 1px solid black;
    display: flex;
    justify-content: center;
    margin-left: 80px;
    max-width: 450px;
    min-height: 400px;
    width: 40%;
  }

  .book-cover img {
    object-fit: cover;
    width: 100%;
    height: 100%;
    border-radius: inherit;
  }

  .add-cover {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .input {
    padding: 8px 4px;
    width: 100%;
  }

  .textarea {
    width: 100%;
  }

  .input-title {
    font-size: 60px;
    font-weight: bold;
    font-family: "EB Garamond", serif;
  }

  .input-author {
    display: flex;
    align-items: center;
  }

  .input-author p {
    margin-right: 8px;
  }
</style>
