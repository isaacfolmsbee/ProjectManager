<template>
<div class="w-screen h-screen flex flex-col lg:flex-row">
	<div class="w-full px-2 pt-2 flex flex-col items-center">
		<div class="w-full md:w-5/6 lg:w-full bg-gray-50 dark:bg-gray-600 shadow-md rounded-lg">
			<ProjectList 
				:projects="projects" 
				:selectedProject="selectedProject.name" 
				@changeProject="changeProject($event)"
				class="lg:px-2 py-2 lg:py-3 xl:py-6" />
		</div>
		<div class="w-full sm:w-2/3 lg:w-full flex flex-col p-1.5 mt-2 bg-gray-50 dark:bg-gray-600 shadow-md rounded-lg">
			<input 
				v-model="ticket.title" 
				type="text" 
				class="input" 
				placeholder="Title...">

			<div class="flex mt-2">
				<SelectInput 
					v-model="ticket.type"
					:options="ticketTypeOptions"
					class="mr-1" />
				<SelectInput 
					v-model="ticket.severity"
					:options="ticketSeverityOptions"
					class="ml-1" />
			</div>
			<textarea 
				v-model="ticket.description" 
				class="w-full h-24 lg:h-40 mt-2 pl-1 bg-gray-200 dark:bg-gray-500 rounded resize-none lg:text-lg dark:text-gray-50" 
				placeholder="Description...">
			</textarea>
			<button 
				@click="postTicket()"
				class="w-1/2 mx-auto h-7 lg:h-9 mt-1.5 rounded bg-gray-300 dark:bg-gray-700 dark:text-gray-50 font-bold">
				Post Ticket
			</button>
		</div>
		<div class="hidden">
			<!-- This is for the stats stuff -->
		</div>
	</div>
	<div class="w-full flex justify-center px-2 mt-2 mb-5 lg:mb-2">
		<div class="w-full h-full min-h-80 sm:w-2/3 lg:w-full flex flex-col p-1.5 pb-0 bg-gray-50 dark:bg-gray-600 rounded-lg shadow-md">
			<div class="flex flex-col">
				<div class="flex">
					<SelectInput 
						v-model="queryType.type"
						:options="queryType.options"
						class="mr-1" />
					<SelectInput 
						v-model="querySeverity.severity"
						:options="querySeverity.options"
						class="ml-1" />
				</div>
				<div class="flex mt-2">
					<input 
						v-model="query"
						type="text" 
						class="input mr-2" 
						placeholder="Search...">
					<svg 
						@click="filterTickets()"
						class=" text-gray-700 dark:text-gray-300 fill-current w-8 h-8 my-auto mx-auto mr-1 cursor-pointer" 
						viewBox="0 0 512 512">
						<path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128c0-70.7 57.2-128 128-128c70.7 0 128 57.2 128 128c0 70.7-57.2 128-128 128z">
						</path>
					</svg>
				</div>
			</div>
			<div class="w-full flex-grow px-1 mt-2 overflow-y-auto">
				<TicketItem 
					v-for="ticket in filteredTickets" 
					:key="ticket._id" 
					v-bind="ticket"
					class="bg-gray-100 dark:bg-gray-700 mb-2.5" />
			</div>
		</div>
	</div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import ProjectList from '../components/ProjectList.vue';
import TicketItem from '../components/TicketItem.vue';
import SelectInput from '../components/SelectInput.vue';
import { getProjectNames } from '../api/project';
import { getTickets, postTicket } from '../api/ticket';

export default Vue.extend({
	name: "Tickets",
	components: {
		ProjectList,
		TicketItem,
		SelectInput,
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
				name: '',
			}],
			selectedProject: {
				_id: '',
				name: '',
			},
			query: '',
			queryType: {
				type: 'both',
				options: [
					'both',
					'bug',
					'suggestion',
				],
			},
			querySeverity: {
				severity: 'all',
				options: [
					'all',
					'low',
					'medium',
					'high',
					'severe',
				],
			},
			ticket: {
				title: '',
				type: 'bug',
				severity: 'low',
				description: '',
			},
			ticketTypeOptions: [
				'bug',
				'suggestion',
			],
			ticketSeverityOptions: [
				'low',
				'medium',
				'high',
				'severe',
			],
			tickets: [{
				_id: '',
				title: '',
				createdBy: '',
				dateCreated: '',
				type: '',
				severity: '',
				description: '',
			}],
			filteredTickets: [{
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
		this.projects = await getProjectNames(this.JWT);
		this.selectedProject = this.projects[0];
		this.tickets = await getTickets(this.projects[0]._id, this.JWT);
		this.filteredTickets = this.tickets;
	},
	methods: {
		async changeProject(project: { _id: string; name: string }) {
			this.selectedProject = project;
			this.tickets = await getTickets(project._id, this.JWT);
			this.filteredTickets = this.tickets;
		},
		async postTicket() {
			await postTicket(this.ticket, this.selectedProject._id, this.JWT);

			this.tickets = await getTickets(this.selectedProject._id, this.JWT);
			this.filteredTickets = this.tickets;
			this.ticket.title = '';
			this.ticket.description = '';
		},
		filterTickets() {
			if (!this.query) {
				this.filteredTickets = this.tickets;
			} else {
				this.filteredTickets = this.tickets.filter(
					(ticket: {
						title: string;
						createdBy: string;
						description: string;
					}) => ticket.createdBy.toLowerCase().includes(this.query.toLowerCase()) ||
							ticket.title.toLowerCase().includes(this.query.toLowerCase()) ||
							ticket.description.toLowerCase().includes(this.query.toLowerCase())
				);
			}
			if (this.queryType.type !== 'both') {
				this.filteredTickets = this.filteredTickets.filter(
					(ticket: {
							type: string;
						}) => ticket.type === this.queryType.type
				);
			}
			if (this.querySeverity.severity !== 'all') {
				this.filteredTickets = this.filteredTickets.filter(
					(ticket: {
							severity: string;
						}) => ticket.severity === this.querySeverity.severity
				);
			}
		}
	}
})
</script>

<style lang="postcss" scoped>
.input {
	@apply flex-grow rounded h-9 lg:h-11 pl-1 bg-gray-200 dark:bg-gray-500 text-lg lg:text-2xl dark:text-gray-50;
}
</style>