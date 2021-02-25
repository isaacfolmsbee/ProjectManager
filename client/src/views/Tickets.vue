<template>
<div class="w-screen flex flex-col items-center pt-3 px-2">
	<ProjectList 
		:projects="projectList" 
		:selectedProject="selectedProject.name"
		class="w-full shadow-md"
		@changeProject="changeProject($event)" />

	<div class="flex flex-col bg-gray-dark-400 w-full rounded-lg p-1 mt-3 shadow-md">
		<div class="flex h-8">
			<input v-model="ticketTitle" type="text" placeholder="Title..." class="flex-grow mr-2 pl-1 rounded-lg">
			<input 
				class="hidden" 
				type="file" 
				@change="onFileSelected"
				ref="fileInput" >

			<button @click="triggerImageInput()" class="w-18 px-1 bg-gray-light-50 rounded-lg overflow-ellipsis">{{ attachFileLabel }}</button>
		</div>
		<div class="relative flex mt-2">
			<div class="w-1/2 mr-1">
				<div id="select-box" class="relative flex flex-col">
					<div 
						id="options-container" 
						class="absolute top-9 w-full max-h-0 opacity-0 order-1 bg-primary-400 text-gray-light-50 transition-all duration-500 rounded-lg overflow-hidden"
						:class="{ 'max-h-screen opacity-100': (activeSelector ==  'type') }" >

						<div id="option" class="py-1 px-2 cursor-pointer" @click="selectTypeValue('bug')">
							<input type="radio" id="bug" name="category" class="hidden">
							<label for="bug" class="cursor-pointer">bug</label>
						</div>
						<div id="option" class="py-1 px-2 cursor-pointer" @click="selectTypeValue('suggestion')">
							<input type="radio" id="suggestion" name="category" class="hidden">
							<label for="suggestion" class="cursor-pointer">suggestion</label>
						</div>
					</div>
					<div id="selected" @click="toggleSelector('type')" class="cursor-pointer relative bg-primary-400 mb-2 rounded-lg text-gray-light-50 py-1 px-2">
						<span v-if="typeSelected">
							{{ typeSelected }}
						</span>
						<span v-else>
							Select Type
						</span>
						<svg :class="{ '-rotate-90': (activeSelector ==  'type') }" class="absolute top-0 right-0 w-8 h-8 text-gray-light-50 fill-current transform rotate-90 transition-transform duration-500" viewBox="0 0 24 24"><path d="M6.5 17.5l8.25-5.5L6.5 6.5l1-1.5L18 12L7.5 19z"></path></svg>
					</div>
				</div>
			</div>
			<div class="w-1/2 ml-1">
				<div id="select-box" class="relative flex flex-col">
					<div 
						id="options-container" 
						class="absolute top-9 w-full max-h-0 opacity-0 order-1 bg-primary-400 text-gray-light-50 transition-all duration-500 rounded-lg overflow-hidden"
						:class="{ 'max-h-screen opacity-100': (activeSelector ==  'severity') }" >

						<div id="option" class="py-1 px-2 cursor-pointer" @click="selectSeverityValue('low')">
							<input type="radio" id="low" name="category" class="hidden">
							<label for="low" class="cursor-pointer">low</label>
						</div>
						<div id="option" class="py-1 px-2 cursor-pointer" @click="selectSeverityValue('medium')">
							<input type="radio" id="medium" name="category" class="hidden">
							<label for="medium" class="cursor-pointer">medium</label>
						</div>
						<div id="option" class="py-1 px-2 cursor-pointer" @click="selectSeverityValue('high')">
							<input type="radio" id="high" name="category" class="hidden">
							<label for="high" class="cursor-pointer">high</label>
						</div>
						<div id="option" class="py-1 px-2 cursor-pointer" @click="selectSeverityValue('critical')">
							<input type="radio" id="critical" name="category" class="hidden">
							<label for="critical" class="cursor-pointer">critical</label>
						</div>
					</div>
					<div id="selected" @click="toggleSelector('severity')" class="cursor-pointer relative bg-primary-400 mb-2 rounded-lg text-gray-light-50 py-1 px-2">
						<span v-if="severitySelected">
							{{ severitySelected }}
						</span>
						<span v-else>
							Select Severity
						</span>
						<svg :class="{ '-rotate-90': (activeSelector ==  'severity') }" class="absolute top-0 right-0 w-8 h-8 text-gray-light-50 fill-current transform rotate-90 transition-transform duration-500" viewBox="0 0 24 24"><path d="M6.5 17.5l8.25-5.5L6.5 6.5l1-1.5L18 12L7.5 19z"></path></svg>
					</div>
				</div>
			</div>
		</div>
		<textarea v-model="ticketDescription" class="rounded-lg resize-none pl-1 h-20" placeholder="Description..."></textarea>
		<button class="mx-auto py-1 px-2 bg-primary-400 font-bold text-gray-light-50 mt-2 rounded-lg" @click="submitTicket">Post Ticket to {{ selectedProject.name }}</button>
	</div>
	<ticket-container class="w-full mt-3">
		<template v-slot:header>
			<div class="flex p-1 h-9">
				<input v-model="query" class="rounded-lg pl-1 flex-grow" type="text" placeholder="Query...">
				<button @click="filterTickets()" class="mx-2 px-2 bg-gray-dark-500 rounded-lg text-gray-light-50 font-bold">Search</button>
			</div>
			<hr>
			<div class="flex whitespace-nowrap overflow-x-auto pl-1 py-0.5">
				<button 
					:class="[(selectedFilter === 'Your Tickets') ? 'text-gray-dark-600 font-bold' : 'text-gray-light-50']" 
					class="button"
					@click="getFilteredTickets('Your Tickets')" >
					Your Tickets
				</button>
				<button 
					:class="[(selectedFilter === 'Unassigned Tickets') ? 'text-gray-dark-600 font-bold' : 'text-gray-light-50']"
					class="button"
					@click="getFilteredTickets('Unassigned Tickets')" >
					Unassigned Tickets
				</button>
				<button 
					:class="[(selectedFilter === 'Active Tickets') ? 'text-gray-dark-600 font-bold' : 'text-gray-light-50']"
					class="button"
					@click="getFilteredTickets('Active Tickets')" >
					Active Tickets
				</button>
				<button 
					:class="[(selectedFilter === 'Closed Tickets') ? 'text-gray-dark-600 font-bold' : 'text-gray-light-50']"
					class="button"
					@click="getFilteredTickets('Closed Tickets')" >
					Closed Tickets
				</button>
			</div>
		</template>
		<template v-slot:body>
			<TicketItem 
				v-for="ticket in filteredTickets" 
				:key="ticket._id" 
				:ticket="ticket" 
				class="mb-1 last:mb-0"/>
		</template>
	</ticket-container>
