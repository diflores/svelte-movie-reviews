<script>
  import { register } from "../store.js";
  import Textfield from '@smui/textfield';
  import Icon from '@smui/textfield/icon/index';
  import Button, { Label } from "@smui/button";
  import { navigate } from "svelte-routing";

  let firstName = "";
  let lastName = "";
  let email = "";
  let password = "";
  let passwordConfirmation = "";
  let isAdmin = null;
  let isLoading = false;
  let showPassword = false;
  let showPasswordConfirmation = false;
  let invalidPasswordConfirmation = false;

  function handleSubmit() {
    invalidPasswordConfirmation = false;
    if (password !== passwordConfirmation) {
      invalidPasswordConfirmation = true;
      return null;
    }
    isLoading = true;
    let data = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      is_admin: isAdmin,
    };
    register(data)
      .then(() => navigate("/login"))
      .catch(err => console.log(err))
      .finally(() => { isLoading = false; });
  }
</script>

<div id="register-container">
  <section id="register-section">
    <h1 id="register-title">Welcome to Movie Reviews!</h1>
    <p id="register-description">
      Check out the latest reviews from our community and don't waste your time with lame movies
    </p>
    <div id="register-form">
      <Textfield
        class="shaped-outlined"
        variant="outlined"
        bind:value={firstName}
        label="First Name"
        type="text"
        style="margin-bottom: 2em"
      />
      <Textfield
        class="shaped-outlined"
        variant="outlined"
        bind:value={lastName}
        label="Last Name"
        type="text"
        style="margin-bottom: 2em"
      />
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
      <Textfield
        class="shaped-outlined"
        variant="outlined"
        withTrailingIcon
        bind:value={passwordConfirmation}
        label="Confirm Password"
        type={showPasswordConfirmation ? 'text' : 'password'}
        bind:invalid={invalidPasswordConfirmation}
        style="margin-bottom: 2em"
      >
        <Icon
          role="button"
          class="material-icons"
          on:click={() => { showPasswordConfirmation = !showPasswordConfirmation; }} 
        >{showPasswordConfirmation ? 'visibility' : 'visibility_off'}</Icon>
      </Textfield>
      <Button
        variant="unelevated"
        type="submit"
        style="margin-top: 1em; width: 106px"
        on:click={handleSubmit}
      >
        <Label>{isLoading ? '...' : 'Register'}</Label>
      </Button>
    </div>
  </section>
</div>

<style>
:root {
  --primary-color: #9c6cd3;
  --secondary-color: #b08adc;
  --grey: #4a4a4a;
}
#register-container {
  padding-top: 2em;
  display: flex;
  justify-content: center;
  position: relative;
  height: 100%;
  width: 100%;
  color: var(--grey);
}
#register-section {
  width: 25em;
}
#register-title {
  text-align: center;
  font-size: 2em;
  padding-top: 1em;
  font-weight: 300;
  margin: 0;
}
#register-description {
  text-align: center;
  font-size: 1em;
  padding: 1em;
  margin: 0;
}
#register-form {
  margin: 0 auto;
  padding: 2em 1em;
  display: flex;
  flex-direction: column;
}
</style>