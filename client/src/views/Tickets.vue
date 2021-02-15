<template>
<div class="flex flex-col w-screen">
	<div class="w-full px-2 pt-2">
		<div class="bg-gray-50 dark:bg-gray-600 shadow-md rounded-lg">
			<ProjectList 
				:projects="projects" 
				:selectedProject="selectedProject.name" 
				@changeProject="changeProject($event)"
				class="lg:px-2 py-2 lg:py-3 xl:py-6" />
		</div>
		<div class="flex flex-col p-1.5 mt-2 bg-gray-50 dark:bg-gray-600 shadow-md rounded-lg">
			<input 
				v-model="ticket.title" 
				type="text" 
				class="w-full rounded h-9 pl-1.5 bg-gray-200 dark:bg-gray-500 text-lg dark:text-gray-50 font-bold" 
				placeholder="Title...">

			<div class="flex mt-2">
				<select 
					v-model="ticket.type" 
					name="type" 
					id="type" 
					class="flex-grow mr-1 bg-gray-200 dark:bg-gray-500 rounded h-7 dark:text-gray-50 text-lg font-mono">

					<option value="bug">bug</option>
					<option value="suggestion">suggestion</option>
				</select>
				<select 
					v-model="ticket.severity" 
					name="severity" 
					id="type" 
					class="flex-grow ml-1 bg-gray-200 dark:bg-gray-500 rounded h-7 dark:text-gray-50 text-lg font-mono">

					<option value="low">low</option>
					<option value="medium">medium</option>
					<option value="high">high</option>
					<option value="severe">severe</option>
				</select>
			</div>
			<textarea 
				v-model="ticket.description" 
				class="w-full h-24 mt-2 pl-1 bg-gray-200 dark:bg-gray-500 rounded resize-none dark:text-gray-50" 
				placeholder="Description...">
			</textarea>
			<button 
				@click="postTicket()"
				class="w-1/2 mx-auto h-7 mt-1.5 rounded bg-gray-300 dark:bg-gray-700 dark:text-gray-50 font-bold">
				Post Ticket
			</button>
		</div>
		<div class="hidden">
			<!-- This is for the stats stuff -->
		</div>
	</div>
	<div class="w-full px-2 mt-2 mb-5">
		<div class="p-1.5 bg-gray-50 dark:bg-gray-600 rounded-lg">
			<div class="flex justify-between">
				<input type="text" class="w-7/12 mr-1 rounded h-9 pl-1 bg-gray-200 dark:bg-gray-500 text-lg dark:text-gray-50" placeholder="Search...">
				<div class="w-5/12 ml-1 rounded">
					<p> </p>
				</div>
			</div>
			<div class="w-full h-96 px-1 mt-2 overflow-y-auto">
				<TicketItem 
					v-for="ticket in tickets" 
					:key="ticket._id" 
					v-bind="ticket"
					class="bg-gray-100 mb-2.5 shadow-none" />
			</div>
		</div>
	</div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import ProjectList from '../components/ProjectList.vue';
import TicketItem from '../components/TicketItem.vue';
import { getProjectNames } from '../api/project';
import { getTickets, postTicket } from '../api/ticket';

export default Vue.extend({
	name: "Tickets",
	components: {
		ProjectList,
		TicketItem,
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
			ticket: {
				title: '',
				type: 'bug',
				severity: 'low',
				description: '',
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
		this.projects = await getProjectNames(this.JWT);
		this.selectedProject = this.projects[0];
		this.tickets = await getTickets(this.projects[0]._id, this.JWT);
	},
	methods: {
		async changeProject(project: { _id: string; name: string }) {
			this.selectedProject = project;
			this.tickets = await getTickets(project._id, this.JWT);
		},
		async postTicket() {
			await postTicket(this.ticket, this.selectedProject._id, this.JWT);
			this.tickets = await getTickets(this.selectedProject._id, this.JWT);
			this.ticket = {
				title: '',
				type: 'bug',
				severity: 'low',
				description: '',
			};
		}
	}
})
</script>