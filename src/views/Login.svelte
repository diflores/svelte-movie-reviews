<script>
  import { login } from "../store.js";
  import axios from "axios";
  import qs from "qs";
  import { navigate } from "svelte-routing";
  let password = "";
  let email = "";
  let isLoading;
  function handleSubmit() {
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

<div>
  <h1>Sign In</h1>
  <form on:submit|preventDefault={handleSubmit}>
    <label>
      Email:
      <input type="email" bind:value={email} />
    </label>
    <label>
      Password:
      <input type="password" bind:value={password} />
    </label>
    <button type="submit">Submit</button>
  </form>
</div>
