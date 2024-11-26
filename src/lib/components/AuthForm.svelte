<script lang="ts">
  import { Button } from "$components";
  import type { ActionData } from "../../routes/register/$types";

  interface Props {
    isRegistration?: boolean;
    form: ActionData;
  }

  let { isRegistration = true, form }: Props = $props();
  let {
    password = "",
    name = "",
    email = "",
    passwordConfirmation = "",
  } = form ?? {};

  const text: string = isRegistration ? "Register" : "Login";
</script>

<div class="default-margin auth-container">
  <h1 class="mb-l">{text}</h1>

  <div class="form-and-social-login">
    <form class="auth-form" method="POST">
      {#if form && form.errors.length > 0}
        {#each form.errors as error}
          <div class="auth-error">
            <p>{error}</p>
          </div>
        {/each}
      {/if}

      {#if isRegistration}
        <input placeholder="Name" type="text" name="name" value={name} />
      {/if}

      <input placeholder="Email" type="email" name="email" value={email} />
      <input
        placeholder="Password"
        type="password"
        name="password"
        value={password}
      />

      {#if isRegistration}
        <input
          placeholder="Confirm password"
          type="password"
          name="passwordConfirmation"
          value={passwordConfirmation}
        />
      {/if}

      <Button type="submit">{text}</Button>

      <p class="auth-hint mt-s">
        {#if isRegistration}
          Already hace an account? <a href="/login">Log In.</a>
        {:else}
          Don't have an account? <a href="/register">Register.</a>
        {/if}
      </p>
    </form>

    <div class="social-login">
      <!-- TODO: Add social login -->
    </div>
  </div>
</div>

<style>
  .auth-container {
    margin-top: 80px;
  }

  .form-and-social-login {
    display: flex;
  }

  .auth-form {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    border-right: 1px solid grey;
    padding-right: 80px;
    width: 40%;
  }

  .auth-form input {
    width: 100%;
    margin-bottom: 12px;
  }

  .auth-form input:last-of-type {
    margin-bottom: 30px;
  }

  .auth-hint {
    font-size: 16px;
    color: grey;
  }

  .auth-error {
    background-color: rgb(122, 35, 35);
    color: white;
    font-size: 18px;
    border-radius: 12px;
    padding: 12px;
    width: 100%;
    margin-bottom: 8px;
  }

  .auth-error:last-of-type {
    margin-bottom: 16px;
  }

  .social-login {
    padding-left: 80px;
    width: 40%;
  }
</style>
