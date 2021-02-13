<template>
<div class="w-max mx-auto bg-gray-50 dark:bg-gray-600 rounded-lg shadow-md flex">
	<StatItem 
		v-for="(value, name) in stats" 
		:key="name"
		:name="name" 
		:value="value"
		class="m-1" />
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import StatItem from './StatItem.vue';

export default Vue.extend({
	name: 'StatList',
	components: {
		StatItem,
	},
	props: {
		stats: {
			type: Object,
			required: true,
		}
	}
})
</script>

<style lang="postcss" scoped>
/* @media (min-width: 360px) {
	.fix-wrap {
		width: auto;
		@apply flex-nowrap;
	}
} */
</style>