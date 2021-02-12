<template >
<div id="app">
	<div>
		<TheNavbar :JWT="JWT" :darkMode="darkMode" @changeTheme="darkMode = !darkMode" />
		<router-view @updateJWT="updateJWT($event)" :JWT="JWT" class="pt-16 xl:pt-0 xl:px-36" />
	</div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import TheNavbar from './components/TheNavbar.vue';

export default Vue.extend({
	name: 'App',
	components: {
		TheNavbar,
	},
	data() {
		return {
			darkMode: true,
			JWT: '',
		}
	},
	created() {
		this.darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
	},
	watch: {
		darkMode: function () {
			const html = document.getElementsByTagName('html')[0];
			if (this.darkMode) {
				html.setAttribute('class', 'dark');
			} else {
				html.setAttribute('class', '');
			}
			
			
		}
	},
	methods: {
		updateJWT(JWT: string) {
			if (JWT) {
				sessionStorage.setItem('authtoken', JWT);
			} else {
				sessionStorage.removeItem('authtoken');
			}
			this.JWT = JWT;
		}
	}
});
</script>
