<template>
<div class="w-full px-5 h-full fixed z-20 -mt-0 bg-gray-light-100 flex flex-col justify-center items-center">
	<h1 class="absolute top-5 font-bold text-2xl text-gray-dark-400">Project Manager</h1>
	<h2 class="text-gray-dark-300 text-2xl">Register New Account</h2>
	<input 
		class="input" 
		type="text" 
		placeholder="Username..."
		v-model="username" >
	<input 
		class="input" 
		type="text" 
		placeholder="Email..."
		v-model="email" >
	<input 
		class="input" 
		type="password" 
		placeholder="Password..."
		v-model="password" >
	<input 
		class="input" 
		type="password" 
		placeholder="Confirm Password..."
		v-model="password" >
	<button 
		class="mt-3 py-1 px-4 bg-gray-dark-400 text-2xl text-gray-light-100 focus:bg-gray-dark-600"
		@click="register()" >Register</button>
	<span class="text-gray-dark-300 mt-3">
		Already have an account? 
		<router-link to="/login" class="text-gray-dark-900 cursor-pointer">Login</router-link>
	</span>
	<span class="text-gray-dark-300 mt-0.5">
		Sign in as a 
		<router-link to="/register" class="text-gray-dark-900 cursor-pointer">Demo User</router-link>
	</span>
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

<style lang="postcss" scoped>
.input {
	@apply w-11/12 max-w-xs mt-3 py-2 pl-2 border-b bg-gray-light-100 border-gray-dark-200 focus:outline-none focus:bg-gray-light-300 placeholder-gray-dark-100 text-xl transition-colors duration-300 rounded-none;
}
</style>