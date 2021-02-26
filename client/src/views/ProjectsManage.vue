<template>
<div class="w-screen flex flex-col items-center pt-3 px-2">
	<div class="w-full flex flex-col items-center bg-gray-dark-400 rounded-lg p-1">
		<input 
			class="rounded-lg pl-1 w-full h-7"
			type="text" 
			placeholder="Project Name..."
			v-model="project.name" >
		<textarea 
			class="w-full pl-1 h-16 mt-1 rounded-lg resize-none"
			placeholder="Description..."
			v-model="project.description" >
		</textarea>
		<button 
			class="mt-1 py-0.5 px-3 bg-primary-400 rounded-lg font-bold text-gray-light-50"
			@click="postProject()" >
			Post Project
		</button>
	</div>
	<ProjectList 
		:projects="projectList" 
		:selectedProject="selectedProject.name"
		class="mt-3 w-full shadow-md"
		@changeProject="changeProject($event)" />
	
	<div class="w-full mt-3 bg-gray-dark-400 rounded-lg flex flex-col items-center">
		<span class="font-bold text-lg text-primary-200">Assign User to Project</span>
		<div class="w-full px-2 flex justify-between">
			<div class="w-1/2 mr-1">
				<span class="text-gray-light-50">User</span>
				<div class="bg-gray-light-50 rounded-lg flex flex-col p-1">
					<span 
						v-for="user in unassignedUsers"
						:key="user._id"
						@click="assignUser = { username: user.username, _id: user._id }"
						class="px-2 py-1 cursor-pointer bg-gray-dark-400 rounded-lg mb-1 last:mb-0 text-center"
						:class="[(assignUser.username === user.username) ? 'text-primary-200 font-bold': 'text-gray-light-50']" >
						{{ user.username }}
					</span>
				</div>
			</div>
			<div class="w-1/2 ml-1">
				<span class="text-gray-light-50">Project Role</span>
				<div class="w-full bg-gray-light-50 rounded-lg flex flex-col p-1">
					<span
						v-for="role in projectRoles"
						:key="role._id"
						@click="assignUserRole = { name: role.name, _id: role._id }"
						class="px-2 py-1 cursor-pointer bg-gray-dark-400 rounded-lg mb-1 last:mb-0 text-center"
						:class="[(assignUserRole.name === role.name) ? 'text-primary-200 font-bold': 'text-gray-light-50']" >
						{{ role.name }}
					</span>
				</div>
			</div>
		</div>
		<button 
			@click="addUserToProject()"
			class="px-2 py-0.5 mt-2 mb-1 bg-primary-400 rounded-lg font-bold text-gray-light-50">
			Add {{ assignUser.username || 'User' }} to {{ selectedProject.name }}
		</button>
	</div>
	<div class="w-full mt-3 bg-gray-dark-400 rounded-lg flex flex-col items-center">
		<span class="font-bold text-lg text-primary-200">Change Users' Roles</span>
		<div class="w-full px-2 flex justify-between">
			<div class="w-1/2 mr-1">
				<span class="text-gray-light-50">User</span>
				<div class="bg-gray-light-50 rounded-lg flex flex-col p-1">
					<span 
						v-for="user in assignedUsers"
						:key="user._id"
						@click="changeUser = { username: user.username, _id: user._id }; changeUserRole = { _id: user.role, name: '' };"
						class="px-2 py-1 cursor-pointer bg-gray-dark-400 rounded-lg mb-1 last:mb-0 text-center"
						:class="[(changeUser.username === user.username) ? 'text-primary-200 font-bold': 'text-gray-light-50']" >
						{{ user.username }}
					</span>
				</div>
			</div>
			<div class="w-1/2 ml-1">
				<span class="text-gray-light-50">Project Role</span>
				<div class="w-full bg-gray-light-50 rounded-lg flex flex-col p-1">
					<span
						v-for="role in projectRoles"
						:key="role._id"
						@click="changeUserRole = { name: role.name, _id: role._id }"
						class="px-2 py-1 cursor-pointer bg-gray-dark-400 rounded-lg mb-1 last:mb-0 text-center"
						:class="[(changeUserRole._id === role._id) ? 'text-primary-200 font-bold': 'text-gray-light-50']" >
						{{ role.name }}
					</span>
				</div>
			</div>
		</div>
		<div class="w-full flex justify-evenly my-1">
			<button 
				@click="removeUserFromProject()"
				class="px-2 py-0.5 bg-primary-400 rounded-lg font-bold text-gray-light-50">
				Remove User
			</button>
			<button 
				@click="updateUserRole()"
				class="px-2 py-0.5 bg-primary-400 rounded-lg font-bold text-gray-light-50">
				Update Role
			</button>
		</div>
		
	</div>
