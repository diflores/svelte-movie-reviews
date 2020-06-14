<script>
  import { userIdStored, tokenStored } from "./auth.js";
  let isLoggedIn;
  let userId;
  const unsubscribeToken = tokenStored.subscribe(value => {
		isLoggedIn = !!value;
  });
  const unsubscribeUserId = userIdStored.subscribe(value => {
		userId = value;
  });
  export let url = "";
  import TopAppBar, { Row, Section, Title } from "@smui/top-app-bar";
  import IconButton from "@smui/icon-button";
  import Button, { Label } from "@smui/button";
  import { Router, Link, Route, navigate } from "svelte-routing";
  import Home from "./views/Home.svelte";
  import Login from "./views/Login.svelte";
  import Register from "./views/Register.svelte";
  import Movie from "./views/Movie.svelte";
  import Profile from "./views/Profile.svelte";

  const redirectHome = () => navigate("/");
  const redirectProfile = loggedUserId => navigate(`/user/${loggedUserId}`);
  const redirectRegister = () => navigate("/register");
  const redirectLogin = () => navigate("/login");
</script>

<style>

</style>

<main>
  <div class="flexy">
    <div class="top-app-bar-container">
      <TopAppBar variant="static">
        <Row>
          <Section>
            <IconButton class="material-icons" on:click={redirectHome}>
              movie
            </IconButton>
            <Title>Movie Reviews</Title>
          </Section>
          <Section align="end" toolbar>
            {#if isLoggedIn}
              <IconButton class="material-icons" aria-label="Download">
                person
              </IconButton>
              <IconButton class="material-icons" aria-label="Print this page">
                exit_to_app
              </IconButton>
            {:else}
              <Button variant="unelevated" on:click={redirectRegister}>
                <Label>Register</Label>
              </Button>
              <Button variant="unelevated" on:click={redirectLogin}>
                <Label>Login</Label>
              </Button>
            {/if}
          </Section>
        </Row>
      </TopAppBar>
    </div>
  </div>
</main>

<Router {url}>
  <div>
    <Route path="/">
      <Home {isLoggedIn} />
    </Route>
    <Route path="/login" component={Login} />
    <Route path="/register" component={Register} />
    <Route path="movie/:id" component={Movie} />
    <Route path="user/:id" component={Profile} />
  </div>
</Router>
