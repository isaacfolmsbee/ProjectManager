<template>
<div class="fixed top-16 w-full h-full flex flex-col items-center bg-primary-400 px-3">	
	<span v-if="notifications.length" @click="deleteNotifications()" class="cursor-pointer mr-auto ml-1 my-2 text-gray-dark-600">Delete all</span>
	<span v-else class="font-bold mt-28 text-xl">No notifications</span>
	<div 
		v-for="notification in notifications" 
		:key="notification._id"
		class="mb-3 bg-gray-light-50 rounded-lg p-1 relative w-full" >

		<span @click="deleteNotification(notification._id)" class="absolute top-1 right-1 text-gray-dark-400 cursor-pointer text-sm">Delete</span>
		<div class="flex flex-col">
			<span class="font-bold">{{ notification.title }}</span>
			<span class="text-xs text-gray-dark-200">{{ notification.dateCreated }}</span>
		</div>
		<span>{{ notification.description }}</span>
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
			this.notifications = await getNotifications(this.jwt);
		},
	}
})
</script>