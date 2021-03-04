<template>
<div class="p-1 flex flex-wrap rounded-lg shadow-md bg-gray-light-50">
	<span class="text-gray-dark-600 w-full">{{ ticket.description }}</span>
	<div class="mt-1 flex w-full items-center">
		<span 
			class="mr-1 py-0.5 px-1.5 rounded-lg text-sm text-gray-light-50"
			:class="[(ticket.type === 'bug') ? 'bg-red-600': 'bg-blue-500']" >
			{{ ticket.type.charAt(0).toUpperCase() + ticket.type.slice(1) }}
		</span>
		<span 
			class="py-0.5 px-1.5 rounded-lg text-sm text-gray-light-50"
			:class="[{'bg-green-500': (ticket.severity  === 'low')}, 
						{'bg-orange-500': (ticket.severity  === 'medium')}, 
						{'bg-red-600': (ticket.severity  === 'high')}, 
						{'bg-red-700': (ticket.severity  === 'severe')},]" >
			{{ ticket.severity.charAt(0).toUpperCase() + ticket.severity.slice(1) }}
		</span>
		<span class="mr-1 ml-auto text-gray-dark-300 text-xs">{{ dateFormatted }}</span>
	</div>
	<!-- <div class="w-full flex items-center">
		<div class="leading-none">
			<div>
				<span class="mr-1 px-1 py-0.5 bg-gray-light-300 text-gray-dark-400 text-xs xl:text-sm">{{ ticket.type }}</span>
				<span class="px-1 py-0.5 bg-gray-light-300 text-gray-dark-400 text-xs xl:text-sm">{{ ticket.severity }}</span>
			</div>
			<h3 class="font-bold text-gray-dark-400 mt-1 xl:mt-0 xl:text-lg"><router-link :to="{path:'/ticket', query:{id: ticket._id}}">{{ ticket.title }}</router-link></h3>
			<span class="text-xs xl:text-sm text-gray-dark-200">{{ ticket.createdBy }} / {{ dateFormatted }}</span>
		</div>
		<span v-if="ticket.attachment" class="ml-auto mr-1">
			<a :href="'/uploads/' + ticket.attachment"
				target="_blank" rel="noopener noreferrer" >
				<svg class="h-8 xl:h-9 w-8 xl:w-9 fill-current text-gray-dark-400" viewBox="0 0 384 512"><path d="M369.9 97.9L286 14C277 5 264.8-.1 252.1-.1H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V131.9c0-12.7-5.1-25-14.1-34zM332.1 128H256V51.9l76.1 76.1zM48 464V48h160v104c0 13.3 10.7 24 24 24h104v288H48zm32-48h224V288l-23.5-23.5c-4.7-4.7-12.3-4.7-17 0L176 352l-39.5-39.5c-4.7-4.7-12.3-4.7-17 0L80 352v64zm48-240c-26.5 0-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48s-21.5-48-48-48z"></path></svg>
			</a>
		</span>
	</div>
	<div class="w-full mt-1 xl:mt-0 xl:text-lg">
		{{ ticket.description }}
	</div> -->
</div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
	name: "TicketItem",
	props: {
		ticket: {
			type: Object,
			required: true,
		}
	},
	computed: {
		dateFormatted(): string {
			return this.timeAgo(this.ticket.dateCreated);
		},
	},
	methods: {
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