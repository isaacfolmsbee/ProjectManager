<template>
<div class="w-screen flex flex-col">
	<ProjectList 
		:projects="projectList" 
		:selectedProject="selectedProject.name"
		class="w-full bg-gray-light-300"
		@changeProject="changeProject($event)" />

	<div class="flex flex-col px-1.5">
		<h2 class="my-2 font-bold text-xl text-gray-dark-400">Post a New Ticket</h2>
		<div class="flex h-8">
			<input 
				v-model="ticket.title" 
				type="text" 
				placeholder="Title..." 
				class="flex-grow mr-2 pl-1 bg-gray-dark-400 text-gray-light-100 rounded-none" >
			<input 
					class="hidden" 
					type="file" 
					@change="onFileSelected"
					ref="fileInput" >
			<button @click="triggerImageInput()" class="w-18 px-2 text-sm bg-gray-dark-400 text-gray-light-100 overflow-ellipsis">{{ attachFileLabel }}</button>
		</div>
		<div class="flex mt-2">
			<SelectorInput 
				v-model="ticket.type"
				:name="'type'" 
				:options="typeOptions"
				class="w-1/2 mr-1" />
			<SelectorInput 
				v-model="ticket.severity"
				:name="'severity'" 
				:options="severityOptions"
				class="w-1/2 ml-1" />
		</div>
		<textarea v-model="ticket.description" class="w-full mt-2 resize-none pl-1 h-20 bg-gray-dark-400 text-gray-light-100 rounded-none" placeholder="Description..."></textarea>
		<button class="mx-auto py-1 px-2 bg-gray-dark-400 font-bold text-gray-light-100 mt-2" @click="submitTicket()">Post Ticket to {{ selectedProject.name }}</button>
	</div>
	<div class="bg-gray-light-300 mt-2">
		<h2 class="my-2 pl-1.5 font-bold text-xl text-gray-dark-400">Sort Through Tickets</h2>
		<div class="flex px-1.5 h-7">
			<input v-model="query" class="pl-1 flex-grow bg-gray-dark-400 text-gray-light-100 rounded-none" type="text" placeholder="Query...">
			<button @click="filterTickets()" class="ml-2 px-2 bg-gray-dark-400 text-gray-light-100 font-bold">Search</button>
		</div>
		<hr class="mt-1.5 border-gray-dark-400">
		<div class="flex whitespace-nowrap overflow-x-auto pl-1 mt-1.5 pb-1.5">
				<button 
					:class="[(selectedFilter === 'Your Tickets') ? 'text-gray-light-100 bg-gray-dark-400' : 'text-gray-dark-400']" 
					class="button"
					@click="getFilteredTickets('Your Tickets')" >
					Your Tickets
				</button>
				<button 
					:class="[(selectedFilter === 'Unassigned Tickets') ? 'text-gray-light-100 bg-gray-dark-400' : 'text-gray-dark-400']"
					class="button"
					@click="getFilteredTickets('Unassigned Tickets')" >
					Unassigned Tickets
				</button>
				<button 
					:class="[(selectedFilter === 'Active Tickets') ? 'text-gray-light-100 bg-gray-dark-400' : 'text-gray-dark-400']"
					class="button"
					@click="getFilteredTickets('Active Tickets')" >
					Active Tickets
				</button>
				<button 
					:class="[(selectedFilter === 'Closed Tickets') ? 'text-gray-light-100 bg-gray-dark-400' : 'text-gray-dark-400']"
					class="button"
					@click="getFilteredTickets('Closed Tickets')" >
					Closed Tickets
				</button>
			</div>
	</div>
	<TicketItem 
		v-for="ticket in filteredTickets" 
		:key="ticket._id" 
		:ticket="ticket" 
		class="odd:bg-gray-light-300"/>
</div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import ProjectList from '../components/ProjectList.vue';
import TicketItem from '../components/TicketItem.vue';
import SelectorInput from '../components/SelectorInput.vue';
import { postTicket, 
	attachImageToTicket, 
	getAssignedTickets, 
	getUnassignedTickets, 
	getActiveTickets, 
	getClosedTickets } from '../api/ticket'

