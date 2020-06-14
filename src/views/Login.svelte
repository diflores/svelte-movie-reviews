<script>
  import { userIdStored, tokenStored } from "../auth.js";
  import axios from "axios";
  import qs from "qs";
  import { navigate } from "svelte-routing";
  let password = "";
  let email = "";
  function handleSubmit() {
    const user = {
      username: email,
      password
    };
    axios({
      url: `${process.env.SVELTE_APP_API_BASE_URL}/users/login/jwt`,
      data: qs.stringify(user),
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      method: "POST"
    }).then(resp => {
      const token = resp.data.token;
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      // get current user to save it in state
      axios({
        url: `${process.env.SVELTE_APP_API_BASE_URL}/users/me`,
        method: "GET"
      })
        .then(response => {
          const userId = response.data.id;
          localStorage.setItem("token", token);
          localStorage.setItem("userId", userId);
          userIdStored.set(userId);
          tokenStored.set(token);
          navigate("/");
        })
        .catch(error => {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
        });
    });
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
