<template>
<div class="fixed z-10 w-screen xl:w-36 h-16 xl:h-screen bg-indigo-700 flex xl:flex-col justify-between xl:justify-start items-center">
	<TheModal v-if="isModalOpen" :darkMode="darkMode" @changeTheme="$emit('changeTheme')" @closeModal="isModalOpen = false" />
	<h1 class="xl:border-b xl:pb-4 xl:w-11/12 font-sans font-bold text-center text-gray-50 text-2xl ml-3 xl:ml-0 xl:mt-4">Project Manager</h1>
	<svg @click="isModalOpen = !isModalOpen" class="xl:hidden w-10 h-10 mr-3 text-gray-300 fill-current" viewBox="0 0 24 24"><path d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2z"></path></svg>
	<div class="hidden xl:flex w-full flex-col items-center">
		<router-link to="/" class="router-link mt-10">Dashboard</router-link>
		<router-link to="/tickets" class="router-link">Tickets</router-link>
		<router-link to="/manage-users" class="router-link">Manage Users</router-link>
		<router-link to="/manage-projects" class="router-link">Manage Projects</router-link>
	</div>
	<div :class="{ 'translate-y-10': !JWT, 'translate-y-20': JWT }" class="hidden xl:inline transform hover:translate-y-0 transition-transform duration-500 group w-36 h-auto mt-auto border-t">
		<div class="p-2 flex justify-between items-center">
			<span class="text-xl font-mono font-bold text-gray-50">Account</span>
			<svg class="w-6 h-6 text-gray-50 fill-current transform rotate-180 group-hover:rotate-0 transition-transform duration-500" viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 1 10 10a10 10 0 0 1-10 10A10 10 0 0 1 2 12A10 10 0 0 1 12 2m-5 8l5 5l5-5H7z"></path></svg>
		</div>
		<div class="p-2 flex justify-between items-center">
			<span class="text-lg text-gray-50">Theme:</span>
			<span @click="$emit('changeTheme')" :class="{ 'bg-indigo-100': !darkMode, 'justify-end bg-gray-900': darkMode }" 
				class="w-14 h-7 px-0.5 flex items-center rounded-full cursor-pointer">
				<span class="w-6 h-6 rounded-full bg-gray-50"></span>
			</span>
		</div>
		<div v-if="JWT" class="mb-1.5 text-center">
			<router-link to="logout" class="text-xl font-bold text-gray-50">Logout</router-link>
		</div>
	</div>
</div>
</template>
<script lang="ts">
import Vue from 'vue';
import TheModal from './TheModal.vue';

export default Vue.extend({
	name: "TheNavbar",
	components: {
		TheModal,
	},
	props: {
		JWT: {
			type: String,
			required: true
		},
		darkMode: {
			type: Boolean,
			required: true,
		}
	},
	data() {
		return {
			isModalOpen: false,
		}
	},
})
</script>
<style lang="postcss" scoped>
.router-link {
	@apply py-0.5 px-1 mb-4 text-2xl font-bold text-gray-50 text-center;
}

.router-link-exact-active {
	@apply bg-indigo-800 rounded-lg;
}
</style>