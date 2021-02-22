<template>
<div class="fixed top-0 w-screen h-16 flex bg-primary-400 items-center z-40">
	<svg class="absolute left-3 w-9 h-9 text-gray-light-50 fill-current cursor-pointer" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"></path></svg>
	<router-link to="/" class="mx-auto text-3xl font-bold text-gray-light-50">Project Manager</router-link>
	<svg @click="isNavbarModalOpen = !isNavbarModalOpen" class="absolute right-3 w-10 h-10 text-gray-light-50 fill-current cursor-pointer" viewBox="0 0 24 24"><path d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2z"></path></svg>
	<TheNavbarModal 
		v-if="isNavbarModalOpen" 
		:isOpen="isNavbarModalOpen" 
		@closeModal="isNavbarModalOpen = false" />
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import TheNavbarModal from './TheNavbarModal.vue';

export default Vue.extend({
	name: "TheNavbar",
	components: {
		TheNavbarModal,
	},
	data() {
		return {
			isNavbarModalOpen: false,
			isNotificationModalOpen: false,
		}
	}
})
</script>