<script lang="ts">
  import { Button, Link } from "$components";
  import { getUserState } from "$state/user-state.svelte";

  import bookNestLogo from "$assets/app-logo.svg";

  let userState = getUserState();
  let { user, userName } = $derived(userState);
</script>

<header>
  <a href={user ? "/private/dashboard" : "/"}>
    <img src={bookNestLogo} class="logo" alt="Go to home" />
  </a>

  <nav>
    <ul>
      {#if !user}
        <li>
          <Link href="/register" variant="menu">Create account</Link>
        </li>
        <li>
          <Link href="/login" variant="secondary menu">Login</Link>
        </li>
      {/if}

      {#if user}
        <li>
          {userName}
        </li>
        <li>
          <Button onclick={() => userState.logout()} variant="menu"
            >Logout</Button
          >
        </li>
      {/if}
    </ul>
  </nav>
</header>

<style>
  header {
    align-items: center;
    display: flex;
    justify-content: space-between;
    padding: 12px 4vw;
  }

  ul {
    align-items: center;
    column-gap: 24px;
    display: flex;
  }

  .logo {
    height: 72px;
  }
</style>
