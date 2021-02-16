<template>
<div class="flex-grow">
	<select 
		@input="$emit('input', $event.target.value)"
		class="w-full h-9 rounded bg-gray-200 dark:bg-gray-500 dark:text-gray-50 text-lg font-mono">

		<option 
			v-for="option in options" 
			:key="option"
			:value="option">
			{{option}}
		</option>
	</select>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	name: "SelectInput",
	props: {
		options: {
			type: Array,
			required: true,
		}
	},
})
</script>