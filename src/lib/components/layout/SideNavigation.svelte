<script lang="ts">
  import Icon from "@iconify/svelte";
</script>

<nav class="side-navigation">
  <ul>
    <li>
      <a href="/private/dashboard">
        <Icon icon="ion:library-outline" width="40" />
      </a>
    </li>
    <li>
      <a href="/private/scan-shelf">
        <Icon icon="solar:eye-scan-linear" width="40" />
      </a>
    </li>
    <li>
      <a href="/private/settings">
        <Icon icon="ion:settings-outline" width="40" />
      </a>
    </li>
  </ul>
</nav>

<style>
  .side-navigation {
    display: flex;
    height: 100%;
    border-right: 1px solid grey;
    padding-left: calc(4vw + 16px);
    padding-right: 40px;
    flex: 0 0 auto;
    position: sticky;
    top: 0;
  }

  .side-navigation ul {
    align-items: center;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
  }

  ul li:not(:last-of-type) {
    margin-bottom: 16px;
  }
</style>
