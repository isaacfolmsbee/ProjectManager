<template>
<div class="w-full px-5 h-full fixed z-20 -mt-0 bg-gray-light-100 flex flex-col justify-center items-center">
	<h1 class="absolute top-5 font-bold text-2xl xl:text-3xl text-gray-dark-400">Project Manager</h1>
	<h2 class="text-gray-dark-300 xl:mb-2 text-2xl xl:text-3xl">Sign in</h2>
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
	<button 
		class="mt-3 py-1 px-4 bg-gray-dark-400 text-2xl xl:text-3xl text-gray-light-100 transition-colors duration-300 focus:bg-gray-dark-600 hover:bg-gray-dark-600"
		@click="login()" >Login</button>
	<span class="text-gray-dark-300 mt-3">
		Don't have an account? 
		<router-link to="/register" class="text-gray-dark-900 cursor-pointer">Register</router-link>
	</span>
	<span class="text-gray-dark-300 mt-0.5">
		Sign in as a 
		<router-link to="/register" class="text-gray-dark-900 cursor-pointer">Demo User</router-link>
	</span>
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

<style lang="postcss" scoped>
.input {
	@apply w-11/12 max-w-xs xl:max-w-sm mt-3 py-2 pl-2 border-b bg-gray-light-100 border-gray-dark-200 focus:outline-none focus:bg-gray-light-300 placeholder-gray-dark-100 text-xl transition-colors duration-300 rounded-none;
}
</style>