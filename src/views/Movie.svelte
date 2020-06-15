<script>
  import { onMount } from "svelte";
  import Chip, {Set, Text} from '@smui/chips';
  import Button, { Label } from "@smui/button";
  import Select, { Option } from "@smui/select";
  import Textfield from "@smui/textfield";
  import { tokenStored, create_review } from "../store.js";
  import axios from "axios";
  import { navigate } from "svelte-routing";

  export let movieId = location.pathname.split("/")[2];
  let token;
  const unsubscribeToken = tokenStored.subscribe(value => {
    token = value;
  });
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  let isLoggedIn;
  const unsubscribeIsLoggedIn = tokenStored.subscribe(value => {
    isLoggedIn = !!value;
  });

  let review = "";
  let score = 5;
  let is_loading = true;
  let is_loading_submit = false;
  let scores = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  let movie = {
    title: "",
    overview: "",
    image: "",
    director: "",
    actors: "",
    vote_average: "",
    parsed_duration: ""
  };
  let reviews = [];

  onMount(async () => {
    const posterBaseURL = "http://image.tmdb.org/t/p/w185";
    axios({
      url: `${process.env.SVELTE_APP_API_BASE_URL}/movies/${movieId}`,
      method: "GET"
    }).then(response => {
      const selectedMovie = response.data;
      selectedMovie["image"] = `${posterBaseURL}${selectedMovie.poster_path}`;
      const hours = selectedMovie.runtime / 60;
      const rhours = Math.floor(hours);
      const minutes = (hours - rhours) * 60;
      const rminutes = Math.round(minutes);
      selectedMovie["parsed_duration"] = `${rhours}h ${rminutes}m`;
      selectedMovie[
        "parsed_original_language"
      ] = selectedMovie.spoken_languages.find(
        language => language.iso_639_1 === selectedMovie.original_language
      ).name;
      movie = selectedMovie;
      axios({
        url: `${process.env.SVELTE_APP_API_BASE_URL}/movies/${movieId}/credits`,
        method: "GET"
      }).then(response => {
        const credits = response.data;
        movie["actors"] = credits.cast
          .slice(0, 5)
          .map(actor => actor.name)
          .join(", ");
        movie["director"] = credits.crew.find(
          person => person.job === "Director"
        ).name;
        is_loading = false;
      });
    });
    axios({
      url: `${process.env.SVELTE_APP_API_BASE_URL}/movies/${movieId}/reviews`,
      method: "GET"
    }).then(response => {
      reviews = response.data;
    });
  });
  const redirect_profile = function(user_id) {
    navigate(`/user/${user_id}`);
  };
  const submit_review = function() {
    is_loading_submit = true;
    let data = {
      review: review,
      rating: score,
      movie_id: movieId
    };
    create_review(data).then(() => {
      is_loading_submit = false;
      review = "";
      score = 5;
      location.reload(); // To-do: don't reload the whole page
    });
  };
</script>

<div>
  {#if isLoggedIn && !is_loading}
    <div id="movie-container">
      <div id="two-col-grid">
        <div>
          <h1 id="movie-title">{movie.title}</h1>
          <div id="info-container">
            <div id="display-in-row">
              <img src={movie.image} style="width: 200px;" alt={movie.title} />
              <div>
                <p style="margin: 0;">{movie.overview}</p>
                <p style="margin: 0;">Duration: {movie.parsed_duration}</p>
                <p style="margin: 0;">Date: {movie.release_date}</p>
                <p style="margin: 0;">Language: {movie.parsed_original_language}</p>
                <p style="margin: 0;" id="bolder">Cast: {movie.actors}</p>
                <p style="margin: 0;" id="bolder">Director: {movie.director}</p>
                <p style="margin: 0;" id="bolder">Average score: {movie.vote_average}/10</p>
                <Set chips={movie.genres.map(genre => genre.name)} let:chip  style="padding: 4px 0;">
                  <Chip>
                    <Text>{chip}</Text>
                  </Chip>
                </Set>
              </div>
            </div>
          </div>
        </div>
        <div id="review-container">
          <h1 id="add-review-title">Add your review</h1>
          <Textfield
            textarea
            bind:value={review}
            label="Review"
            style="width: 100%; height: 150px; margin-bottom: 2em;" />
          <div>
            <div id="display-in-row">
              <h3 id="score-title">Score:</h3>
              <Select enhanced bind:value={score}>
                {#each scores as selectedScore}
                  <Option
                    value={selectedScore}
                    selected={score === selectedScore}>
                    {selectedScore}
                  </Option>
                {/each}
              </Select>
            </div>
            <Button
              id="login-button"
              on:click={submit_review}
              variant="unelevated">
              <Label>Submit</Label>
            </Button>
          </div>
        </div>
      </div>
      {#if reviews.length}
        <div>
          <h1 id="reviews-title">Showing {reviews.length} review(s)</h1>
          <div id="two-col-grid">
            {#each reviews as movie_review, i (movie_review.id)}
              <div style="padding: 12px 0;">
                <div id="display-in-row">
                  <p
                    id="user-name"
                    on:click={redirect_profile(movie_review.user.id)}>
                    {`${movie_review.user.first_name} ${movie_review.user.last_name}`}
                  </p>
                  <p id="review-date">{movie_review.created_at.slice(0, 10)}</p>
                </div>
                <p style="margin: 0;">{movie_review.review}</p>
                <p style="margin: 0;" id="bolder">Score: {movie_review.rating}/10</p>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
#movie-container {
  height: 100%;
  color: var(--grey);
  padding: 2em;
}
#info-container {
  padding-right: 1em;
  padding-top: 1em;
}
#info-container > div > div {
  padding-left: 1em;
}
#movie-title {
  font-weight: 300;
  font-size: 2em;
  margin: 0;
}
#bolder {
  font-weight: 400;
}
#add-review-title {
  font-weight: 300;
  font-size: 1.5em;
  padding-top: 2em;
  padding-bottom: 1em;
  margin: 0;
}
#review-container {
  padding-left: 2em;
}
#review-container > div {
  display: flex;
  justify-content: space-between;
}
#reviews-title {
  font-size: 1.5em;
  font-weight: 300;
  padding-top: 2em;
  padding-bottom: 1em;
  margin: 0;
}
#score-title {
  font-weight: 300;
  padding-top: 1em;
  padding-right: 1em;
  margin: 0;
}
#display-in-row {
  display: flex;
}
#user-name {
  font-weight: 400;
  color: var(--secondary-color);
  margin: 0;
  margin-right: 2em;
  cursor: pointer;
}
#review-date {
  color: grey;
  margin: 0;
}
#two-col-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
</style>
