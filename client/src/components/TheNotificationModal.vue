<template>
<div class="fixed top-14 xl:top-0 xl:right-0 px-3 xl:px-0 w-full xl:w-56 h-full xl:h-auto flex flex-col bg-primary-800 xl:rounded-l-lg">
	<div @click="$emit('close')" class="h-20 mr-1.5 hidden xl:flex items-center justify-end border-b border-primary-500 text-gray-light-50 cursor-pointer">
		<span class="text-lg font-mono">NOTIFICATIONS</span>
		<svg class="w-10 h-10 fill-current" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"></path></svg>
	</div>
	<span v-if="notifications.length" @click="deleteNotifications()" class="cursor-pointer ml-1.5 my-2 text-gray-light-400 xl:text-gray-light-200">Delete all</span>
	<span v-else class="font-bold text-gray-light-300 mt-14 xl:mt-5 xl:pb-5 mx-auto text-xl">No notifications</span>
	<div 
		v-for="notification in notifications" 
		:key="notification._id"
		class="mb-1 px-1.5 pb-1 relative w-full border-b border-primary-700" >

		<span @click="deleteNotification(notification._id)" class="absolute top-1 xl:top-0 right-2 text-gray-light-400 cursor-pointer text-xs">Delete</span>
		<div class="flex flex-col">
			<span class="xl:order-2 font-bold text-gray-light-200">{{ notification.title }}</span>
			<span class="xl:order-1 text-xs text-gray-light-400">{{ timeAgo(notification.dateCreated) }}</span>
		</div>
		<span class="text-gray-light-200">{{ notification.description }}</span>
	</div>
</div>
<!-- <div class="fixed top-16 xl:top-0 xl:left-60 w-full xl:w-64 h-full flex flex-col bg-gray-light-100 xl:border-r border-gray-dark-400">
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
</div> -->
</template>

<script lang="ts">
import Vue from 'vue';
import { readNotifications, getNotifications, deleteNotifications, deleteNotification } from '../api/user';

export default Vue.extend({
	name: "TheNotificationModal",
	props: {
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
		getFormattedDate(date: Date, prefomattedDate: string | boolean = false, hideYear = false) {
			const MONTH_NAMES = [
				'January', 'February', 'March', 'April', 'May', 'June',
				'July', 'August', 'September', 'October', 'November', 'December'
			];
			const day = date.getDate();
			const month = MONTH_NAMES[date.getMonth()];
			const year = date.getFullYear();
			const hours = date.getHours();
			let minutes: string | number = date.getMinutes();

			if (minutes < 10) {
				// Adding leading zero to minutes
				minutes = `0${ minutes }`;
			}

			if (prefomattedDate) {
				// Today at 10:20
				// Yesterday at 10:20
				return `${ prefomattedDate } at ${ hours }:${ minutes }`;
			}

			if (hideYear) {
				// 10. January at 10:20
				return `${ day }. ${ month } at ${ hours }:${ minutes }`;
			}

			// 10. January 2017. at 10:20
			return `${ day }. ${ month } ${ year }. at ${ hours }:${ minutes }`;
		},
		// eslint-disable-next-line
		timeAgo(dateParam: any) {
			if (!dateParam) {
				return null;
			}

			const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
			const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000
			// eslint-disable-next-line
			const today: any = new Date();
			const yesterday = new Date(today - DAY_IN_MS);
			const seconds = Math.round((today - date) / 1000);
			const minutes = Math.round(seconds / 60);
			const isToday = today.toDateString() === date.toDateString();
			const isYesterday = yesterday.toDateString() === date.toDateString();
			const isThisYear = today.getFullYear() === date.getFullYear();


			if (seconds < 5) {
				return 'now';
			} else if (seconds < 60) {
				return `${ seconds } seconds ago`;
			} else if (seconds < 90) {
				return 'about a minute ago';
			} else if (minutes < 60) {
				return `${ minutes } minutes ago`;
			} else if (isToday) {
				return this.getFormattedDate(date, 'Today'); // Today at 10:20
			} else if (isYesterday) {
				return this.getFormattedDate(date, 'Yesterday'); // Yesterday at 10:20
			} else if (isThisYear) {
				return this.getFormattedDate(date, false, true); // 10. January at 10:20
			}

			return this.getFormattedDate(date); // 10. January 2017. at 10:20
		},	
	}
})
</script>