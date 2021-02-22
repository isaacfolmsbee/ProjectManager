<template>
<div class="w-screen flex flex-col items-center pt-3 px-2">
	<ProjectList 
		:projects="projectList" 
		:selectedProject="selectedProject.name"
		class="w-full shadow-md"
		@changeProject="changeProject($event)" />

	<ticket-container class="mt-3 w-full shadow-md">
		<template v-slot:header>
			<span class="inline-block text-lg pl-2 py-1 text-gray-light-50">
				Recent Tickets
			</span>
		</template>
		<template v-slot:body>
			<TicketItem 
				v-for="ticket in tickets" 
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
import { getTickets } from '../api/ticket';

export default Vue.extend({
	name: 'Dashboard',
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
			selectedProject: {
				_id: '',
				name: '',
			},
			tickets: [],
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