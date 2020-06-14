<script>
  import { onMount } from "svelte";
  import { tokenStored } from "../store.js";
  import axios from "axios";
  import Textfield from "@smui/textfield";
  import Icon from '@smui/textfield/icon/index';
  import { ImageAspectContainer, Image } from "@smui/image-list";
  import Card, { Content, Media, MediaContent } from "@smui/card";
  import { parseResults } from "../utils";
  export let isLoggedIn;
  export let movie = "";
  export let genres = [];
  export let genresToSearch = [];
  export let results = [];
  export let best_movies_2019 = [];
  export let most_popular_movies = [];
  export let most_popular_kids_movies = [];

  let token;
  const unsubscribeToken = tokenStored.subscribe(value => {
    token = value;
  });
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const search = function() {
    const movieTitle = movie;
    genresToSearch = [];
    axios({
      url: `${process.env.SVELTE_APP_API_BASE_URL}/search-movie`,
      params: { movie_title: movieTitle },
      method: "GET"
    }).then(response => {
      results = parseResults(response);
    });
  };
  const searchGenres = function() {
    axios({
      url: `${process.env.SVELTE_APP_API_BASE_URL}/discover-movie`,
      params: {
        with_genres: genresToSearch.join(","),
        sort_by: "popularity.desc"
      },
      method: "GET"
    }).then(response => {
      results = parseResults(response);
    });
  };

  onMount(async () => {
    if (isLoggedIn) {
      axios({
        url: `${process.env.SVELTE_APP_API_BASE_URL}/discover-movie`,
        params: { sort_by: "popularity.desc" },
        method: "GET"
      }).then(response => {
        most_popular_movies = parseResults(response);
      });

      axios({
        url: `${process.env.SVELTE_APP_API_BASE_URL}/discover-movie`,
        params: {
          certification_country: "US",
          certification: "G",
          sort_by: "popularity.desc"
        },
        method: "GET"
      }).then(response => {
        most_popular_kids_movies = parseResults(response);
      });
      axios({
        url: `${process.env.SVELTE_APP_API_BASE_URL}/discover-movie`,
        params: {
          primary_release_year: 2019,
          sort_by: "vote_average.desc",
          vote_count_gte: 1000
        },
        method: "GET"
      }).then(response => {
        best_movies_2019 = parseResults(response);
      });
      axios({
        url: `${process.env.SVELTE_APP_API_BASE_URL}/genres`,
        method: "GET"
      }).then(response => {
        genres = response.data.genres.map(genre => ({
          text: genre.name,
          value: genre.id
        }));
      });
    }
  });
</script>

<div>
  {#if isLoggedIn}
    <section id="search-section">
      <div id="search-container">
        <div id="search-bar">
          <Textfield
            variant="outlined"
            withTrailingIcon
            bind:value={movie}
            input$placeholder="Search a movie"
            style="width: 100%"
          >
            <Icon
              role="button"
              class="material-icons"
              on:click={search}
            >
              search
            </Icon>
          </Textfield>
        </div>
        <div id="genres-bar">
          <Textfield
            withLeadingIcon
            bind:value={genresToSearch}
            input$placeholder="Search a genre"
            on:click={searchGenres}
            style="width: 100%"
          >
            <Icon
              role="button"
              class="material-icons"
              on:click={() => null}
            >
              search
            </Icon>
          </Textfield>
        </div>
      </div>
      {#if !results.length}
        <h1 id="results-title">Today's featured movies</h1>
        {#if most_popular_movies.length}
          <h1 id="discover-title">Most popular movies</h1>
        {/if}
        <div class="movies-container">
          {#each most_popular_movies as result, i (result.id)}
            <Card style="width: 320px;">
              <Media class="card-media-16x9" aspectRatio="16x9">
                <ImageAspectContainer>
                  <Image src={result.posterURL} alt={result.title} />
                </ImageAspectContainer>
                <h2 class="mdc-typography--headline6" style="margin: 0;">
                  {result.title}
                </h2>
              </Media>
              <Content style="color: #888;">{result.plot}</Content>
            </Card>
          {/each}
        </div>
        {#if most_popular_kids_movies.length}
          <h1 id="discover-title">Most popular kids movies</h1>
        {/if}
        <div class="movies-container">
          {#each most_popular_kids_movies as result, i (result.id)}
            <Card style="width: 320px;">
              <Media class="card-media-16x9" aspectRatio="16x9">
                <ImageAspectContainer>
                  <Image src={result.posterURL} alt={result.title} />
                </ImageAspectContainer>
                <h2 class="mdc-typography--headline6" style="margin: 0;">
                  {result.title}
                </h2>
              </Media>
              <Content style="color: #888;">{result.plot}</Content>
            </Card>
          {/each}
          </div>
          {#if best_movies_2019.length}
            <h1 id="discover-title">Best movies from 2019</h1>
          {/if}
          <div class="movies-container">
            {#each best_movies_2019 as result, i (result.id)}
              <Card style="width: 320px;">
                <Media class="card-media-16x9" aspectRatio="16x9">
                  <ImageAspectContainer>
                    <Image src={result.posterURL} alt={result.title} />
                  </ImageAspectContainer>
                  <h2 class="mdc-typography--headline6" style="margin: 0;">
                    {result.title}
                  </h2>
                </Media>
                <Content style="color: #888;">{result.plot}</Content>
              </Card>
            {/each}
          </div>
      {:else}
        <div class="movies-container">
          {#each results as result, i (result.id)}
            <Card style="width: 320px;">
              <Media class="card-media-16x9" aspectRatio="16x9">
                <ImageAspectContainer>
                  <Image src={result.posterURL} alt={result.title} />
                </ImageAspectContainer>
                <h2 class="mdc-typography--headline6" style="margin: 0;">
                  {result.title}
                </h2>
              </Media>
              <Content style="color: #888;">{result.plot}</Content>
            </Card>
          {/each}
        </div>
      {/if}
    </section>
  {/if}
</div>

<style>
#search-section {
  display: flex;
  flex-direction: column;
  width: 100%;
}
#search-container {
  display: flex;
  flex-direction: row;
  margin-bottom: 2em;
}
#search-bar {
  width: 22em;
  margin-right: 4em;
}
#genres-bar {
  width: 20em;
}
#discover-title {
  font-weight: 400;
  color: var(--secondary-color);
  padding-top: 2em;
  margin: 0;
}
#results-title {
  font-weight: 300;
  margin: 0;
}
.movies-container {
  margin: 2em 0 2em;
  display: grid;
  justify-items: center;
  grid-template-columns: repeat(auto-fit, minmax(18em, 1fr));
  grid-gap: 2em;
  width: 100%;
  height: 100%;
}
</style>
