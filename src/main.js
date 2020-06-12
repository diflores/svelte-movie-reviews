import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		isLoggedIn: false,
	}
});

export default app;