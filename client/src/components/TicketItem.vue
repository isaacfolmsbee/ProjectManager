<template>
<div class="px-1.5 py-1 flex flex-wrap">
	<div class="w-full flex items-center">
		<div class="leading-none">
			<div>
				<span class="mr-1 px-1 py-0.5 bg-gray-dark-400 text-gray-light-100 text-xs">{{ ticket.type }}</span>
				<span class="px-1 py-0.5 bg-gray-dark-400 text-gray-light-100 text-xs">{{ ticket.severity }}</span>
			</div>
			<h3 class="font-bold text-gray-dark-400 mt-1"><router-link :to="{path:'/ticket', query:{id: ticket._id}}">{{ ticket.title }}</router-link></h3>
			<span class="text-xs text-gray-dark-200">{{ ticket.createdBy }} / {{ dateFormatted }}</span>
		</div>
		<span v-if="ticket.attachment" class="ml-auto mr-1">
			<a :href="'/uploads/' + ticket.attachment"
				target="_blank" rel="noopener noreferrer" >
				<svg class="h-8 w-8 fill-current text-gray-dark-400" viewBox="0 0 384 512"><path d="M369.9 97.9L286 14C277 5 264.8-.1 252.1-.1H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V131.9c0-12.7-5.1-25-14.1-34zM332.1 128H256V51.9l76.1 76.1zM48 464V48h160v104c0 13.3 10.7 24 24 24h104v288H48zm32-48h224V288l-23.5-23.5c-4.7-4.7-12.3-4.7-17 0L176 352l-39.5-39.5c-4.7-4.7-12.3-4.7-17 0L80 352v64zm48-240c-26.5 0-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48s-21.5-48-48-48z"></path></svg>
			</a>
		</span>
	</div>
	<div class="w-full mt-1">
		{{ ticket.description }}
	</div>
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
			return this.ticket.dateCreated.substr(0, 10);
		},
	}
})
</script>