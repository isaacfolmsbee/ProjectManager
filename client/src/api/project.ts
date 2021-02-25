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
