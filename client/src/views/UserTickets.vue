<template>
<div class="w-full flex flex-col">
	<div 
		v-if="isPostTicketActive" 
		class="fixed z-20 top-0 w-screen h-screen bg-primary-800 flex flex-col px-2" >

		<svg @click="isPostTicketActive = false" class="h-10 w-10 ml-auto mt-2 text-gray-light-50 fill-current cursor-pointer" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z"></path></svg>
		<h2 class="text-gray-light-50 mt-10 text-xl font-bold">Post New Ticket</h2>
		<div class="mt-2 flex">
			<input 
				type="text"
				v-model="ticket.title"
				placeholder="Title..."
				class="rounded-lg bg-gray-light-100 h-9 pl-1 flex-grow">
			<input 
				type="file"
				@change="onFileSelected"
				ref="fileInput"
				class="hidden">
			<button @click="triggerImageInput()" class="px-2 py-1 bg-primary-300 text-gray-light-50 rounded-lg ml-2">{{ attachFileLabel }}</button>
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
		<textarea v-model="ticket.description" class="mt-2 resize-none h-20 pl-1 rounded-lg" placeholder="Description..."></textarea>
		<button
			@click="submitTicket()"
			class="mt-2 bg-primary-300 px-2 py-1 rounded-lg text-gray-light-50" >Post Ticket to {{ selectedProject.name }}</button>
	</div>
	<div class="xl:hidden md:flex py-1.5 px-2.5 border-b border-gray-light-300">
		<div class="flex flex-col md:w-1/2">
			<div class="flex justify-between">
				<span class="text-gray-dark-400">Select Project</span>
				<span class="md:hidden text-gray-dark-300">Role: <span class="text-primary-600">{{ selectedProject.role }}</span></span>
			</div>
			<ProjectSelector 
				:projectList="projectList"
				:startingProject="selectedProject" 
				@input="changeProject($event)"
				class="my-1" />
		</div>
		<span class="hidden md:inline mx-auto my-auto text-gray-dark-300 text-xl">Project Role: <span class="text-primary-600">{{ selectedProject.role }}</span></span>
	</div>
	<button @click="isPostTicketActive = true" class="bg-gray-light-100 py-0.5 px-1.5 rounded-lg text-xl ml-2 mr-auto text-primary-800">Post Ticket</button>
	<div class="rounded-lg bg-gray-light-100 shadow-md mx-2 mt-2 p-1 flex">
		<input class="flex-grow mr-1.5 bg-gray-light-100 border-b border-gray-dark-700 rounded-none" v-model="query" type="text" placeholder="Query...">
		<button @click="filterTickets()" class="font-bold bg-primary-800 text-gray-light-50 py-1 px-2 rounded-lg">Search</button>
	</div>
	<div class="flex justify-evenly lg:justify-start my-2 lg:mx-2">
		<div class="flex lg:flex-col lg:w-1/3 lg:mr-1">
			<span 
				class="status-btn lg:mr-auto" 
				:class="[(this.selectedTicketStatus === 'open' || isDesktop) ? 'bg-blue-500': 'bg-gray-dark-100']"
				@click="changeTicketFilter('open')">
				Open
			</span>
			<div v-if="isDesktop" class="mt-2">
				<TicketItem 
					v-for="ticket in openTickets" 
					:key="ticket._id" 
					:ticket="ticket" 
					class="mb-2" />
			</div>
		</div>
		<div class="flex lg:flex-col lg:w-1/3 lg:mx-1">
			<span 
				class="status-btn lg:mr-auto" 
				:class="[(this.selectedTicketStatus === 'in progress' || isDesktop) ? 'bg-green-500': 'bg-gray-dark-100']"
				@click="changeTicketFilter('in progress')">
				In Progress
			</span>
			<div v-if="isDesktop" class="mt-2">
				<TicketItem 
					v-for="ticket in inProgressTickets" 
					:key="ticket._id" 
					:ticket="ticket" 
					class="mb-2" />
			</div>
		</div>
		<div class="flex lg:flex-col lg:w-1/3 lg:ml-1">
			<span 
				class="status-btn lg:mr-auto" 
				:class="[(this.selectedTicketStatus === 'need info' || isDesktop) ? 'bg-orange-500': 'bg-gray-dark-100']"
				@click="changeTicketFilter('need info')">
				Need Info
			</span>
			<div v-if="isDesktop" class="mt-2">
				<TicketItem 
					v-for="ticket in needInfoTickets" 
					:key="ticket._id" 
					:ticket="ticket" 
					class="mb-2" />
			</div>
		</div>
	</div>
	<div v-if="!isDesktop">
		<TicketItem 
			v-for="ticket in selectedTickets" 
			:key="ticket._id" 
			:ticket="ticket" 
			class="mx-2 mb-2" />
	</div>
