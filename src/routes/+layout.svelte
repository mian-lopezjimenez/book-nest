<script lang="ts">
  import type { Snippet } from "svelte";

  import { Header } from "$components";

  import "../app.css";

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();
</script>

<Header />
{@render children()}
