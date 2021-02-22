<template >
<div id="app">
	<div>
		<TheNavbar />
		<router-view 
			@login="login($event)" 
			@logout="logout()" 
			:projectList="userData.projects" 
			:jwt='userData.JWT'
			class="mt-16"/>
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
			userData: {
				_id: '',
				JWT: '',
				username: '',
				projects: [],
				notifications: [],
			},
		}
	},
	created() {
		const userData = sessionStorage.getItem('userdata');

		if (userData) {
			this.userData = JSON.parse(userData);
		}
	},
	methods: {
		login(userdata: {
			_id: '';
				JWT: '';
				username: '';
				projects: [];
				notifications: [];
		}) {
			this.userData = userdata;
			sessionStorage.setItem('userdata', JSON.stringify(userdata));
			this.$router.push('/');
		},
		logout() {
			this.userData = {
				_id: '',
				JWT: '',
				username: '',
				projects: [],
				notifications: [],
			};
			sessionStorage.removeItem('userdata');
			this.$router.push('/login');
		}
	}
});
</script>
