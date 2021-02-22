<template>
<div class="fixed -mt-0 top-0 w-full h-full flex flex-col justify-center items-center bg-primary-400">
	<h1 class="absolute top-5 text-3xl font-bold text-gray-light-50">Project Manager</h1>
	<input type="text" v-model="email" placeholder="Email..."
		class="w-5/6 max-w-xs h-12 mb-5 pl-2 text-xl bg-gray-light-50 rounded-lg -mt-32">
	<input type="password" v-model="password" placeholder="Password..."
		class="w-5/6 max-w-xs h-12 mb-5 pl-2 text-xl bg-gray-light-50 rounded-lg">
	<button @click="login()" class="font-bold text-3xl text-gray-light-50 py-2 px-4 rounded-xl shadow-md bg-gray-dark-500">Login</button>
	<div class="flex text-lg mt-2">
		<p class="text-gray-dark-600">Don't have an account?</p><router-link to="/register" class="pl-1.5 text-gray-light-50 text">Register</router-link>
	</div>
	<div class="flex text-lg mt-2">
		<p class="text-gray-dark-600">Sign in as a</p><router-link to="/register" class="pl-1.5 text-gray-light-50 text">Demo User</router-link>
	</div>
</div>
</template>
<script lang="ts">
import Vue from 'vue';
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
			const userdata = await login(this.email, this.password);
			this.$emit('login', userdata);
		}
	}
})
</script>