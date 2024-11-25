<script lang="ts">
  import { Link } from "$components";

  import heroImage from "$assets/hero.png";
</script>

<section class="hero default-margin">
  <div class="hero-text">
    <h1>Book Nest</h1>
    <h3>Your personal book library.</h3>
    <h4 class="mt-l">
      Create your very own digital library where you can keep track of every
      book you own, read and love.
    </h4>
    <h4 class="mb-s">
      Our app offers a beautiful designed, easy-to-use interface that makes
      managin your book collection a joy.
    </h4>

    <Link href="/register">Sign up</Link>
  </div>

  <img src={heroImage} class="hero-image" alt="Book Nest" />
</section>

<style>
  .hero {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 80px;
    margin-top: 100px;
  }

  .hero-image {
    width: 40%;
  }

  .hero-text {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    padding-right: 50px;
    width: 55%;
  }
</style>
