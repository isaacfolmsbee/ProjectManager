<template>
<div>
	<TheNavbar />
	<div class="pt-16"></div>
	<label for="project-bar">Project:</label>
	<div id="project-bar">
		<h1 v-for="project in projects" :key="project._id">{{ project.projectName }}</h1>
	</div>
	<hr class="">
</div>
</template>
<script lang="ts">
import Vue from 'vue'
import TheNavbar from '../components/TheNavbar.vue';
import { getProjectNames } from '../api/project';

export default Vue.extend({
	components: {
		TheNavbar,
	},
	data() {
		return {
			jwt: '',
			projects: {},
		}
	},
	async created() {
		const authtoken = sessionStorage.getItem('authtoken');

		if (authtoken) {
			this.jwt = authtoken;
			this.projects = await getProjectNames(this.jwt);
		} else {
			this.$router.push('/login');
		}
	}
})
</script>