export default Vue.extend({
	name: "Tickets",
	components: {
		ProjectList,
		TicketItem,
		SelectorInput,
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
			ticket: {
				title: '',
				type: '',
				severity: '',
				description: ''
			},
			selectedFilter: 'Your Tickets',
			typeOptions: [
				'suggestion',
				'bug',
			],
			severityOptions: [
				'low',
				'medium',
				'high',
				'critical',
			],
			FILE: null,
			selectedProject: {
				_id: '',
				name: '',
			},
			activeSelector: '',
			tickets: null,
			filteredTickets: null,
			query: '',
		}
	},
	async created() {
		this.selectedProject = {
			_id: this.projectList[0]._id,
			name: this.projectList[0].name,
		};
		await this.updateTickets();
		this.filteredTickets = this.tickets;
	},
	computed: {
		attachFileLabel(): string {
			if (this.FILE?.name) {
				return this.FILE.name.substr(0, 10) + '...';
			} else {
				return "Attach Image"
			}
		}
	},
	methods: {
		triggerImageInput() {
			// This code was to remove the Vetur error about .click()
			// not existing on fileInput
			// eslint-disable-next-line
			const fileInput = this.$refs.fileInput as any;
			fileInput.click();
		},
		toggleSelector(selector: string) {
			if (selector == 'type') {
				if (this.activeSelector == 'type') {
					this.activeSelector = '';
				} else {
					this.activeSelector = 'type';
				}
			} else if (selector == 'severity') {
				if (this.activeSelector == 'severity') {
					this.activeSelector = '';
				} else {
					this.activeSelector = 'severity';
				}
			}
		},
		// eslint-disable-next-line
		onFileSelected(event: any) {
			this.FILE = event.target.files[0];
		},
		async submitTicket() {
			const ticketID = await postTicket(
			{
				project: this.selectedProject._id,
				title: this.ticket.title,
				type: this.ticket.type,
				severity: this.ticket.severity,
				description: this.ticket.description,
			}, 
			this.jwt);
			
			if (this.FILE) {
				const formData = new FormData();
				formData.append('ticketImg', this.FILE, this.FILE.name);
				await attachImageToTicket(ticketID, formData, this.jwt);
				this.FILE = null;
			}

			this.ticket = {
				title: '',
				type: '',
				severity: '',
				description: ''
			};
		},
		async changeProject(project: { _id: string; name: string}) {
			this.selectedProject = project;
			await this.updateTickets();
			this.filteredTickets = this.tickets;
		},
		async updateTickets() {
			if (this.selectedFilter === 'Your Tickets') {
				this.tickets = await getAssignedTickets(this.selectedProject._id, this.jwt);
			} else if (this.selectedFilter === 'Unassigned Tickets') {
				this.tickets = await getUnassignedTickets(this.selectedProject._id, this.jwt);
			} else if (this.selectedFilter === 'Active Tickets') {
				this.tickets = await getActiveTickets(this.selectedProject._id, this.jwt);
			} else {
				this.tickets = await getClosedTickets(this.selectedProject._id, this.jwt);
			}
			this.filteredTickets = this.tickets;
		},
		async getFilteredTickets(action: string) {
			this.selectedFilter = action;

			if (action === 'Your Tickets') {
				this.tickets = await getAssignedTickets(this.selectedProject._id, this.jwt);
			} else if (action === 'Unassigned Tickets') {
				this.tickets = await getUnassignedTickets(this.selectedProject._id, this.jwt);
			} else if (action === 'Active Tickets') {
				this.tickets = await getActiveTickets(this.selectedProject._id, this.jwt);
			} else {
				this.tickets = await getClosedTickets(this.selectedProject._id, this.jwt);
			}
			this.filteredTickets = this.tickets;
		},
		filterTickets() {
			if (!this.query) {
				this.filteredTickets = this.tickets;
			} else {
				this.filteredTickets = this.tickets.filter(
					(ticket: {
						title: string;
						description: string;
						severity: string;
						type: string;
					})  => ticket.title.toLowerCase().includes(this.query.toLowerCase()) ||
								ticket.description.toLowerCase().includes(this.query.toLowerCase()) ||
								ticket.severity.toLowerCase().includes(this.query.toLowerCase()) ||
								ticket.type.toLowerCase().includes(this.query.toLowerCase())
							
				);
			}
		}
	}
})
</script>

<style lang="postcss" scoped>
.button {
	@apply mx-0.5 text-lg px-1.5 leading-none py-1;
}
</style>