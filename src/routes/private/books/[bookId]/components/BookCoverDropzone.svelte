<script lang="ts">
  import Dropzone from "svelte-file-dropzone";
  import Icon from "@iconify/svelte";

  import { getUserState } from "$state/user-state.svelte";
  import { invalidate } from "$app/navigation";

  interface Props {
    bookId: number;
    coverImage: string | null;
  }

  let { bookId, coverImage }: Props = $props();
  let isUploading = $state(false);
  const MAX_IMAGE_SIZE: number = 5 * 1024 * 1024;
  const userState = getUserState();

  async function handleDrop(event: CustomEvent<any>) {
    const { acceptedFiles } = event.detail;

    if (acceptedFiles.length) {
      isUploading = true;
      const file: File = acceptedFiles[0];
      const bookCover = await userState.uploadBookCover({
        bookId: bookId,
        file,
      });

      if (bookCover) {
        invalidate(`book:${bookId}`);
      }

      isUploading = false;
    }
  }
</script>

<div class="book-cover">
  {#if coverImage}
    <img src={coverImage} alt="" />
  {:else}
    <Dropzone
      on:drop={handleDrop}
      multiple={false}
      accept="image/*"
      maxSize={MAX_IMAGE_SIZE}
      containerClasses="dropzone-cover"
    >
      {#if isUploading}
        <span class="loader"></span>
      {:else}
        <button class="add-cover">
          <Icon icon="bi:camera-fill" width="40" />
          <p>Add book cover</p>
        </button>
      {/if}
    </Dropzone>
  {/if}
</div>

<style>
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

  .loader {
    width: 48px;
    height: 48px;
    border: 5px solid #000;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  :global(.dropzone-cover) {
    border-radius: 15px !important;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    border: 1px solid black;
    cursor: pointer;
    border-style: solid !important;
    color: black;
    border-color: black !important;
  }
</style>
