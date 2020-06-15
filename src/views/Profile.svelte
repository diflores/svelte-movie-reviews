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

<div>
  {#if isLoggedIn && !is_loading}
    <div id="profile-container">
      <h1 id="movie-title">{fullName}</h1>
      {#if !reviews.length}
        <br />
        <p style="margin: 0;">No reviews to show</p>
      {:else}
        <div>
          <h2 id="reviews-title">{`Reviews (${reviews.length})`}</h2>
          <div id="reviews-grid">
            {#each reviews as movie_review, i (movie_review.id)}
              <div style="padding: 12px 0;">
                <div id="display-in-row">
                  <p
                    id="user-name"
                    on:click={redirect_movie(movie_review.movie_id)}
                  >
                    {movie_review.movie_name}
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
#profile-container {
  height: 100%;
  color: var(--grey);
  padding: 2em;
}
#user-name {
  cursor: pointer;
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
#reviews-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
</style>
