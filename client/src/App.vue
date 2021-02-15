<template >
<div id="app">
	<div>
		<TheNavbar @logout="logout" :JWT="user.JWT" :darkMode="darkMode" @changeTheme="darkMode = !darkMode" />
		<router-view @login="login($event)" :JWT="user.JWT" class="pt-16 xl:pt-0 xl:px-36" />
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
			user: {
				JWT: '',
				role: '',
			},
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
		login(response: {
			headers: {
				auth: string;
			};
			data: {
				role: string;
			};
		}) {
			sessionStorage.setItem('auth', response.headers.auth);
			sessionStorage.setItem('role', response.data.role);
			this.user = {
				JWT: response.headers.auth,
				role: response.data.role,
			}
			this.$router.push('/');
		},
		logout() {
			sessionStorage.removeItem('auth');
			sessionStorage.removeItem('role');
			this.user = {
				JWT: '',
				role: '',
			};
			this.$router.push('/login');
		}
	}
});
</script>
