<template>
<div class="w-20 h-20 bg-indigo-600 dark:bg-indigo-200 flex flex-col rounded-md shadow-md text-gray-50">
	<span class="ml-1 font-mono dark:text-gray-800 overflow-hidden overflow-ellipsis">
		{{ name }}
	</span>
	<span class="mx-auto mt-1 text-3xl font-bold dark:text-gray-800">
		{{ value }}
	</span>
</div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
	name: 'StatItem',
	props: {
		name: {
			type: String,
			required: true,
		},
		value: {
			type: Number,
			required: true,
		}
	}
})
</script>