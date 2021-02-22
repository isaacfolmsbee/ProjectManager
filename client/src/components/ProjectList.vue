<template>
<div class="h-12 flex rounded-lg">
	<span class="w-min px-3 bg-primary-400 rounded-tl-lg rounded-bl-lg font-bold text-lg leading-tight text-gray-light-50 flex items-center">
		Select Project
	</span>
	<div class="bg-gray-dark-400 rounded-tr-lg rounded-br-lg flex flex-grow items-center overflow-y-auto text-2xl text-gray-light-50 whitespace-nowrap ">
		<span 
			v-for="project in projects" 
			:key="project._id" 
			class="px-2 cursor-pointer"
			:class="{ 'font-bold text-primary-200': (project.name === selectedProject) }"
			@click="$emit('changeProject', project)" >
			{{ project.name }}
		</span>
	</div>
</div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

export default Vue.extend({
	name: "ProjectList",
	props: {
		projects: {
			type: Array as PropType<Array<{
				_id: '';
				name: '';
			}>>,
			required: true,
		},
		selectedProject: {
			type: String,
			required: true,
		},
	}
})
</script>