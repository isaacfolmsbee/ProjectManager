<template>
<div class="fixed top-0 w-screen h-16 flex bg-gray-light-100 border-b border-gray-dark-400 items-center z-10">
	<div class="absolute left-3">
		<div :class="{ 'flex': doNotificationPing, 'hidden': !doNotificationPing }" class="absolute left-1.5 top-0.5 items-center justify-center">
			<span class="animate-ping opacity-75 absolute w-1.5 h-1.5 rounded-full bg-gray-light-50"></span>
			<span class="absolute w-1 h-1 rounded-full bg-gray-light-50"></span>
		</div>
		
		<svg @click="toggleNotifications()" class="w-8 h-8 text-gray-dark-400 fill-current cursor-pointer" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"></path></svg>
	</div>
	<router-link to="/" class="mx-auto text-2xl font-bold text-gray-dark-400">Project Manager</router-link>
	<svg @click="toggleNavbar()" class="absolute right-3 w-9 h-9 text-gray-dark-400 fill-current cursor-pointer" viewBox="0 0 24 24"><path d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2z"></path></svg>
	<TheNavbarModal 
		v-if="isNavbarModalOpen" 
		:isOpen="isNavbarModalOpen" 
		@closeModal="isNavbarModalOpen = false" />

	<TheNotificationModal v-if="isNotificationModalOpen" :jwt="jwt" :isOpen="isNotificationModalOpen" />
</div>
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