<template>
<div class="w-screen flex flex-col">
	<ProjectList 
		:projects="projectList" 
		:selectedProject="selectedProject.name"
		class="w-full bg-gray-light-300"
		@changeProject="changeProject($event)" />

	<h2 class="my-2 pl-1.5 font-bold text-xl text-gray-dark-400">Recent Tickets</h2>

	<TicketItem 
		v-for="ticket in tickets" 
		:key="ticket._id" 
		:ticket="ticket" 
		class="even:bg-gray-light-300"/>
</div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import ProjectList from '../components/ProjectList.vue';
import TicketItem from '../components/TicketItem.vue';
import { getTickets } from '../api/ticket';

export default Vue.extend({
	name: 'Dashboard',
	components: {
		ProjectList,
		TicketItem,
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
			tickets: [{
				_id: '',
				comments: [],
				createdBy: '',
				dateCreated: '',
				description: '',
				history: [],
				project: '',
				severity: '',
				status: '',
				title: '',
				type: '',
				usersAssigned: [],
			}],
		}
	},
	async created() {
		this.selectedProject = {
			_id: this.projectList[0]._id,
			name: this.projectList[0].name,
		};
		this.tickets = await getTickets(this.selectedProject._id, this.jwt);
	},
	methods: {
		async changeProject(project: { _id: string; name: string}) {
			this.selectedProject = project;
			this.tickets = await getTickets(this.selectedProject._id, this.jwt);
		},
		async getTickets() {
			this.tickets = await getTickets(this.selectedProject._id, this.jwt);
		}
	}
});
</script>