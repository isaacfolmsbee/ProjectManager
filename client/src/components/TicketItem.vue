<template>
<div class="bg-gray-light-50 rounded-lg p-1">
	<div class="w-full flex">
		<div class="flex flex-col flex-grow border-r">
			<router-link 
				:to="{path:'/ticket', query:{id: ticket._id}}"
				class="font-bold" >
				{{ ticket.title }}
			</router-link>
			<span class="text-xs text-gray-dark-200">
				{{ ticket.createdBy }} / {{ dateFormatted }}
			</span>
		</div>
		<div class="flex pl-1">
			<span class="flex flex-col text-xs text-gray-dark-200">
				<span>{{ ticket.type }}</span>
				<span>{{ ticket.severity }}</span>
			</span>
			<span v-if="ticket.attachment" class="pl-1">
				<a :href="'/uploads/' + ticket.attachment"
					target="_blank" rel="noopener noreferrer" >
					<svg class="h-8 w-8 fill-current text-gray-dark-500" viewBox="0 0 384 512"><path d="M369.9 97.9L286 14C277 5 264.8-.1 252.1-.1H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V131.9c0-12.7-5.1-25-14.1-34zM332.1 128H256V51.9l76.1 76.1zM48 464V48h160v104c0 13.3 10.7 24 24 24h104v288H48zm32-48h224V288l-23.5-23.5c-4.7-4.7-12.3-4.7-17 0L176 352l-39.5-39.5c-4.7-4.7-12.3-4.7-17 0L80 352v64zm48-240c-26.5 0-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48s-21.5-48-48-48z"></path></svg>
				</a>
			</span>
		</div>
	</div>
	<div class="w-full pt-1">
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