<template>
<div class="fixed -mt-0 top-0 w-full h-full flex flex-col justify-center items-center bg-primary-400">
	<h1 class="absolute top-5 text-3xl font-bold text-gray-light-50">Project Manager</h1>
	<input type="text" v-model="username" placeholder="Username..."
		class="w-5/6 max-w-xs h-12 mb-5 pl-2 text-xl bg-gray-light-50 rounded-lg -mt-24">
	<input type="text" v-model="email" placeholder="Email..."
		class="w-5/6 max-w-xs h-12 mb-5 pl-2 text-xl bg-gray-light-50 rounded-lg">
	<input type="password" v-model="password" placeholder="Password..."
		class="w-5/6 max-w-xs h-12 mb-5 pl-2 text-xl bg-gray-light-50 rounded-lg">
		<input type="password" v-model="confirmPassword" placeholder="Confirm Password..."
		class="w-5/6 max-w-xs h-12 mb-5 pl-2 text-xl bg-gray-light-50 rounded-lg">
	<button @click="register()" class="font-bold text-3xl text-gray-light-50 py-2 px-4 rounded-xl shadow-md bg-gray-dark-500">Register</button>
	<div class="flex text-lg mt-2">
		<p class="text-gray-dark-600">Already have an account?</p><router-link to="/login" class="pl-1.5 text-gray-light-50 text">Login</router-link>
	</div>
	<div class="flex text-lg mt-2">
		<p class="text-gray-dark-600">Sign in as a</p><router-link to="/register" class="pl-1.5 text-gray-light-50 text">Demo User</router-link>
	</div>
</div>
</template>
<script lang="ts">
import Vue from 'vue';
import { register } from '../api/user';

export default Vue.extend({
	data() {
		return {
			username: '',
			email: '',
			password: '',
			confirmPassword: '',
		}
	},
	methods: {
		async register() {
			if (this.password === this.confirmPassword) {
				await register(this.username, this.email, this.password);
				this.$router.push('/login');
			}
		}
	}
})
</script>