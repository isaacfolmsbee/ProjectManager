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
</div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import ProjectList from '../components/ProjectList.vue';
import { postTicket, attachImageToTicket } from '../api/ticket'

export default Vue.extend({
	name: "Tickets",
	components: {
		ProjectList,
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
		}
	},
	created() {
		this.selectedProject = {
			_id: this.projectList[0]._id,
			name: this.projectList[0].name,
		};
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
			const formData = new FormData();
			
			formData.append('ticketImg', this.FILE, this.FILE.name);

			const ticketID = await postTicket(
			{
				project: this.selectedProject._id,
				title: this.ticketTitle,
				type: this.typeSelected,
				severity: this.severitySelected,
				description: this.ticketDescription,
			}, 
			this.jwt);

			await attachImageToTicket(ticketID, formData, this.jwt);

			this.ticketTitle = '';
			this.typeSelected = '';
			this.severitySelected = '';
			this.ticketDescription = '';
			
		},
		async changeProject(project: { _id: string; name: string}) {
			this.selectedProject = project;
		},
	}
})
</script>