</div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import ProjectList from '../components/ProjectList.vue';
import { 
	postProject, 
	getUnassignedUsers, 
	getRoles, 
	addUserToProject, 
	getAssigned,
	editProjectUser,
	removeUserFromProject } from '../api/project';

export default Vue.extend({
	name: "ProjectsManage",
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
			selectedProject: {
				_id: '',
				name: '',
			},
			project: {
				name: '',
				description: '',
			},
			unassignedUsers: [],
			projectRoles: [],
			assignUser: {
				username: '',
				_id: '',
			},
			assignUserRole: {
				name: '',
				_id: '',
			},
			assignedUsers: [],
			changeUser: {
				username: '',
				_id: '',
			},
			changeUserRole: {
				name: '',
				_id: '',
			}
		}
	},
	async created() {
		this.selectedProject = {
			_id: this.projectList[0]._id,
			name: this.projectList[0].name,
		};

		this.unassignedUsers = await getUnassignedUsers(this.selectedProject._id, this.jwt);
		this.assignedUsers = await getAssigned(this.selectedProject._id, this.jwt);
		this.projectRoles = await getRoles(this.selectedProject._id, this.jwt);
	},
	methods: {
		async changeProject(project: { _id: string; name: string}) {
			this.selectedProject = project;
			this.unassignedUsers = await getUnassignedUsers(this.selectedProject._id, this.jwt);
			this.projectRoles = await getRoles(this.selectedProject._id, this.jwt);
		},
		async postProject() {
			await postProject(this.project.name, this.project.description, this.jwt);
			this.project = {
				name: '',
				description: '',
			};
		},
		async addUserToProject() {
			await addUserToProject(
				this.selectedProject._id,
				this.assignUser._id,
				this.assignUserRole._id,
				this.jwt);

			this.unassignedUsers = await getUnassignedUsers(this.selectedProject._id, this.jwt);
			this.projectRoles = await getRoles(this.selectedProject._id, this.jwt);
			this.assignedUsers = await getAssigned(this.selectedProject._id, this.jwt);

			this.assignUser = {
				username: '',
				_id: '',
			};
			this.assignUserRole = {
				name: '',
				_id: '',
			};
		},
		async updateUserRole() {
			await editProjectUser(
				this.selectedProject._id, 
				this.changeUser._id, 
				this.changeUserRole._id, 
				this.jwt);

			this.assignedUsers = await getAssigned(this.selectedProject._id, this.jwt);

			this.changeUser = {
				username: '',
				_id: '',
			};
			this.changeUserRole = {
				name: '',
				_id: '',
			}
		},
		async removeUserFromProject() {
			await removeUserFromProject(this.selectedProject._id, this.changeUser._id, this.jwt);
			this.assignedUsers = await getAssigned(this.selectedProject._id, this.jwt);
			this.unassignedUsers = await getUnassignedUsers(this.selectedProject._id, this.jwt);
			this.changeUser = {
				username: '',
				_id: '',
			};
			this.changeUserRole = {
				name: '',
				_id: '',
			}
		}
	}
})
</script>