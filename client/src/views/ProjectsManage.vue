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
	<div class="w-full px-2 mt-3 bg-gray-dark-400 rounded-lg flex flex-col items-center">
		<span class="font-bold text-lg text-primary-200">Create a Project Role</span>
		<input 
			type="text" 
			placeholder="Role Name..."
			class="mt-1 pl-1 w-full h-7 rounded-lg"
			v-model="roleName" >

		<div class="p-1 mt-2 w-full rounded-lg bg-gray-light-50 flex flex-col">
			<div class="flex justify-evenly mb-1">
				<span 
					@click="modifyPermissionsList('editProject')" 
					class="w-1/2 mr-1 text-center py-1 cursor-pointer bg-gray-dark-400 rounded-lg"
					:class="[permissions.includes('editProject') ? 'text-primary-200 font-bold': 'text-gray-light-50']" >editProject</span>
				<span 
					@click="modifyPermissionsList('editProjectUser')" 
					class="w-1/2 ml-1 text-center py-1 cursor-pointer bg-gray-dark-400 rounded-lg"
					:class="[permissions.includes('editProjectUser') ? 'text-primary-200 font-bold': 'text-gray-light-50']" >editProjectUser</span>
			</div>
			<div class="flex justify-evenly mb-1">
				<span 
					@click="modifyPermissionsList('editProjectRoles')" 
					class="w-1/2 mr-1 text-center py-1 cursor-pointer bg-gray-dark-400 rounded-lg"
					:class="[permissions.includes('editProjectRoles') ? 'text-primary-200 font-bold': 'text-gray-light-50']" >editProjectRoles</span>
				<span 
					@click="modifyPermissionsList('createTicket')" 
					class="w-1/2 ml-1 text-center py-1 cursor-pointer bg-gray-dark-400 rounded-lg"
					:class="[permissions.includes('createTicket') ? 'text-primary-200 font-bold': 'text-gray-light-50']" >createTicket</span>
			</div>
			<div class="flex justify-evenly">
				<span 
					@click="modifyPermissionsList('assignTicket')" 
					class="w-1/2 mr-1 text-center py-1 cursor-pointer bg-gray-dark-400 rounded-lg"
					:class="[permissions.includes('assignTicket') ? 'text-primary-200 font-bold': 'text-gray-light-50']" >assignTicket</span>
				<span 
					@click="modifyPermissionsList('editTicket')" 
					class="w-1/2 ml-1 text-center py-1 cursor-pointer bg-gray-dark-400 rounded-lg"
					:class="[permissions.includes('editTicket') ? 'text-primary-200 font-bold': 'text-gray-light-50']" >editTicket</span>
			</div>
		</div>
		<button 
			@click="postProjectRole()"
			class="px-2 py-0.5 my-1 bg-primary-400 rounded-lg font-bold text-gray-light-50">
			Create Role
		</button>
	</div>
	<div class="w-full px-2 mt-3 bg-gray-dark-400 rounded-lg flex flex-col items-center">
		<span class="font-bold text-lg text-primary-200">Edit Project Role</span>
		<div class="w-full bg-gray-light-50 p-1 rounded-lg flex overflow-x-auto">
			<span
			v-for="role in projectRoles"
			:key="role._id"
			class="px-2 py-0.5 mr-1 bg-gray-dark-400 rounded-lg cursor-pointer whitespace-nowrap"
			:class="[(editRole._id === role._id) ? 'text-primary-200 font-bold': 'text-gray-light-50']"
			@click="editRole = { name: role.name, _id: role._id, permissions: role.permissions }" >
				{{ role.name }}
			</span>
		</div>
		<input 
			type="text" 
			placeholder="Role Name..."
			class="mt-1 pl-1 w-full h-7 rounded-lg"
			v-model="editRole.name" >

		<div class="p-1 mt-2 w-full rounded-lg bg-gray-light-50 flex flex-col">
			<div class="flex justify-evenly mb-1">
				<span 
					@click="modifyEditPermissionsList('editProject')" 
					class="w-1/2 mr-1 text-center py-1 cursor-pointer bg-gray-dark-400 rounded-lg"
					:class="[editRole.permissions.includes('editProject') ? 'text-primary-200 font-bold': 'text-gray-light-50']" >editProject</span>
				<span 
					@click="modifyEditPermissionsList('editProjectUser')" 
					class="w-1/2 ml-1 text-center py-1 cursor-pointer bg-gray-dark-400 rounded-lg"
					:class="[editRole.permissions.includes('editProjectUser') ? 'text-primary-200 font-bold': 'text-gray-light-50']" >editProjectUser</span>
			</div>
			<div class="flex justify-evenly mb-1">
				<span 
					@click="modifyEditPermissionsList('editProjectRoles')" 
					class="w-1/2 mr-1 text-center py-1 cursor-pointer bg-gray-dark-400 rounded-lg"
					:class="[editRole.permissions.includes('editProjectRoles') ? 'text-primary-200 font-bold': 'text-gray-light-50']" >editProjectRoles</span>
				<span 
					@click="modifyEditPermissionsList('createTicket')" 
					class="w-1/2 ml-1 text-center py-1 cursor-pointer bg-gray-dark-400 rounded-lg"
					:class="[editRole.permissions.includes('createTicket') ? 'text-primary-200 font-bold': 'text-gray-light-50']" >createTicket</span>
			</div>
			<div class="flex justify-evenly">
				<span 
					@click="modifyEditPermissionsList('assignTicket')" 
					class="w-1/2 mr-1 text-center py-1 cursor-pointer bg-gray-dark-400 rounded-lg"
					:class="[editRole.permissions.includes('assignTicket') ? 'text-primary-200 font-bold': 'text-gray-light-50']" >assignTicket</span>
				<span 
					@click="modifyEditPermissionsList('editTicket')" 
					class="w-1/2 ml-1 text-center py-1 cursor-pointer bg-gray-dark-400 rounded-lg"
					:class="[editRole.permissions.includes('editTicket') ? 'text-primary-200 font-bold': 'text-gray-light-50']" >editTicket</span>
			</div>
		</div>
		<div class="w-full flex justify-evenly my-1">
			<button 
				
				class="px-2 py-0.5 bg-primary-400 rounded-lg font-bold text-gray-light-50">
				Delete Role
			</button>
			<button 
				@click="editProjectRole()"
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
	removeUserFromProject,
	postProjectRole,
	editProjectRole } from '../api/project';

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
			},
			permissions: [],
			roleName: '',
			editRole: {
				name: '',
				_id: '',
				permissions: []
			},
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
		},
		modifyPermissionsList(permission: string) {
			const index = this.permissions.indexOf(permission)
			if (index !== -1) {
				this.permissions.splice(index, 1);
			} else {
				this.permissions.push(permission);
			}
		},
		modifyEditPermissionsList(permission: string) {
			const index = this.editRole.permissions.indexOf(permission)
			if (index !== -1) {
				this.editRole.permissions.splice(index, 1);
			} else {
				this.editRole.permissions.push(permission);
			}
		},
		async postProjectRole() {
			await postProjectRole(
				this.selectedProject._id, 
				this.roleName, 
				this.permissions, 
				this.jwt);

			this.projectRoles = await getRoles(this.selectedProject._id, this.jwt);

			this.roleName = '';
			this.permissions = [];
		},
		async editProjectRole() {
			await editProjectRole(
				this.selectedProject._id, 
				this.editRole._id, 
				this.editRole.name, 
				this.editRole.permissions, 
				this.jwt);

			this.projectRoles = await getRoles(this.selectedProject._id, this.jwt);

			this.editRole = {
				name: '',
				_id: '',
				permissions: []
			};
		}
	}
})
</script>