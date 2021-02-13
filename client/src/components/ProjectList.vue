<template>
<div class="flex items-center">
	<label for="project-bar" class="px-1 lg:font-bold text-2xl dark:text-gray-50">Project:</label>
	<div id="project-bar" class="flex overflow-x-auto">
		<h1 
			v-for="project in projects" 
			:key="project._id" 
			@click="$emit('changeProject', project)" 
			:class="{ 'bg-indigo-500 dark:bg-indigo-200 text-gray-50 dark:text-gray-800 font-bold': (project.projectName === selectedProject) }" 
			class="px-1 mx-1 text-2xl rounded-lg cursor-pointer dark:text-gray-50 whitespace-nowrap">

			{{ project.projectName }}
		</h1>
	</div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
	name: "ProjectList",
	props: {
		projects: {
			type: Array,
			required: true,
		},
		selectedProject: {
			type: String,
			required: true,
		}
	}

})
</script>