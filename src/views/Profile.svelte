<script>
  import { onMount } from "svelte";
  import { tokenStored } from "../store.js";
  import axios from "axios";
  import { navigate } from "svelte-routing";
  export let userId;
  export let is_loading = true;
  export let user = {};
  export let reviews = [];
  export let fullName = "";
  let token;
  const unsubscribeToken = tokenStored.subscribe(value => {
    token = value;
  });
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  let isLoggedIn;
  const unsubscribeIsLoggedIn = tokenStored.subscribe(value => {
    isLoggedIn = !!value;
  });

  onMount(async () => {
    axios({
      url: `${process.env.SVELTE_APP_API_BASE_URL}/users/profile/${userId}`,
      method: "GET"
    })
      .then(response => {
        user = response.data;
        fullName = `${user.first_name} ${user.last_name}`;
        axios({
          url: `${process.env.SVELTE_APP_API_BASE_URL}/users/${userId}/reviews`,
          method: "GET"
        }).then(resp => {
          reviews = resp.data;
          is_loading = false;
        });
      })
      .catch(err => console.log(err));
  });
  const redirect_movie = function(movie_id) {
    navigate(`/movie/${movie_id}`);
  };
</script>

<style>
#profile-container {
  height: 100%;
  width: 100%;
  color: var(--grey);
  padding: 2em;
}
#user-name {
  cursor: pointer;
}
</style>

<div>
  {#if isLoggedIn && !is_loading}
    <div id="profile-container" v-if="isLoggedIn && !is_loading">
      <h1 id="movie-title">{fullName}</h1>
      {#if !reviews.length}
        <br />
        <p>No reviews to show</p>
      {:else}
        <div>
          <h2 id="reviews-title">{`Reviews (${reviews.length})`}</h2>
          {#each reviews as movie_review, i (movie_review.id)}
            <div id="display-in-row">
              <p
                id="user-name"
                on:click={redirect_movie(movie_review.movie_id)}>
                {movie_review.movie_name}
              </p>
              <p id="review-date">{movie_review.created_at.slice(0, 10)}</p>
            </div>
            <p>{movie_review.review}</p>
            <p id="bolder">Score: {movie_review.rating}/10</p>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>
