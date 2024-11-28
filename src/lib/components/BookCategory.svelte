<script lang="ts">
  import { BookCard } from "$components";

  interface Props {
    categoryName: string;
    books: Book[];
  }

  let { categoryName, books }: Props = $props();
</script>

<section class="book-category mb-m">
  <h3 class="mb-s">{categoryName}</h3>

  <div class="books-container">
    {#each books as book (book.id)}
      <BookCard {book} />
    {/each}
  </div>
</section>

<style>
  .books-container {
    display: flex;
    overflow-x: auto;
    gap: 16px;
    padding-bottom: 8px;
    scrollbar-width: thin;
  }

  .books-container::-webkit-scrollbar {
    height: 6px;
  }

  .books-container::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }

  .books-container::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.1);
  }
</style>
