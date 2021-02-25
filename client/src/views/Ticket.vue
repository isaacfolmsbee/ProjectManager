<template>
<div class="w-screen pt-3 px-2">
	<div v-if="ticket" class="flex flex-col bg-gray-dark-500 rounded-lg shadow-md py-1 px-2">
		<div class="flex">
			<span class="text-gray-light-50 font-bold text-xl flex-grow">
				{{ ticket.title }}
			</span>
			<span v-if="ticket.attachment" class="pl-1">
				<a :href="'/uploads/' + ticket.attachment"
					target="_blank" rel="noopener noreferrer" >
					<svg class="h-8 w-8 fill-current text-gray-light-50" viewBox="0 0 384 512"><path d="M369.9 97.9L286 14C277 5 264.8-.1 252.1-.1H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V131.9c0-12.7-5.1-25-14.1-34zM332.1 128H256V51.9l76.1 76.1zM48 464V48h160v104c0 13.3 10.7 24 24 24h104v288H48zm32-48h224V288l-23.5-23.5c-4.7-4.7-12.3-4.7-17 0L176 352l-39.5-39.5c-4.7-4.7-12.3-4.7-17 0L80 352v64zm48-240c-26.5 0-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48s-21.5-48-48-48z"></path></svg>
				</a>
			</span>
		</div>
		<span class="text-gray-light-50 mt-2">
			{{ ticket.description }}
		</span>
		<button 
			@click="isManageOpen = true"
			class="mt-1.5 py-1 px-4 bg-primary-400 rounded-lg w-min whitespace-nowrap mx-auto font-bold text-gray-light-50">
			Manage Ticket
		</button>
		<div class="mt-2 flex justify-between text-xs text-gray-light-600">
			<span>
				{{ ticket.createdBy }} / {{ dateFormatted }}
			</span>
			<span>
				{{ ticket.type }} / {{ ticket.severity }}
			</span>
			<button 
				@click="isHistoryOpen = true"
				class="text-primary-200 cursor-pointer">
				Ticket History
			</button>
		</div>
		<hr class="mt-1 border-gray-dark-600">
		<textarea 
			v-model="comment"
			placeholder="Add a comment..."
			class="mt-2 mx-0.5 rounded-lg pl-1 resize-none h-24" >
		</textarea>
		<button 
			class="w-min mx-auto mt-2 py-1 px-4 rounded-lg bg-primary-400 text-gray-light-50 font-bold"
			@click="postComment()" >
			Submit
		</button>
		<span class="text-gray-light-800 text-sm mt-1.5">Comments</span>
		<div 
			v-for="comment in ticket.comments"
			:key="comment.dateCreated"
			class="bg-gray-dark-600 rounded-lg my-1 py-1 px-1.5 flex flex-col" >
			<span class="text-xs text-gray-light-600">
				John Doe / {{ comment.dateCreated.substr(0, 10) }}
			</span>
			<span class="text-gray-light-300">
				{{ comment.text }}
			</span>
		</div>
	</div>
	<div 
		v-if="isHistoryOpen"
		class="fixed top-16 left-0 w-full h-full px-3 flex flex-col items-center bg-primary-400">	
		
		<svg 
			@click="isHistoryOpen = false"
			class="ml-auto w-10 h-10 fill-current text-gray-light-50 cursor-pointer" 
			viewBox="0 0 24 24">
			<path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z">
			</path>
		</svg>
		<div 
			v-for="record in ticket.history"
			:key="record.dateChanged"
			class="bg-gray-light-50 rounded-lg mt-2 p-1 flex flex-col  w-full" >

			<span class="text-xs text-gray-dark-600">
				{{ record.changedBy }} / {{ record.dateChanged.substr(0, 10) }}
			</span>
			<div 
				v-for="change in record.changes"
				:key="change.propertyChanged"
				class="bg-gray-dark-400 rounded-lg flex justify-evenly p-0.5 text-gray-light-50 mt-1" >
				
				<div class="flex flex-col items-center">
					<span class="text-gray-light-300">
						Property
					</span>
					<span class="font-bold">
						{{ change.propertyChanged }}
					</span>
				</div>
				<div class="flex flex-col items-center">
					<span class="text-gray-light-300">
						Old Value
					</span>
					<span class="font-bold">
						{{ change.oldValue }}
					</span>
				</div>
				<div class="flex flex-col items-center">
					<span class="text-gray-light-300">
						New Value
					</span>
					<span class="font-bold">
						{{ change.newValue }}
					</span>
				</div>
			</div>
		</div>
	</div>
	<div 
		v-if="isManageOpen"
		class="fixed top-16 left-0 w-full h-full px-3 flex flex-col items-center bg-primary-400">	
		
		<div class="w-full flex items-center justify-between">
			<span class="font-bold text-2xl text-gray-light-50">
				Manage Ticket
			</span>
			<svg 
				@click="isManageOpen = false"
				class="w-10 h-10 fill-current text-gray-light-50 cursor-pointer" 
				viewBox="0 0 24 24">
				<path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z">
				</path>
			</svg>
		</div>

		<div class="w-full flex justify-evenly">
			<div class="flex flex-col items-center">
				<span class="text-gray-light-50">Severity</span>
				<div id="select-box" class="relative flex flex-col">
					<div 
						id="options-container" 
						class="absolute top-9 w-full max-h-0 opacity-0 order-1 bg-gray-dark-500 text-gray-light-50 transition-all duration-500 rounded-lg overflow-hidden"
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
					<div id="selected" @click="toggleSelector('severity')" class="cursor-pointer relative bg-gray-dark-500 mb-2 rounded-lg text-gray-light-50 py-1 pl-2 pr-10">
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
			<div class="flex flex-col items-center">
				<span class="text-gray-light-50">Status</span>
				<div id="select-box" class="relative flex flex-col">
					<div 
						id="options-container" 
						class="absolute top-9 w-full max-h-0 opacity-0 order-1 bg-gray-dark-500 text-gray-light-50 transition-all duration-500 rounded-lg overflow-hidden"
						:class="{ 'max-h-screen opacity-100': (activeSelector ==  'status') }" >

						<div id="option" class="py-1 px-2 cursor-pointer" @click="selectStatusValue('in progress')">
							<input type="radio" id="in progress" name="category" class="hidden">
							<label for="in progress" class="cursor-pointer">in progress</label>
						</div>
						<div id="option" class="py-1 px-2 cursor-pointer" @click="selectStatusValue('need info')">
							<input type="radio" id="need info" name="category" class="hidden">
							<label for="need info" class="cursor-pointer">need info</label>
						</div>
						<div id="option" class="py-1 px-2 cursor-pointer" @click="selectStatusValue('closed')">
							<input type="radio" id="closed" name="category" class="hidden">
							<label for="closed" class="cursor-pointer">closed</label>
						</div>
					</div>
					<div id="selected" @click="toggleSelector('status')" class="cursor-pointer relative bg-gray-dark-500 mb-2 rounded-lg text-gray-light-50 py-1 pl-2 pr-10">
						<span v-if="statusSelected">
							{{ statusSelected }}
						</span>
						<span v-else>
							Select Status
						</span>
						<svg :class="{ '-rotate-90': (activeSelector ==  'status') }" class="absolute top-0 right-0 w-8 h-8 text-gray-light-50 fill-current transform rotate-90 transition-transform duration-500" viewBox="0 0 24 24"><path d="M6.5 17.5l8.25-5.5L6.5 6.5l1-1.5L18 12L7.5 19z"></path></svg>
					</div>
				</div>
			</div>
		</div>
		<div class="w-full mt-2 flex justify-between">
			<div class="flex flex-col items-center">
				<span class="text-gray-light-50 text-lg">
					Assigned Users
				</span>
				<div class="bg-gray-light-50 rounded-lg p-1 mt-1">
					<div 
						v-for="user in ticket.usersAssigned"
						:key="user._id"
						class="flex mt-0.5 first:mt-0" >
						<span class="pr-2">
							{{ user.name }}
						</span>
						<button 
							@click="removeUserFromTicket(user._id)"
							class="ml-auto text-sm text-gray-dark-400">
							remove
						</button>
					</div>
				</div>
			</div>
			<div class="flex flex-col items-center">
				<span class="text-gray-light-50 text-lg">
					Add User
				</span>
				<div class="bg-gray-light-50 rounded-lg p-1 mt-1">
					<div
						v-for="user in eligibleUsers"
						:key="user._id"
						class="flex mt-0.5 first:mt-0" >
						<span class="pr-2">
							{{ user.name }}
						</span>
						<button
							@click="assignUserToTicket(user._id)"
							class="ml-auto text-sm text-gray-dark-400" >
							add
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { getTicket, 
	postComment, 
	editTicket, 
	removeUserFromTicket, 
	getEligibleUsers, 
	assignUserToTicket } from '../api/ticket';

