<template>
<div class="fixed top-16 xl:top-0 xl:left-60 w-full xl:w-64 h-full flex flex-col bg-gray-light-100 xl:border-r border-gray-dark-400">
	<div class="hidden xl:flex justify-between mt-1.5">
		<h2 class="text-gray-dark-400 mx-1.5 font-bold text-lg">Notifications</h2>
		<svg 
			@click="$emit('close')"
			class="w-8 h-8 fill-current text-gray-dark-400 cursor-pointer" 
			viewBox="0 0 24 24">
			<path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z">
			</path>
		</svg>
	</div>
	<span v-if="notifications.length" @click="deleteNotifications()" class="cursor-pointer mr-auto ml-1.5 my-2 text-gray-dark-300">Delete all</span>
	<span v-else class="font-bold text-gray-dark-400 mt-14 mx-auto text-xl">No notifications</span>
	<div 
		v-for="notification in notifications" 
		:key="notification._id"
		class="mb-1 px-1.5 pb-1 relative w-full border-b-8 border-gray-light-300" >

		<span @click="deleteNotification(notification._id)" class="absolute top-1 right-2 text-gray-dark-300 cursor-pointer text-xs">Delete</span>
		<div class="flex flex-col">
			<span class="font-bold text-gray-dark-400">{{ notification.title }}</span>
			<span class="text-xs text-gray-dark-200">{{ notification.dateCreated.substr(0, 10) }}</span>
		</div>
		<span class="text-gray-dark-400">{{ notification.description }}</span>
	</div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { readNotifications, getNotifications, deleteNotifications, deleteNotification } from '../api/user';

export default Vue.extend({
	name: "TheNotificationModal",
	props: {
		isOpen: {
			type: Boolean,
			required: true,
		},
		jwt: {
			type: String,
			required: true,
		}
	},
	data() {
		return {
			notifications: [],
		}
	},
	async created() {
		this.notifications = await getNotifications(this.jwt);
		await readNotifications(this.jwt);		
	},
	methods: {
		async deleteNotifications() {
			await deleteNotifications(this.jwt);
			this.notifications = [];
		},
		async deleteNotification(notificationID: string) {
			await deleteNotification(notificationID, this.jwt);
			for (let i = 0; i < this.notifications.length; i++) {
				if (this.notifications[i]._id === notificationID) {
					this.notifications.splice(i, 1);
				}	
			}
		},
	}
})
</script>