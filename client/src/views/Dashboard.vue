<template>
<div class="w-full flex flex-col">
	<div class="py-1.5 px-2.5 border-b border-gray-light-300">
		<div class="flex justify-between">
			<span class="text-gray-dark-400">Select Project</span>
			<span class="text-gray-dark-300">Role: <span class="text-primary-600">{{ selectedProject.role }}</span></span>
		</div>
		<ProjectSelector 
			:projectList="projectList"
			:startingProject="selectedProject" 
			@input="changeProject($event)"
			class="my-1" />
	</div>
	<div class="flex justify-evenly my-2">
		<span 
			class="status-btn" 
			:class="[(this.selectedTicketStatus === 'open') ? 'bg-blue-500': 'bg-gray-dark-100']"
			@click="changeTicketFilter('open')">
			Open
		</span>
		<span 
			class="status-btn" 
			:class="[(this.selectedTicketStatus === 'in progress') ? 'bg-green-500': 'bg-gray-dark-100']"
			@click="changeTicketFilter('in progress')">
			In Progress
		</span>
		<span 
			class="status-btn" 
			:class="[(this.selectedTicketStatus === 'need info') ? 'bg-orange-500': 'bg-gray-dark-100']"
			@click="changeTicketFilter('need info')">
			Need Info
		</span>
	</div>
	<TicketItem 
		v-for="ticket in filteredTickets" 
		:key="ticket._id" 
		:ticket="ticket" 
		class="mx-2 mb-2" />
	<!-- <div class="lg:w-1/2 lg:mr-2 xl:pl-4">
		<ProjectList 
			:projects="projectList" 
			:selectedProject="selectedProject.name"
			class="w-full border-b md:border-b-0 border-gray-light-300 md:bg-gray-light-200"
			@changeProject="changeProject($event)" />
	</div>

	<div class=" md:bg-gray-light-200 md:mt-2 lg:mt-0 md:px-1.5 lg:w-1/2 lg:ml-2">
		<h2 class="py-2 pl-1.5 font-bold text-xl text-gray-dark-400">Recent Tickets</h2>

		<TicketItem 
			v-for="ticket in tickets" 
			:key="ticket._id" 
			:ticket="ticket" 
			class="border-b last:border-b-0 border-gray-light-300 md:border-gray-light-400"/>
	</div> -->
</div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import TicketItem from '../components/TicketItem.vue';
import ProjectSelector from '../components/ProjectSelector.vue';
import { getTickets } from '../api/ticket';

export default Vue.extend({
	name: 'Dashboard',
	components: {
		ProjectSelector,
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
				role: '';
			}>>,
			required: true,
		},
	},
	data() {
		return {
			selectedTicketStatus: 'open',
			selectedProject: {
				_id: '',
				name: '',
				role: '',
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
			filteredTickets: [{
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
			role: this.projectList[0].role,
		};
		this.tickets = await getTickets(this.selectedProject._id, this.jwt);
		this.filterTicketsStatus('open');
	},
	methods: {
		async changeProject(project: { _id: string; name: string; role: string}) {
			this.selectedProject = project;
			this.tickets = await getTickets(this.selectedProject._id, this.jwt);
			this.filterTicketsStatus(this.selectedTicketStatus);
		},
		async getTickets() {
			this.tickets = await getTickets(this.selectedProject._id, this.jwt);
		},
		changeTicketFilter(status: string) {
			console.log(status);
			this.selectedTicketStatus = status;
			this.filterTicketsStatus(status);
		},
		filterTicketsStatus(status: string) {
			this.filteredTickets = this.tickets.filter(
				(ticket: {
					status: string;
				}) => ticket.status.toLowerCase() === status
			);
		}
	}
});
</script>

<style lang="postcss" scoped>
.status-btn {
	@apply rounded-xl text-gray-light-50 py-1 px-2 shadow-md cursor-pointer transition-colors duration-300;
}
</style>