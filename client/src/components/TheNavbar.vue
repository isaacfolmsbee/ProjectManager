<template>
<div class="fixed z-20 top-0 w-screen h-14 flex items-center bg-primary-800 shadow-md">
	<svg @click="toggleNavbar()" class="ml-3 w-8 h-8 text-gray-light-50 fill-current cursor-pointer" viewBox="0 0 24 24"><path d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2z"></path></svg>
	<router-link to="/" class="mx-auto text-2xl font-bold text-gray-light-50">Project Manager</router-link>
	<div class="relative mr-3">
		<div :class="{ 'flex': doNotificationPing, 'hidden': !doNotificationPing }" class="absolute right-1 top-1 items-center justify-center">
			<span class="animate-ping opacity-75 absolute w-2 h-2 rounded-full bg-gray-light-50"></span>
			<span class="absolute w-1.5 h-1.5 rounded-full bg-gray-light-50"></span>
		</div>
		<svg @click="toggleNotifications()" class="w-8 h-8 text-gray-light-50 fill-current cursor-pointer" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"></path></svg>
	</div>
	<TheNavbarModal 
		v-if="isNavbarModalOpen"
		@closeModal="isNavbarModalOpen = false" />
	<TheNotificationModal 
		v-if="isNotificationModalOpen" 
		:jwt="jwt"
		@close="isNotificationModalOpen = false" />
</div>
<!-- <div class="fixed top-0 w-screen xl:w-60 h-16 xl:h-screen flex xl:flex-col bg-gray-light-100 border-b xl:border-b-0 xl:border-r border-gray-light-400 items-center xl:items-start z-10">
	<div class="xl:hidden absolute left-3">
		<div :class="{ 'flex': doNotificationPing, 'hidden': !doNotificationPing }" class="absolute left-1.5 top-0.5 items-center justify-center">
			<span class="animate-ping opacity-75 absolute w-1.5 h-1.5 rounded-full bg-gray-dark-400"></span>
			<span class="absolute w-1 h-1 rounded-full bg-gray-dark-400"></span>
		</div>
		
		<svg @click="toggleNotifications()" class="w-8 h-8 text-gray-dark-400 fill-current cursor-pointer" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"></path></svg>
	</div>
	<router-link to="/" class="mx-auto xl:mt-3 xl:border-b xl:border-gray-light-300 text-2xl font-bold text-gray-dark-400">Project Manager</router-link>
	<svg @click="toggleNavbar()" class="xl:hidden absolute right-3 w-9 h-9 text-gray-dark-400 fill-current cursor-pointer" viewBox="0 0 24 24"><path d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2z"></path></svg>
	<TheNavbarModal 
		v-if="isNavbarModalOpen" 
		:isOpen="isNavbarModalOpen" 
		@closeModal="isNavbarModalOpen = false" />


	<div class="hidden xl:flex flex-col ml-2">
		<router-link to="/" class="mt-12 mb-5 router-link">Dashboard</router-link>
		<router-link to="/tickets" class="mb-5 router-link">Tickets</router-link>
		<router-link to="/projects" class="mb-5 router-link">Manage Projects</router-link>
	</div>
	<div class="hidden mt-auto px-2 pb-2 xl:flex flex-col h-auto bg-gray-light-300 w-full group transform translate-y-20 hover:translate-y-0 transition-transform duration-500">
		<div class="py-2 flex justify-between">
			<span class="text-xl text-gray-dark-400">Account</span>
			<svg class="w-8 h-8 text-gray-dark-400 fill-current transform rotate-90 group-hover:-rotate-90 transition-transform duration-500" viewBox="0 0 24 24"><path d="M6.5 17.5l8.25-5.5L6.5 6.5l1-1.5L18 12L7.5 19z"></path></svg>
		</div>
		<span 
			v-if="isNotificationModalOpen"
			@click="toggleNotifications()"
			class="text-gray-dark-400 text-lg cursor-pointer" >Hide Notifications</span>
		<span 
			v-else
			@click="toggleNotifications()"
			class="text-gray-dark-400 text-lg cursor-pointer" >Show Notifications</span>
		<router-link to="/logout" class="mx-auto mt-4 text-2xl text-gray-dark-400">Logout</router-link>
	</div>
	

	<TheNotificationModal 
		v-if="isNotificationModalOpen" 
		:jwt="jwt" 
		:isOpen="isNotificationModalOpen"
		@close="isNotificationModalOpen = false" />
</div> -->
</template>

<script lang="ts">
import Vue from 'vue';
import TheNavbarModal from './TheNavbarModal.vue';
import TheNotificationModal from './TheNotificationModal.vue';

export default Vue.extend({
	name: "TheNavbar",
	components: {
		TheNavbarModal,
		TheNotificationModal,
	},
	props: {
		jwt: {
			type: String,
			required: true,
		},
		hasUnreadNotification: {
			type: Boolean,
			required: true,
			default: false,
		}
	},
	data() {
		return {
			isNavbarModalOpen: false,
			isNotificationModalOpen: false,
		}
	},
	computed: {
		doNotificationPing(): boolean {
			return this.hasUnreadNotification ? true : false;
		}
	},
	methods: {
		toggleNavbar() {
			this.isNavbarModalOpen = !this.isNavbarModalOpen;
			this.isNotificationModalOpen = false;
		},
		toggleNotifications() {
			if (!this.isNotificationModalOpen) {
				this.$emit('readNotifications');
			}
			this.isNotificationModalOpen = !this.isNotificationModalOpen;
			this.isNavbarModalOpen = false;
		}
	}
})
</script>

<style lang="postcss" scoped>
.router-link {
	@apply mr-auto py-1.5 px-3 text-2xl text-gray-dark-400 focus:outline-none focus:bg-gray-light-300;
}

.router-link.router-link-exact-active {
	@apply font-bold bg-gray-light-300 border-b border-gray-light-500;
}
</style>