</div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import ProjectList from '../components/ProjectList.vue';
import TicketContainer from '../components/TicketContainer.vue';
import TicketItem from '../components/TicketItem.vue';
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
		TicketContainer,
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
			selectedFilter: 'Your Tickets',
			ticketTitle: '',
			ticketDescription: '',
			typeSelected: '',
			severitySelected: '',
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
		selectTypeValue(value: string) {
			this.typeSelected = value;
			this.activeSelector = '';
		},
		selectSeverityValue(value: string) {
			this.severitySelected = value;
			this.activeSelector = '';
		},
		// eslint-disable-next-line
		onFileSelected(event: any) {
			this.FILE = event.target.files[0];
		},
		async submitTicket() {
			const ticketID = await postTicket(
			{
				project: this.selectedProject._id,
				title: this.ticketTitle,
				type: this.typeSelected,
				severity: this.severitySelected,
				description: this.ticketDescription,
			}, 
			this.jwt);
			
			if (this.FILE) {
				const formData = new FormData();
				formData.append('ticketImg', this.FILE, this.FILE.name);
				await attachImageToTicket(ticketID, formData, this.jwt);
			}

			this.ticketTitle = '';
			this.typeSelected = '';
			this.severitySelected = '';
			this.ticketDescription = '';
			
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
	@apply mx-2 text-lg;
}
</style>