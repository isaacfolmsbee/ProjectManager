<template>
<div class="w-screen flex flex-col">
	<div class="flex flex-col px-1.5">
		<h2 class="my-2 font-bold text-xl text-gray-dark-400">Post a New Project</h2>
		<input 
			class="rounded-none w-full pl-1 h-7 bg-gray-dark-400 text-gray-light-100"
			type="text" 
			placeholder="Project Name..."
			v-model="project.name" >
		<textarea 
			class="w-full pl-1 h-16 mt-2 rounded-none resize-none bg-gray-dark-400 text-gray-light-100"
			placeholder="Description..."
			v-model="project.description" >
		</textarea>
		<button 
			class="mt-2 py-0.5 px-2 mx-auto bg-primary-400 rounded-none font-bold bg-gray-dark-400 text-gray-light-100"
			@click="postProject()" >
			Post New Project
		</button>
	</div>
	<ProjectList 
		:projects="projectList" 
		:selectedProject="selectedProject.name"
		class="mt-2 w-full bg-gray-light-300"
		@changeProject="changeProject($event)" />
	<div class="flex flex-col px-1.5">
		<h2 class="mt-2 font-bold text-xl text-gray-dark-400">Assign User to Project</h2>
		<div class="flex">
			<div class="w-1/2 mr-1">
				<span class="text-gray-dark-400 text-xs">Project Role</span>
				<div class="flex flex-col p-1 bg-gray-dark-400 w-full h-32">
					<span
						v-for="user in unassignedUsers"
						:key="user._id"
						@click="assignUser = { username: user.username, _id: user._id }"
						class="p-0.5 mb-0.5 leading-none w-min whitespace-nowrap overflow-ellipsis cursor-pointer"
						:class="[(assignUser.username === user.username) ? 'text-gray-dark-600 bg-gray-light-300': 'text-gray-light-100']" >
							{{ user.username }}
					</span>
				</div>
			</div>
			<div class="w-1/2 ml-1">
				<span class="text-gray-dark-400 text-xs">User</span>
				<div class="flex flex-col bg-gray-dark-400 w-full h-32 px-1">
					<span
						v-for="role in projectRoles"
						:key="role._id"
						@click="assignUserRole = { name: role.name, _id: role._id }"
						class="p-0.5 mb-0.5 leading-none w-min whitespace-nowrap overflow-ellipsis cursor-pointer"
						:class="[(assignUserRole.name === role.name) ? 'text-gray-dark-600 bg-gray-light-300': 'text-gray-light-100']" >
							{{ role.name }}
					</span>
				</div>
			</div>
		</div>
		<button 
			@click="addUserToProject()"
			class="mx-auto px-2 py-0.5 mt-2 bg-gray-dark-400 rounded-none font-bold text-gray-light-100">
			Add {{ assignUser.username || 'User' }} to {{ selectedProject.name }}
		</button>
	</div>
	<div class="flex flex-col px-1.5 mt-2 bg-gray-light-300">
		<h2 class="mt-2 font-bold text-xl text-gray-dark-400">Change Users' Roles</h2>
		<div class="flex">
			<div class="w-1/2 mr-1">
				<span class="text-gray-dark-400 text-xs">User</span>
				<div class="flex flex-col p-1 bg-gray-dark-400 w-full h-32">
					<span
						v-for="user in assignedUsers"
						:key="user._id"
						@click="changeUser = { username: user.username, _id: user._id }; changeUserRole = { _id: user.role, name: '' };"
						class="p-0.5 mb-0.5 leading-none w-min whitespace-nowrap overflow-ellipsis cursor-pointer"
						:class="[(changeUser.username === user.username) ? 'text-gray-dark-600 bg-gray-light-300': 'text-gray-light-100']" >
							{{ user.username }}
					</span>
				</div>
			</div>
			<div class="w-1/2 ml-1">
				<span class="text-gray-dark-400 text-xs">Project Role</span>
				<div class="flex flex-col bg-gray-dark-400 w-full h-32 px-1">
					<span
						v-for="role in projectRoles"
						:key="role._id"
						@click="changeUserRole = { name: role.name, _id: role._id }"
						class="p-0.5 mb-0.5 leading-none w-min whitespace-nowrap overflow-ellipsis cursor-pointer"
						:class="[(changeUserRole._id === role._id) ? 'text-gray-dark-600 bg-gray-light-300': 'text-gray-light-100']" >
							{{ role.name }}
					</span>
				</div>
			</div>
		</div>
		<div class="flex justify-around my-2">
			<button 
				@click="removeUserFromProject()"
				class="px-2 py-0.5 bg-gray-dark-400 rounded-none font-bold text-gray-light-100">
				Remove User
			</button>
			<button 
				@click="updateUserRole()"
				class="px-2 py-0.5 bg-gray-dark-400 rounded-none font-bold text-gray-light-100">
				Update User
			</button>
		</div>
	</div>
	<div class="flex flex-col px-1.5">
		<h2 class="my-2 font-bold text-xl text-gray-dark-400">Create a Project Role</h2>
		<input 
			class="rounded-none w-full pl-1 h-7 bg-gray-dark-400 text-gray-light-100"
			type="text" 
			placeholder="Role Name..."
			v-model="roleName" >
		<div class="flex flex-col bg-gray-dark-400 w-full mt-2 p-1">
			<div class="flex justify-evenly mb-1">
				<span 
					@click="modifyPermissionsList('editProject')" 
					class="w-1/2 text-center py-0.5 mr-0.5 cursor-pointer"
					:class="[permissions.includes('editProject') ? 'text-gray-dark-600 bg-gray-light-300': 'text-gray-light-100']" >editProject</span>
				<span 
					@click="modifyPermissionsList('editProjectUser')" 
					class="w-1/2 text-center py-0.5 ml-0.5 cursor-pointer"
					:class="[permissions.includes('editProjectUser') ? 'text-gray-dark-600 bg-gray-light-300': 'text-gray-light-100']" >editProjectUser</span>
			</div>
			<div class="flex justify-evenly mb-1">
				<span 
					@click="modifyPermissionsList('editProjectRoles')" 
					class="w-1/2 text-center py-0.5 mr-0.5 cursor-pointer"
					:class="[permissions.includes('editProjectRoles') ? 'text-gray-dark-600 bg-gray-light-300': 'text-gray-light-100']" >editProjectRoles</span>
				<span 
					@click="modifyPermissionsList('createTicket')" 
					class="w-1/2 text-center py-0.5 ml-0.5 cursor-pointer"
					:class="[permissions.includes('createTicket') ? 'text-gray-dark-600 bg-gray-light-300': 'text-gray-light-100']" >createTicket</span>
			</div>
			<div class="flex justify-evenly">
				<span 
					@click="modifyPermissionsList('assignTicket')" 
					class="w-1/2 text-center py-0.5 mr-0.5 cursor-pointer"
					:class="[permissions.includes('assignTicket') ? 'text-gray-dark-600 bg-gray-light-300': 'text-gray-light-100']" >assignTicket</span>
				<span 
					@click="modifyPermissionsList('editTicket')" 
					class="w-1/2 text-center py-0.5 ml-0.5 cursor-pointer"
					:class="[permissions.includes('editTicket') ? 'text-gray-dark-600 bg-gray-light-300': 'text-gray-light-100']" >editTicket</span>
			</div>
		</div>
		<button 
			@click="postProjectRole()"
			class="mt-2 py-0.5 px-2 mx-auto bg-primary-400 rounded-none font-bold bg-gray-dark-400 text-gray-light-100">
			Create Role
		</button>
	</div>
	<div class="flex flex-col px-1.5 mt-2 bg-gray-light-300">
		<h2 class="mt-2 font-bold text-xl text-gray-dark-400">Edit Project Role</h2>
		<span class="mt-1.5 text-xs text-gray-dark-200">Select Role</span>
		<div class="w-full pb-2 flex overflow-x-auto">
			<span
				v-for="role in projectRoles"
				:key="role._id"
				class="px-2 py-1 leading-none mr-1 cursor-pointer whitespace-nowrap"
				:class="[(editRole._id === role._id) ? 'bg-gray-dark-400 text-gray-light-100': 'text-gray-dark-400']"
				@click="editRole = { name: role.name, _id: role._id, permissions: role.permissions }" >
				{{ role.name }}
			</span>
		</div>
		<input 
			class="rounded-none w-full pl-1 h-7 bg-gray-dark-400 text-gray-light-100"
			type="text" 
			placeholder="Role Name..."
			v-model="editRole.name" >
		<div class="flex flex-col bg-gray-dark-400 w-full mt-2 p-1">
			<div class="flex justify-evenly mb-1">
				<span 
					@click="modifyEditPermissionsList('editProject')" 
					class="w-1/2 text-center py-0.5 mr-0.5 cursor-pointer"
					:class="[editRole.permissions.includes('editProject') ? 'text-gray-dark-600 bg-gray-light-300': 'text-gray-light-100']" >editProject</span>
				<span 
					@click="modifyEditPermissionsList('editProjectUser')" 
					class="w-1/2 text-center py-0.5 ml-0.5 cursor-pointer"
					:class="[editRole.permissions.includes('editProjectUser') ? 'text-gray-dark-600 bg-gray-light-300': 'text-gray-light-100']" >editProjectUser</span>
			</div>
			<div class="flex justify-evenly mb-1">
				<span 
					@click="modifyEditPermissionsList('editProjectRoles')" 
					class="w-1/2 text-center py-0.5 mr-0.5 cursor-pointer"
					:class="[editRole.permissions.includes('editProjectRoles') ? 'text-gray-dark-600 bg-gray-light-300': 'text-gray-light-100']" >editProjectRoles</span>
				<span 
					@click="modifyEditPermissionsList('createTicket')" 
					class="w-1/2 text-center py-0.5 ml-0.5 cursor-pointer"
					:class="[editRole.permissions.includes('createTicket') ? 'text-gray-dark-600 bg-gray-light-300': 'text-gray-light-100']" >createTicket</span>
			</div>
			<div class="flex justify-evenly">
				<span 
					@click="modifyEditPermissionsList('assignTicket')" 
					class="w-1/2 text-center py-0.5 mr-0.5 cursor-pointer"
					:class="[editRole.permissions.includes('assignTicket') ? 'text-gray-dark-600 bg-gray-light-300': 'text-gray-light-100']" >assignTicket</span>
				<span 
					@click="modifyEditPermissionsList('editTicket')" 
					class="w-1/2 text-center py-0.5 ml-0.5 cursor-pointer"
					:class="[editRole.permissions.includes('editTicket') ? 'text-gray-dark-600 bg-gray-light-300': 'text-gray-light-100']" >editTicket</span>
			</div>
		</div>
		<div class="flex justify-around my-2">
			<button 
				
				class="px-2 py-0.5 bg-gray-dark-400 rounded-none font-bold text-gray-light-100">
				Remove Role
			</button>
			<button 
				@click="editProjectRole()"
				class="px-2 py-0.5 bg-gray-dark-400 rounded-none font-bold text-gray-light-100">
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