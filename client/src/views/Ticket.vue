<template>
<div class="w-screen flex flex-col">
	<div v-if="ticket" class="px-1.5 py-1 flex flex-wrap border-b border-gray-light-300">
		<div class="w-full flex">
			<div class="leading-none">
				<div>
					<span class="mr-1 px-1 py-0.5 bg-gray-light-400 text-gray-dark-400 text-xs">{{ ticket.type }}</span>
					<span class="px-1 py-0.5 bg-gray-light-400 text-gray-dark-400 text-xs">{{ ticket.severity }}</span>
				</div>
				<h1 class="text-xl font-bold text-gray-dark-400 mt-1">{{ ticket.title }}</h1>
				<span class="text-xs text-gray-dark-200">{{ ticket.createdBy }} / {{ dateFormatted }}</span>
			</div>
			<div class="ml-auto mr-1 leading-none">
				<span 
					v-if="ticket.history.length >= 1"
					@click="isHistoryOpen = true"
					class="text-gray-dark-900 text-xs cursor-pointer" >
					
					Ticket History
				</span>
				<a 
					v-if="ticket.attachment" 
					:href="'/uploads/' + ticket.attachment"
					target="_blank" rel="noopener noreferrer" >
					<svg class="ml-auto mt-1 h-9 w-9 fill-current text-gray-dark-400" viewBox="0 0 384 512"><path d="M369.9 97.9L286 14C277 5 264.8-.1 252.1-.1H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V131.9c0-12.7-5.1-25-14.1-34zM332.1 128H256V51.9l76.1 76.1zM48 464V48h160v104c0 13.3 10.7 24 24 24h104v288H48zm32-48h224V288l-23.5-23.5c-4.7-4.7-12.3-4.7-17 0L176 352l-39.5-39.5c-4.7-4.7-12.3-4.7-17 0L80 352v64zm48-240c-26.5 0-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48s-21.5-48-48-48z"></path></svg>
				</a>
			</div>
		</div>
		<div class="text-gray-dark-400 w-full my-1">
			{{ ticket.description }}
		</div>
	</div>
	<div v-if="ticket" class="px-1.5 flex flex-col pb-2 border-b border-gray-light-300">
		<h2 class="my-2 font-bold text-xl text-gray-dark-400">Manage Ticket</h2>
		<div class="w-full flex">
			<SelectorInput 
				v-model="status"
				:name="'status'" 
				:options="statusOptions"
				:startingValue="status"
				class="w-1/2 mr-1" />
			<SelectorInput 
				v-model="severity"
				:name="'severity'" 
				:options="severityOptions"
				:startingValue="severity"
				@input="updateSeverity()"
				class="w-1/2 ml-1" />
		</div>
		<div class="flex mt-2">
			<div class="w-1/2 mr-1">
				<span class="text-gray-dark-400 text-xs">Assigned Users</span>
				<div class="bg-gray-light-400 w-full h-32 px-1">
					<div 
						v-for="user in ticket.usersAssigned"
						:key="user._id"
						class="flex mt-0.5 first:mt-0" >
						<span class="text-gray-dark-600">
							{{ user.name }}
						</span>
						<button 
							@click="removeUserFromTicket(user._id)"
							class="ml-auto text-sm text-gray-dark-300">
							remove
						</button>
					</div>
				</div>
			</div>
			<div class="w-1/2 ml-1">
				<span class="text-gray-dark-400 text-xs">Add User to Ticket</span>
				<div class="bg-gray-light-400 w-full h-32 px-1">
					<div
						v-for="user in eligibleUsers"
						:key="user._id"
						class="flex mt-0.5 first:mt-0" >
						<span class="text-gray-dark-600">
							{{ user.name }}
						</span>
						<button
							@click="assignUserToTicket(user._id)"
							class="ml-auto text-sm text-gray-light-300" >
							add
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<h2 class="my-2 ml-1.5 font-bold text-xl text-gray-dark-400">Add a Comment</h2>
	<textarea 
		class="bg-gray-light-400 text-gray-dark-400 placeholder-gray-dark-100 mx-1.5 pl-1 h-20 rounded-none"
		placeholder="Add a comment..."
		v-model="comment" ></textarea>
	<button 
		@click="postComment()"
		class="bg-gray-light-400 font-bold text-gray-dark-400 mx-auto mt-2 py-0.5 px-2 rounded-none">
		Post Comment
	</button>
	<div v-if="ticket.comments">
		<h2 class="mt-2 py-1.5 pl-1.5 font-bold text-xl bg-gray-light-300 text-gray-dark-400">Comments</h2>
		<div 
			v-for="comment in ticket.comments"
			:key="comment.dateCreated"
			class="px-1.5 py-1.5 flex flex-col even:bg-gray-light-300" >
			<span class="text-xs text-gray-dark-200">
				{{ comment.createdBy }} / {{ comment.dateCreated.substr(0, 10) }}
			</span>
			<span class="text-gray-dark-400 mt-0.5">
				{{ comment.text }}
			</span>
		</div>
	</div>
	<div 
		v-if="isHistoryOpen"
		class="fixed top-16 bottom-0 overflow-y-scroll left-0 w-full flex flex-col items-center bg-gray-light-100">	
		<svg 
			@click="isHistoryOpen = false"
			class="ml-auto w-10 h-10 min-h-10 mr-1.5 fill-current text-gray-dark-400 cursor-pointer" 
			viewBox="0 0 24 24">
			<path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z">
			</path>
		</svg>
		<div 
			v-for="record in ticket.history"
			:key="record.dateChanged"
			class="bg-gray-light-200 mt-2 px-1.5 py-1 flex flex-col w-full min-h-min" >

			<span class="text-xs text-gray-dark-600">
				{{ record.changedBy }} / {{ record.dateChanged.substr(0, 10) }}
			</span>
			<div 
				v-for="change in record.changes"
				:key="change.propertyChanged"
				class="bg-gray-light-300 flex justify-evenly p-0.5 text-gray-dark-400 mt-1" >
				
				<div class="flex flex-col items-center">
					<span class="text-gray-dark-300">
						Property
					</span>
					<span class="font-bold">
						{{ change.propertyChanged }}
					</span>
				</div>
				<div class="flex flex-col items-center">
					<span class="text-gray-dark-300">
						Old Value
					</span>
					<span class="font-bold">
						{{ change.oldValue }}
					</span>
				</div>
				<div class="flex flex-col items-center">
					<span class="text-gray-dark-300">
						New Value
					</span>
					<span class="font-bold">
						{{ change.newValue }}
					</span>
				</div>
			</div>
		</div>
	</div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import SelectorInput from '../components/SelectorInput.vue';
import { getTicket, 
	postComment, 
	editTicket, 
	removeUserFromTicket, 
	getEligibleUsers, 
	assignUserToTicket } from '../api/ticket';

export default Vue.extend({
	name: "Ticket",
	components: {
		SelectorInput,
	},
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
			status: '',
			severity: '',
			statusOptions: [
				'in progress',
				'need info',
				'closed'
			],
			severityOptions: [
				'low',
				'medium',
				'high',
				'critical',
			],
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
			this.severity = this.ticket.severity;
			this.status = this.ticket.status
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
		async updateSeverity() {
			if (this.severity !== this.lastPosted.severity) {
				this.lastPosted.severity = this.severity;
				await editTicket(undefined, this.severity, this.ticketID, this.jwt);
				this.ticket = await getTicket(this.ticketID, this.jwt);
			}
		},
		async updateStatus() {
			if (this.status !== this.lastPosted.status) {
				this.lastPosted.status = this.status;
				await editTicket(this.status, undefined, this.ticketID, this.jwt);
				this.ticket = await getTicket(this.ticketID, this.jwt);
			}
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
	}
})
</script>