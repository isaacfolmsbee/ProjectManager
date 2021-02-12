<template>
<div class="fixed w-screen h-screen flex flex-col justify-center items-center">
	<input type="text" v-model="email" placeholder="email..."
		class="input -mt-32">
	<input type="password" v-model="password" placeholder="password..."
		class="input">
	<button @click="login()" class="text-gray-600 dark:text-gray-200 text-2xl xl:text-3xl">Login</button>
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
			const response = await login(this.email, this.password);
			this.$emit('updateJWT', response);
			this.$router.push('/');
		}
	}
})
</script>

<style lang="postcss" scoped>
.input {
	@apply w-11/12 max-w-xs xl:max-w-sm pl-2 h-11 xl:h-12 mb-5 bg-gray-200 dark:bg-gray-600 border border-gray-700 dark:border-gray-400 rounded-md text-xl dark:text-gray-100;
}
</style>