</div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import TicketItem from '../components/TicketItem.vue';
import ProjectSelector from '../components/ProjectSelector.vue';
import SelectorInput from '../components/SelectorInput.vue';
import { getAssignedTickets, postTicket, attachImageToTicket } from '../api/ticket';

export default Vue.extend({
	name: 'Dashboard',
	components: {
		ProjectSelector,
		SelectorInput,
		TicketItem,
	},
	props: {
		jwt: {
			type: String,
			required: true,
		},
		selectedProject: {
			type: Object as PropType<{
				_id: '';
				name: '';
				role: '';
			}>,
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
			isDesktop: window.innerWidth >= 1024 ? true: false,
			selectedTicketStatus: 'open',
			isPostTicketActive: false,
			query: '',
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
			ticket: {
				title: '',
				type: '',
				severity: '',
				description: ''
			},
			FILE: null,
			tickets: null,
			filteredTickets: null,
			openTickets: null,
			inProgressTickets: null,
			needInfoTickets: null,
			selectedTickets: null,
		}
	},
	async created() {
		this.tickets = await getAssignedTickets(this.selectedProject._id, this.jwt);
		this.filteredTickets = this.tickets;
		this.openTickets = this.filterTicketsStatus('open');
		this.inProgressTickets = this.filterTicketsStatus('in progress');
		this.needInfoTickets = this.filterTicketsStatus('need info');
		this.selectedTickets = this.openTickets;
	},
	mounted() {
		window.onresize = () => {
			this.isDesktop = window.innerWidth >= 1024 ? true: false;
		}
	},
	computed	: {
		attachFileLabel(): string {
			if (this.FILE?.name) {
				return this.FILE.name.substr(0, 10) + '...';
			} else {
				return "Attach Image"
			}
		}
	},
	watch: {
		selectedProject: async function() {
			this.tickets = await getAssignedTickets(this.selectedProject._id, this.jwt);
			this.filteredTickets = this.tickets;
			this.openTickets = this.filterTicketsStatus('open');
			this.inProgressTickets = this.filterTicketsStatus('in progress');
			this.needInfoTickets = this.filterTicketsStatus('need info');
			this.changeTicketFilter(this.selectedTicketStatus);
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
		async changeProject(project: { _id: string; name: string; role: string}) {
			this.$emit('changeProject', project);
			this.tickets = await getAssignedTickets(project._id, this.jwt);
			this.filteredTickets = this.tickets;
			this.openTickets = this.filterTicketsStatus('open');
			this.inProgressTickets = this.filterTicketsStatus('in progress');
			this.needInfoTickets = this.filterTicketsStatus('need info');
			this.changeTicketFilter(this.selectedTicketStatus);
		},
		changeTicketFilter(status: string) {
			this.selectedTicketStatus = status;
			if (status === 'open') {
				this.selectedTickets = this.openTickets;
			} else if (status === 'in progress') {
				this.selectedTickets = this.inProgressTickets;
			} else {
				this.selectedTickets = this.needInfoTickets;
			}
		},
		filterTicketsStatus(status: string) {
			return this.filteredTickets.filter(
				(ticket: {
					status: string;
				}) => ticket.status.toLowerCase() === status
			);
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
			this.openTickets = this.filterTicketsStatus('open');
			this.inProgressTickets = this.filterTicketsStatus('in progress');
			this.needInfoTickets = this.filterTicketsStatus('need info');
			this.changeTicketFilter(this.selectedTicketStatus);
		}
	}
});
</script>

<style lang="postcss" scoped>
.status-btn {
	@apply rounded-xl text-gray-light-50 py-1 px-2 shadow-md cursor-pointer lg:cursor-default transition-colors duration-300;
}
</style>