<template>
<div class="fixed top-0 right-0 w-screen h-screen bg-indigo-700 flex flex-col items-center">
	<svg @click="$emit('closeModal')" class="absolute w-9 h-9 top-3 right-3 text-gray-200 fill-current" viewBox="0 0 24 24"><path d="M19 3H5a2 2 0 0 0-2 2V19a2 2 0 0 0 2 2H19a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m-3.4 14L12 13.4L8.4 17L7 15.6l3.6-3.6L7 8.4L8.4 7l3.6 3.6L15.6 7L17 8.4L13.4 12l3.6 3.6l-1.4 1.4z"></path></svg>
	<div class="h-full flex flex-col items-center">
		<router-link to="/" class="router-link mt-24">Dashboard</router-link>
		<router-link to="/tickets" class="router-link">Tickets</router-link>
		<router-link to="/manage-users" class="router-link">Manage Users</router-link>
		<router-link to="/manage-projects" class="router-link">Manage Projects</router-link>
		<router-link to="/account" class="router-link account mt-auto">Account</router-link>
	</div>
</div>
</template>
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
	name: "the-modal",
})
</script>
<style lang="postcss" scoped>
.router-link {
	@apply py-1 px-2 mb-4 text-3xl font-bold text-gray-50;
}

.router-link.account {
	@apply mb-14;
}

.router-link-exact-active {
	@apply bg-indigo-800 rounded-lg;
}
</style>