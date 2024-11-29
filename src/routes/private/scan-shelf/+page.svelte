<script lang="ts">
  import Dropzone from "svelte-file-dropzone";
  import Icon from "@iconify/svelte";

  import { Button, Link } from "$components";
  import { convertFileToBase64 } from "$utils/openai-helpers";
  import { getUserState } from "$state/user-state.svelte";

  const IMAGE_MAX_SIZE = 10 * 1024 * 1024;
  let userState = getUserState();
  let isLoading: boolean = $state(false);
  let booksAdded: boolean = $state(false);
  let errorMessage: string = $state("");
  let recognizedBooks: OpenAIBook[] = $state([]);

  async function onDrop(event: CustomEvent<any>) {
    const { acceptedFiles } = event.detail;

    if (acceptedFiles.length) {
      isLoading = true;
      const fileToSendToOpenAI = acceptedFiles[0];

      try {
        const base64: string =
          (await convertFileToBase64(fileToSendToOpenAI)) ?? "";

        const response = await fetch("/api/scan-shelf", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ base64 }),
        });

        isLoading = false;
        const { books } = (await response.json()) as { books: OpenAIBook[] };
        recognizedBooks = books;
      } catch (error) {
        errorMessage = "Error processing the uploaded file";
      }
      return;
    }

    errorMessage =
      "Could not upload given file. Are you sure it's an image with a file size less than 10MB?";
  }

  function removeBook(index: number) {
    recognizedBooks.splice(index, 1);
  }

  async function addBooks() {
    isLoading = true;

    try {
      await userState.addBookToLibrary(recognizedBooks);
      isLoading = false;
      booksAdded = true;
    } catch (error: any) {
      errorMessage = error.message;
    }
  }
</script>

<h2 class="mt-m mb-l">Take a picture to add books</h2>
{#if recognizedBooks.length === 0}
  <div class="upload-area">
    <div class="upload-container">
      {#if errorMessage}
        <h4 class="text-center mb-s upload-error">
          {errorMessage}
        </h4>
      {/if}

      {#if isLoading}
        <div class="spinner-container">
          <span class="loader"></span>
          <p>Processing your books.</p>
        </div>
      {:else}
        <Dropzone
          on:drop={onDrop}
          accept="image/*"
          maxSize={IMAGE_MAX_SIZE}
          containerClasses="dropzone-cover dropzone-books"
        >
          <Icon icon="bi:camera-fill" width="40" />
          <p>Drag a picture here or click to select a file</p>
        </Dropzone>
      {/if}
    </div>
  </div>
{:else if !booksAdded}
  <div class="found-books">
    <table class="book-list mb-m">
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {#each recognizedBooks as { bookTitle, author }, i (`book-${i}`)}
          <tr>
            <td>{bookTitle}</td>
            <td>{author}</td>
            <td>
              <button
                class="remove-book"
                type="button"
                aria-label="Remove book"
                onclick={() => removeBook(i)}
              >
                <Icon icon="streamline:delete-1-solid" width="30" />
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>

    <Button onclick={addBooks}>Add all books</Button>
  </div>
{:else}
  <h4>
    The selected {recognizedBooks.length} books have been added to your library.
  </h4>
  <Link href="/private/dashboard">Go to your library</Link>
{/if}

<style>
  .book-list {
    width: 800px;
    background-color: white;
    border-radius: 8px;
    border-collapse: collapse;
  }

  .book-list th {
    font-size: 22px;
    text-align: left;
    padding: 8px 16px;
    border-bottom: 3px solid black;
  }

  .book-list td {
    padding: 12px 16px;
    border-bottom: 1px solid rgb(205, 205, 205);
    font-size: 20px;
  }

  .book-list tr:last-child td {
    border-bottom: none;
  }

  :global(.remove-book svg) {
    color: red;
  }

  .upload-error {
    color: rgb(131, 0, 0);
  }

  .upload-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .upload-container {
    width: 600px;
  }

  .spinner-container {
    display: flex;
    align-items: center;
    column-gap: 8px;
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

  :global(.dropzone-books) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 600px;
    min-height: 400px;
    flex: 0;
    cursor: pointer;
  }
</style>
