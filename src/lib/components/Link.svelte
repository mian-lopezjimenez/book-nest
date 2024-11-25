<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAnchorAttributes } from "svelte/elements";

  interface Props extends HTMLAnchorAttributes {
    children: Snippet;
    variant?: ButtonVariant | `${ButtonVariant} ${ButtonVariant}`;
  }

  let { children, variant = "primary", ...rest }: Props = $props();
</script>

<a class={`btn ${variant}`} {...rest}>
  {@render children()}
</a>

<style>
  .btn {
    background-color: black;
    border-radius: 12px;
    border: 1px solid white;
    color: white;
    cursor: pointer;
    display: block;
    font-size: 22px;
    font-weight: normal;
    min-width: 230px;
    padding: 12px 24px;
    text-align: center;
    text-decoration: none;
  }

  .secondary {
    background-color: white;
    color: black;
    border: 1px solid black;
  }

  .danger {
    background-color: rgb(136, 4, 4);
  }

  .menu {
    min-width: 150px;
    padding: 8px 20px;
  }
</style>
