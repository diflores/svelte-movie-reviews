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

  export let review = "";
  export let score = 5;
  export let is_loading = true;
  export let is_loading_submit = false;
  export let scores = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  export let movie = {
    title: "",
    overview: "",
    image: "",
    director: "",
    actors: "",
    vote_average: "",
    parsed_duration: ""
  };
  export let reviews = [];

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

<style>
#user-name {
  cursor: pointer;
}
</style>

<div>
  {#if isLoggedIn && !is_loading}
    <div id="movie-container">
      <div>
        <h1 id="movie-title">{movie.title}</h1>
        <div id="info-container">
          <div id="display-in-row">
            <img src={movie.image} style="height: 300px;" alt={movie.title} />
            <div>
              <p>{movie.overview}</p>
              <p>Duration: {movie.parsed_duration}</p>
              <p>Date: {movie.release_date}</p>
              <p>Language: {movie.parsed_original_language}</p>
              <p id="bolder">Cast: {movie.actors}</p>
              <p id="bolder">Director: {movie.director}</p>
              <p id="bolder">Average score: {movie.vote_average}/10</p>
              <Set chips={movie.genres.map(genre => genre.name)} let:chip>
                <Chip>
                  <Text>{chip}</Text>
                </Chip>
              </Set>
            </div>
          </div>
        </div>
        <div id="review-container">
          <h1 id="add-review-title">Add your review</h1>
          <Textfield textarea bind:value={review} label="Review" />
          <div>
            <div id="display-in-row">
              <h3 id="score-title">Score:</h3>
              <Select bind:value={score} label="Rating">
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
          {#each reviews as movie_review, i (movie_review.id)}
            <div>
              <div id="display-in-row">
                <p
                  id="user-name"
                  on:click={redirect_profile(movie_review.user.id)}>
                  {`${movie_review.user.first_name} ${movie_review.user.last_name}`}
                </p>
                <p id="review-date">{movie_review.created_at.slice(0, 10)}</p>
              </div>
              <p>{movie_review.review}</p>
              <p id="bolder">Score: {movie_review.rating}/10</p>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>
