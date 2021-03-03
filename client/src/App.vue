<template >
<div id="app">
	<div>
		<TheNavbar 
			:jwt='userData.JWT' 
			:hasUnreadNotification="userData.hasUnreadNotification"
			@readNotifications="userData.hasUnreadNotification = false" />

		<router-view 
			@login="login($event)" 
			@logout="logout()" 
			:projectList="userData.projects" 
			:jwt='userData.JWT'
			class="mt-16 xl:mt-0 xl:pl-60"/>
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
				hasUnreadNotification: false,
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
			_id: string;
			JWT: string;
			username: string;
			projects: [];
			hasUnreadNotification: boolean;
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
				hasUnreadNotification: false,
			};
			sessionStorage.removeItem('userdata');
			this.$router.push('/login');
		}
	}
});
</script>