export default Vue.extend({
	name: "Ticket",
	props: {
		jwt: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			ticketID: '',
			ticket: null,
			comment: '',
			isHistoryOpen: false,
			isManageOpen: false,
			activeSelector: '',
			severitySelected: '',
			statusSelected: '',
			lastPosted: {
				severity: '',
				status: '',
			},
			eligibleUsers: [],
		}
	},
	async created() {
		if (typeof this.$route.query.id === 'string') {
			this.ticketID = this.$route.query.id;
			this.ticket = await getTicket(this.$route.query.id, this.jwt);
			this.severitySelected = this.ticket.severity;
			this.statusSelected = this.ticket.status
			this.eligibleUsers = await getEligibleUsers(this.ticketID, this.jwt);
		}
	},
	computed: {
		dateFormatted(): string {
			return this.ticket.dateCreated.substr(0, 10);
		},
	},
	methods: {
		async postComment() {
			await postComment(this.comment, this.ticketID, this.jwt);
			this.comment = '';
			this.ticket = await getTicket(this.ticketID, this.jwt);
		},
		async selectSeverityValue(value: string) {
			this.severitySelected = value;
			this.activeSelector = '';
			if (this.severitySelected !== this.lastPosted.severity) {
				this.lastPosted.severity = value;
				await editTicket(undefined, this.severitySelected, this.ticketID, this.jwt);
			}
			this.ticket = await getTicket(this.ticketID, this.jwt);
		},
		async selectStatusValue(value: string) {
			this.statusSelected = value;
			this.activeSelector = '';
			if (this.statusSelected !== this.lastPosted.status) {
				this.lastPosted.status = value;
				await editTicket(this.statusSelected, undefined, this.ticketID, this.jwt);
			}
			this.ticket = await getTicket(this.ticketID, this.jwt);
		},
		async removeUserFromTicket(userID: string) {
			await removeUserFromTicket(this.ticketID, userID, this.jwt);
			this.ticket = await getTicket(this.ticketID, this.jwt);
			this.eligibleUsers = await getEligibleUsers(this.ticketID, this.jwt);
		},
		async assignUserToTicket(userID: string) {
			await assignUserToTicket(this.ticketID, userID, this.jwt);
			for (let i = 0; i < this.eligibleUsers.length; i++) {
				if (this.eligibleUsers[i]._id === userID) {
					this.eligibleUsers.splice(i, 1);
				}
			}
			this.ticket = await getTicket(this.ticketID, this.jwt);
		},
		toggleSelector(selector: string) {
			if (selector == 'status') {
				if (this.activeSelector == 'status') {
					this.activeSelector = '';
				} else {
					this.activeSelector = 'status';
				}
			} else if (selector == 'severity') {
				if (this.activeSelector == 'severity') {
					this.activeSelector = '';
				} else {
					this.activeSelector = 'severity';
				}
			}
		},
	}
})
</script>