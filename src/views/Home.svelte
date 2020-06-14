<script>
  export let isLoggedIn;
  import SearchBar from '../components/SearchBar.svelte';
</script>

<main>
  <div id="home-container">
    {#if !isLoggedIn}
      <div id="presentation-container">
        <h1 id="site-title">Movie Reviews</h1>
        <h2 id="site-slogan">Don’t waste your time with lame movies, check our site first!</h2>
        <div id="icons-container">
          <p id="home-icons" class="material-icons">movie_filter</p>
          <p id="home-icons" class="material-icons">group</p>
          <p id="home-icons" class="material-icons">star</p>
        </div>
      </div>
    {/if}
    <SearchBar {isLoggedIn} />
  </div>
</main>

<style>
#home-container {
  height: 100%;
  width: 100%;
  padding: 2em;
}
#presentation-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
#site-title {
  margin: 0;
  font-weight: 400;
  padding-top: 1em;
  font-size: 3em;
}
#site-slogan {
  margin: 0;
  padding-top: 1em;
  font-weight: 300;
}
#icons-container {
  padding: 2em 0;
  display: flex;
  justify-content: space-between;
  width: 10em;
}
#home-icons {
  margin: 0;
  color: #b08adc;
  font-size: 40px;
}
</style>