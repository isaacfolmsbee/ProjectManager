<template>
<div class="p-1 lg:p-2 flex flex-wrap rounded-md">
	<div class="flex flex-col">
		<span class="text-lg lg:text-2xl font-bold dark:text-gray-50">{{ title }}</span>
		<span class="lg:ml-0.5 text-xs lg:text-sm text-gray-500 dark:text-gray-300">
			{{ createdBy }} / {{ dateFormatted }}
		</span>
	</div>
	<div class="ml-auto flex flex-col text-sm lg:text-base text-gray-500 dark:text-gray-300 text-right">
		<span>{{ type }}</span>
		<span>{{ severity }}</span>
	</div>
	<p class="w-full my-1 dark:text-gray-50 lg:text-lg">
		{{ description }}
	</p>
</div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
	name: "TicketItem",
	props: {
		title: {
			type: String,
			required: true,
		},
		createdBy: {
			type: String,
			required: true,
		},
		dateCreated: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			required: true,
		},
		severity: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
	},
	computed: {
		dateFormatted: function (): string {
			return this.dateCreated.substr(0, 10);
		}
	}
})
</script>