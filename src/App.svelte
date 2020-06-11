<script>
	export let name;
	import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
  import IconButton from '@smui/icon-button';
</script>

<main>
	<div class="flexy">
    <div class="top-app-bar-container">
      <TopAppBar variant="static" color="#9c6cd3">
        <Row>
          <Section>
            <IconButton class="material-icons">menu</IconButton>
            <Title>Movie Reviews</Title>
          </Section>
          <Section align="end" toolbar>
            <IconButton class="material-icons" aria-label="Download">file_download</IconButton>
            <IconButton class="material-icons" aria-label="Print this page">print</IconButton>
          </Section>
        </Row>
      </TopAppBar>
    </div>
	<h1>Hello {name}!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
</main>

<style>
</style>