<script lang="ts">
  import bookNestLogo from "$assets/app-logo.svg";
  import { Link } from "$components";
</script>

<header>
  <a href="/">
    <img src={bookNestLogo} class="logo" alt="Go to home" />
  </a>

  <nav>
    <ul>
      <li>
        <Link href="/register" variant="menu">Create account</Link>
      </li>
      <li>
        <Link href="/login" variant="secondary menu">Login</Link>
      </li>
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
    display: flex;
    column-gap: 24px;
  }

  .logo {
    height: 72px;
  }
</style>
