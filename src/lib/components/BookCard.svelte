<script lang="ts">
  interface Props {
    book: Book;
  }

  let { book }: Props = $props();
  let {
    id,
    title,
    finished_reading_on,
    started_reading_on,
    cover_image,
    author,
  } = book;
  let bookStatus = $derived.by(() => {
    if (finished_reading_on) {
      return "Finished";
    }

    if (started_reading_on) {
      return "Currently reading";
    }

    return "Not started";
  });
</script>

<a href={`/private/books/${id}`} class="book-card">
  <div class="book-status">
    <span>
      {bookStatus}
    </span>
  </div>

  <div class="book-cover">
    {#if cover_image}
      <img src={cover_image} alt={title} />
    {/if}
  </div>

  <div class="book-info">
    <h4>{title}</h4>
    <p class="mb-s">{author}</p>
    <p>Rating: {book.rating}</p>
  </div>
</a>

<style>
  .book-card {
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    color: white;
    display: flex;
    flex-direction: column;
    height: 300px;
    min-width: 360px;
    max-width: 450px;
    position: relative;
    text-align: left;
    text-decoration: none;
    width: 100%;
  }

  .book-cover {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
  }

  .book-cover img {
    border-radius: 12px;
    height: 100%;
    object-fit: cover;
    width: 100%;
  }

  .book-info {
    background-color: rgba(0, 0, 0, 0.4);
    height: 100%;
    width: 100%;
    padding: 60px 16px 0 16px;
  }

  .book-info h4 {
    font-family: "EB Garamond", serif;
  }

  .book-info p {
    font-size: 14px;
    font-style: italic;
    font-weight: 400;
  }

  .book-status {
    position: absolute;
    top: 16px;
    right: 0;
    padding: 4px 8px;
    width: auto;
    background-color: rgba(4, 59, 92, 0.7);
  }
</style>
