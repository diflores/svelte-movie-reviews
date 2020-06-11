<script>
  export let name;
  export let url = '';
	import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
  import IconButton from '@smui/icon-button';
  import { Router, Link, Route } from 'svelte-routing';
  import Home from './views/Home.svelte';
  import Login from './views/Login.svelte';
  import Register from './views/Register.svelte';
  import Movie from './views/Movie.svelte';
  import Profile from './views/Profile.svelte';
</script>

<main>
	<div class="flexy">
    <div class="top-app-bar-container">
      <TopAppBar variant="static">
        <Row>
          <Section>
            <IconButton class="material-icons">movie</IconButton>
            <Title>Movie Reviews</Title>
          </Section>
          <Section align="end" toolbar>
            <IconButton class="material-icons" aria-label="Download">person</IconButton>
            <IconButton class="material-icons" aria-label="Print this page">exit_to_app</IconButton>
          </Section>
        </Row>
      </TopAppBar>
    </div>
</main>

<Router url="{url}">
  <nav>
    <Link to="/">Home</Link>
    <Link to="/login">Login</Link>
    <Link to="/register">Register</Link>
  </nav>
  <div>
    <Route path="/" component="{Home}" />
    <Route path="/login" component="{Login}" />
    <Route path="/register" component="{Register}" />
    <Route path="movie/:id" component="{Movie}" />
    <Route path="profile/:id" component="{Profile}" />
  </div>
</Router>

<style>
</style>