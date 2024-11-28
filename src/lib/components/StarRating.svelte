<script lang="ts">
  interface Props {
    rating: number;
    isReadOnly?: boolean;
    updateDBRating?: (rating: number) => void;
  }

  let { rating, isReadOnly, updateDBRating }: Props = $props();

  function handleRating(newRating: number) {
    rating = newRating;

    if (updateDBRating) {
      updateDBRating(newRating);
    }
  }
</script>

<div
  class="rating"
  role={isReadOnly ? "img" : "group"}
  aria-label={isReadOnly ? `Rated ${rating} out of 5 stars` : "Rate this book"}
  aria-readonly={isReadOnly}
>
  <div class="rating-container">
    {#each Array(5) as _, i (i)}
      <button
        class="star"
        type="button"
        aria-label={isReadOnly
          ? `Rated ${i + 1} stars`
          : `Rate ${i + 1} out of 5 stars`}
        aria-pressed={!isReadOnly && rating > i}
        onclick={() => handleRating(i + 1)}
        disabled={isReadOnly}
      >
        <span
          style="--fill: {rating > i ? 'gold' : 'rgba(100, 100, 100, 0.15)'}"
          class="star-icon"
        >
          ★
        </span>
      </button>
    {/each}
  </div>
</div>

<style>
  .rating-container {
    display: inline-flex;
    outline: none;
  }

  .star {
    background: none;
    border: none;
    outline: none;
    cursor: pointer;
    padding: 0;
    font-size: 32px;
    color: transparent;
  }

  .star span {
    display: inline-block;
    color: var(--fill);
  }
</style>
