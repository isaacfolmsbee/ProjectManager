<template>
<div class="fixed top-16 w-full h-full flex flex-col items-center bg-gray-light-100">	
	<span @click="$emit('closeModal')" class="my-7"><router-link to="/" class="router-link">Dashboard</router-link></span>
	<span @click="$emit('closeModal')" class="mb-7"><router-link to="/tickets" class="router-link">Tickets</router-link></span>
	<span @click="$emit('closeModal')" class="mb-7"><router-link to="/projects" class="router-link">Manage Projects</router-link></span>
	<!-- <span @click="$emit('closeModal')" class="mb-7"><router-link to="/account" class="router-link">Account</router-link></span> -->
</div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
	name: "TheNavbarModal",
	props: {
		isOpen: {
			type: Boolean,
			required: true,
		}
	}
})
</script>

<style lang="postcss" scoped>
.router-link {
	@apply py-2 px-4 text-2xl text-gray-dark-400;
}

.router-link-exact-active {
	@apply font-bold bg-gray-dark-400 text-gray-light-100 rounded-none;
}
</style>