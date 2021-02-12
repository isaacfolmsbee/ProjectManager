<template>
<div class="w-screen h-5/6 flex flex-col items-center">
	<div class="w-full py-2 flex items-center">
		<label for="project-bar" class="px-1 text-2xl dark:text-gray-50">Project:</label>
		<div id="project-bar" class="flex overflow-x-auto">
			<h1 v-for="project in projectNames" :key="project._id" 
				@click="changeProject(project)" 
				:class="{ 'bg-indigo-500 dark:bg-indigo-200 text-gray-50 dark:text-gray-800 font-bold': (project.projectName === selectedProject) }" 
				class="px-1 mx-1 text-2xl rounded-lg cursor-pointer dark:text-gray-50">

				{{ project.projectName }}
			</h1>
		</div>
	</div>

	<hr class="w-full mb-1 dark:border-gray-600">

	<div class="w-min max-w-sm overflow-x-scroll m-1 bg-gray-50 dark:bg-gray-600 rounded-lg shadow-md flex flex-wrap fix-wrap">
		<div class="flex">
			<div class="stat">
				<span class="stat-label">low</span>
				<span class="stat-number">{{ severity.low }} </span>
			</div>
			<div class="stat">
				<span class="stat-label">medium</span>
				<span class="stat-number">{{ severity.medium }} </span>
			</div>
		</div>
		<div class="flex">
			<div class="stat">
				<span class="stat-label">high</span>
				<span class="stat-number">{{ severity.high }} </span>
			</div>
			<div class="stat">
				<span class="stat-label">severe</span>
				<span class="stat-number">{{ severity.severe }}</span>
			</div>
		</div>
	</div>

	<label for="tickets-wrapper" class="ml-2 text-xl dark:text-gray-50 mr-auto">Recent Tickets:</label>
	<div id="tickets-wrapper" class="mt-2 w-11/12 max-w-sm mx-auto">
		<div v-for="ticket in tickets" :key="ticket._id" class="bg-gray-50 dark:bg-gray-600 p-1 flex flex-wrap rounded-md shadow-md">
			<div class="flex flex-col">
				<span class="text-lg font-bold dark:text-gray-50">{{ ticket.title }}</span>
				<span class="text-xs text-gray-500 dark:text-gray-300">
					{{ ticket.createdBy }} / {{ ticket.dateCreated.substr(0, 10) }}
				</span>
			</div>
			<div class="ml-auto flex flex-col text-sm text-gray-500 dark:text-gray-300 text-right">
				<span>{{ ticket.type }}</span>
				<span>{{ ticket.severity }}</span>
			</div>
			<p class="w-full my-1 dark:text-gray-50">
				{{ ticket.description }}
			</p>
		</div>
	</div>
</div>
</template>
<script lang="ts">
import Vue from 'vue'
import { getProjectNames } from '../api/project';
import { getTickets, getSeverityStat } from '../api/ticket';

export default Vue.extend({
	name: 'Dashboard',
	data() {
		return {
			jwt: '',
			projectNames: [{
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
		const authtoken = sessionStorage.getItem('authtoken');

		if (authtoken) {
			this.jwt = authtoken;
			this.projectNames = await getProjectNames(this.jwt);
			this.selectedProject = this.projectNames[0].projectName;
			this.severity = await getSeverityStat(this.projectNames[0]._id, this.jwt);
			this.tickets = await getTickets(this.projectNames[0]._id, this.jwt);
		} else {
			this.$router.push('/login');
		}
	},
	methods: {
		async changeProject(project: { _id: string; projectName: string }) {
			this.selectedProject = project.projectName;
			this.severity = await getSeverityStat(project._id, this.jwt);
			this.tickets = await getTickets(project._id, this.jwt);
		}
	}
})
</script>

<style lang="postcss" scoped>
@media (min-width: 360px) {
	.fix-wrap {
		width: auto;
	}
}

.stat {
	@apply w-20 h-20 m-1 bg-indigo-600 dark:bg-indigo-200 flex flex-col rounded-md shadow-md text-gray-50;
}

.stat-label {
	@apply ml-1 font-mono dark:text-gray-800;
}

.stat-number {
	@apply mx-auto mt-1 text-3xl font-bold dark:text-gray-800;
}
</style>