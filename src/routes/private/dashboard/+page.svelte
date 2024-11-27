<script lang="ts">
  import { getUserState } from "$state/user-state.svelte";

  const userState = getUserState();
  let { books } = $derived(userState);
</script>

<ul>
  {#each books as { title, id } (id)}
    <li>{title}</li>
  {/each}
</ul>
