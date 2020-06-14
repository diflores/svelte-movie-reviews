<script>
  import { login } from "../store.js";
  import Textfield from '@smui/textfield';
  import Icon from '@smui/textfield/icon/index';
  import Button, { Label } from "@smui/button";
  import { navigate } from "svelte-routing";

  let password = "";
  let email = "";
  let isLoading = false;
  let showPassword = false;

  function handleSubmit() {
    isLoading = true;
    const user = {
      username: email,
      password,
    };
    login(user)
      .then(() => navigate("/"))
      .catch(err => console.log(err))
      .finally(() => { isLoading = false; });
  }
</script>

<div id="login-container">
  <section id="login-section">
    <h1 id="login-title">Welcome back!</h1>
    <p id="login-description">We missed your reviews</p>
    <div id="login-form">
      <Textfield
        class="shaped-outlined"
        variant="outlined"
        bind:value={email}
        label="Email"
        type="email"
        style="margin-bottom: 2em"
      />
      <Textfield
        class="shaped-outlined"
        variant="outlined"
        withTrailingIcon
        bind:value={password}
        label="Password"
        type={showPassword ? 'text' : 'password'}
        style="margin-bottom: 2em"
      >
          <Icon
            role="button"
            class="material-icons"
            on:click={() => { showPassword = !showPassword; }} 
          >{showPassword ? 'visibility' : 'visibility_off'}</Icon>
      </Textfield>
      <Button
        variant="unelevated"
        type="submit"
        style="margin-top: 1em; width: 80px"
        on:click={handleSubmit}
      >
        <Label>{isLoading ? '...' : 'Login'}</Label>
      </Button>
    </div>
  </section>
</div>

<style>
#login-container {
  padding-top: 2em;
  display: flex;
  justify-content: center;
  position: relative;
  height: 100%;
  width: 100%;
  color: var(--grey);
}
#login-section {
  width: 25em;
}
#login-title {
  text-align: center;
  font-size: 2em;
  padding-top: 1em;
  font-weight: 300;
  margin: 0;
}
#login-description {
  text-align: center;
  font-size: 1em;
  padding: 1em;
  margin: 0;
}
#login-form {
  margin: 0 auto;
  padding: 2em;
  display: flex;
  flex-direction: column;
}
</style>