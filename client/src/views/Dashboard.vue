<template>
<div class="w-screen lg:w-11/12 lg:mx-auto">
		<ProjectList 
			:projects="projects" 
			:selectedProject="selectedProject" 
			@changeProject="changeProject($event)"
			class="lg:px-2 py-2 lg:py-3 xl:py-6" />

	<hr class="w-full dark:border-gray-600">

	<div class="w-full overflow-x-auto flex justify-center xl:justify-start xl:pl-2 my-2">
		<StatList :stats="severity" />
		<div class="hidden lg:inline ml-3">
			<StatList :stats="type" />
		</div>
	</div>

	<label for="tickets-wrapper" class="ml-2 text-xl dark:text-gray-50 mr-auto">Recent Tickets:</label>
	<div id="tickets-wrapper" class="mt-2 w-11/12 max-w-sm lg:max-w-lg mx-auto">
			<TicketItem 
				v-for="ticket in tickets" 
				:key="ticket._id" 
				v-bind="ticket" />
	</div>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import StatList from '../components/StatList.vue';
import TicketItem from '../components/TicketItem.vue';
import ProjectList from '../components/ProjectList.vue';
import { getProjectNames } from '../api/project';
import { getTickets, getSeverityStat, getTypeStat } from '../api/ticket';

export default Vue.extend({
	name: 'Dashboard',
	components: {
		StatList,
		TicketItem,
		ProjectList,
	},
	props: {
		JWT: {
			type: String,
			required: true,
		}
	},
	data() {
		return {
			projects: [{
				_id: '',
				projectName: '',
			}],
			selectedProject: '',
			severity: {
				low: 0,
				medium: 0,
				high: 0,
				severe: 0,
			},
			type: {
				bug: 0,
				suggestion: 0
			},
			tickets: [{
				_id: '',
				title: '',
				createdBy: '',
				dateCreated: '',
				type: '',
				severity: '',
				description: '',
			}],
		}
	},
	async created() {
		window.scrollTo(0, 0);
		if (this.JWT) {
			this.projects = await getProjectNames(this.JWT);
			this.selectedProject = this.projects[0].projectName;
			this.severity = await getSeverityStat(this.projects[0]._id, this.JWT);
			this.type = await getTypeStat(this.projects[0]._id, this.JWT);
			this.tickets = await getTickets(this.projects[0]._id, this.JWT);
		} else {
			this.$router.push('/login');
		}
	},
	methods: {
		async changeProject(project: { _id: string; projectName: string }) {
			this.selectedProject = project.projectName;
			this.severity = await getSeverityStat(project._id, this.JWT);
			this.type = await getTypeStat(project._id, this.JWT);
			this.tickets = await getTickets(project._id, this.JWT);
		}
	}
})
</script>