<script>
  import { onMount } from "svelte";
  import { tokenStored } from "../store.js";
  import { navigate } from "svelte-routing";
  import axios from "axios";
  import Textfield from "@smui/textfield";
  import Chip, { Set, Text } from "@smui/chips";
  import Icon from "@smui/textfield/icon/index";
  import Select, { Option } from "@smui/select";
  import Card from "./Card.svelte";
  import { parseResults } from "../utils";
  export let isLoggedIn;

  let movie = "";
  let genreSelected = "";
  let genres = [];
  let genresToSearch = [];
  let genresToDisplay = [];
  let results = [];
  let best_movies_2019 = [];
  let most_popular_movies = [];
  let most_popular_kids_movies = [];

  const updateGenresSelected = genre => {
    if (genre && !genresToSearch.includes(genre.value)) {
      genresToSearch.push(genre.value);
      genresToDisplay.push({ k: genre.value, v: genre.text });
      genresToDisplay = genresToDisplay;
    }
  };

  const deleteGenreToSearch = chip => {
    const index = genresToSearch.indexOf(chip.k);
    if (index > -1) {
      genresToSearch.splice(index, 1);
      genresToDisplay.splice(index, 1);
      genresToSearch = genresToSearch;
      genresToDisplay = genresToDisplay;
    }
  };

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
    console.log(genresToSearch);
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
  const redirect_movie = function(movie_id) {
    navigate(`/movie/${movie_id}`);
  };
</script>

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
    width: 14em;
  }
  #chips-container {
    display: flex;
    align-items: center;
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
  .movie-card {
    cursor: pointer;
  }
</style>

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
            style="width: 100%">
            <Icon role="button" class="material-icons" on:click={search}>
              search
            </Icon>
          </Textfield>
        </div>
        <div id="genres-bar">
          <Select
            withLeadingIcon
            enhanced
            bind:value={genreSelected}
            label="Search a genre"
            style="width: 100%">
            <span slot="icon" style="display: flex; align-items: center;">
              <Icon
                role="button"
                class="material-icons"
                on:click={searchGenres}
                style="cursor: pointer;">
                search
              </Icon>
            </span>
            <Option value="" />
            {#each genres as genre}
              <Option
                value={genre.value}
                selected={genreSelected === genre.value}
                on:click={() => updateGenresSelected(genre)}>
                {genre.text}
              </Option>
            {/each}
          </Select>
        </div>
        <div id="chips-container">
          <Set chips={genresToDisplay} let:chip key={chip => chip.k} input>
            <Chip>
              <Text>{chip.v}</Text>
              <Icon
                class="material-icons"
                trailing
                tabindex="0"
                on:click={() => deleteGenreToSearch(chip)}
                style="color: grey;">
                cancel
              </Icon>
            </Chip>
          </Set>
        </div>
      </div>
      {#if !results.length}
        <h1 id="results-title">Today's featured movies</h1>
        {#if most_popular_movies.length}
          <h1 id="discover-title">Most popular movies</h1>
        {/if}
        <div class="movies-container">
          {#each most_popular_movies as result, i (result.id)}
            <div class="movie-card" on:click={redirect_movie(result.id)}>
              <Card
                cardTitle={result.title}
                cardSubtitle={result.plot}
                cardImage={result.posterURL} />
            </div>
          {/each}
        </div>
        {#if most_popular_kids_movies.length}
          <h1 id="discover-title">Most popular kids movies</h1>
        {/if}
        <div class="movies-container">
          {#each most_popular_kids_movies as result, i (result.id)}
            <div class="movie-card" on:click={redirect_movie(result.id)}>
              <Card
                cardTitle={result.title}
                cardSubtitle={result.plot}
                cardImage={result.posterURL} />
            </div>
          {/each}
        </div>
        {#if best_movies_2019.length}
          <h1 id="discover-title">Best movies from 2019</h1>
        {/if}
        <div class="movies-container">
          {#each best_movies_2019 as result, i (result.id)}
            <div class="movie-card" on:click={redirect_movie(result.id)}>
              <Card
                cardTitle={result.title}
                cardSubtitle={result.plot}
                cardImage={result.posterURL} />
            </div>
          {/each}
        </div>
      {:else}
        <h1 id="results-title">Movie Search Results</h1>
        <div class="movies-container">
          {#each results as result, i (result.id)}
            <div class="movie-card" on:click={redirect_movie(result.id)}>
              <Card
                cardTitle={result.title}
                cardSubtitle={result.plot}
                cardImage={result.posterURL} />
            </div>
          {/each}
        </div>
      {/if}
    </section>
  {/if}
</div>
