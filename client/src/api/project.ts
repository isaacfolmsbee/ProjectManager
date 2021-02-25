import axios from 'axios';

const url = 'api/project/';

export async function getProjectNames(jwt: string) {
	const response = await axios.get(url, {
		headers: {
			Authorization: 'Bearer ' + jwt,
		},
	});

	return response.data;
}

export async function getUnassignedUsers(projectID: string, jwt: string) {
	const response = await axios.get(url + 'unassigned/' + projectID, {
		headers: {
			Authorization: 'Bearer ' + jwt,
		},
	});

	return response.data;
}

export async function getRoles(projectID: string, jwt: string) {
	const response = await axios.get(url + projectID + '/role', {
		headers: {
			Authorization: 'Bearer ' + jwt,
		},
	});

	return response.data;
}

export async function addUserToProject(projectID: string, userID: string, roleID: string, jwt: string) {
	const response = await axios.post(`${url}${projectID}/user`,
		{
			_id: userID,
			role: roleID,
		},
		{
		headers: {
			Authorization: 'Bearer ' + jwt,
		},
	});

	return response.data;
}

export async function postProject(name: string, description: string, jwt: string) {
	const response = await axios.post(url,
		{
			name,
			description,
		},
		{
		headers: {
			Authorization: 'Bearer ' + jwt,
		},
	});

	return response.data;
}
