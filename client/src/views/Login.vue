<template>
<div class="w-screen h-screen bg-gray-700 flex flex-col items-center">
	<h1 class="font-bold text-gray-200 text-2xl mt-10">Project Manager</h1>
	<div class="flex flex-col h-20 justify-evenly">
		<input type="text" v-model="email" placeholder="email...">
		<input type="password" v-model="password" placeholder="password...">
	</div>
	<button @click="login()" class=" px-2 py-1 rounded-lg text-gray-300 text-xl transition-colors duration-500 hover:text-gray-100 hover:bg-gray-600">Login</button>
</div>
</template>
<script lang="ts">
import Vue from 'vue'
import { login } from '../api/user';

export default Vue.extend({
	data() {
		return {
			email: '',
			password: '',
		}
	},
	methods: {
		async login() {
			const response = await login(this.email, this.password);

			sessionStorage.setItem('authtoken', response);
			this.$router.push('/');
		}
	}
})
</script>