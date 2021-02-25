<template>
<div class="w-screen flex flex-col items-center pt-3 px-2">
	<div class="w-full flex flex-col items-center bg-gray-dark-400 rounded-lg p-1">
		<input 
			class="rounded-lg pl-1 w-full h-7"
			type="text" 
			placeholder="Project Name..."
			v-model="project.name" >
		<textarea 
			class="w-full pl-1 h-16 mt-1 rounded-lg resize-none"
			placeholder="Description..."
			v-model="project.description" >
		</textarea>
		<button 
			class="mt-1 py-0.5 px-3 bg-primary-400 rounded-lg font-bold text-gray-light-50"
			@click="postProject()" >
			Post Project
		</button>
	</div>
	<ProjectList 
		:projects="projectList" 
		:selectedProject="selectedProject.name"
		class="mt-3 w-full shadow-md"
		@changeProject="changeProject($event)" />
	
</div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import ProjectList from '../components/ProjectList.vue';
import { postProject } from '../api/project';

export default Vue.extend({
	name: "ProjectsManage",
	components: {
		ProjectList,
	},
	props: {
		jwt: {
			type: String,
			required: true,
		},
		projectList: {
			type: Array as PropType<Array<{
				_id: '';
				name: '';
			}>>,
			required: true,
		},
	},
	data() {
		return {
			selectedProject: {
				_id: '',
				name: '',
			},
			project: {
				name: '',
				description: '',
			}
		}
	},
	created() {
		this.selectedProject = {
			_id: this.projectList[0]._id,
			name: this.projectList[0].name,
		};
	},
	methods: {
		async changeProject(project: { _id: string; name: string}) {
			this.selectedProject = project;
		},
		async postProject() {
			await postProject(this.project.name, this.project.description, this.jwt);
			this.project = {
				name: '',
				description: '',
			};
		},
	}
})
</script>