<template>
<div class="w-screen flex flex-col lg:flex-row md:w-3/4 lg:w-screen lg:px-4 md:mx-auto md:py-2 lg:py-4 ">
	<div class="lg:w-1/2 lg:mr-2 xl:pl-4">
		<ProjectList 
			:projects="projectList" 
			:selectedProject="selectedProject.name"
			class="w-full bg-gray-light-300"
			@changeProject="changeProject($event)" />
	</div>
	

	<div class="md:bg-gray-light-300 md:mt-2 lg:mt-0 md:px-1.5 lg:w-1/2 lg:ml-2">
		<h2 class="py-2 pl-1.5 font-bold text-xl text-gray-dark-400">Recent Tickets</h2>

		<TicketItem 
			v-for="ticket in tickets" 
			:key="ticket._id" 
			:ticket="ticket" 
			class="even:bg-gray-light-300 md:border-b last:border-b-0 md:border-gray-light-600"/>
	</div>
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