import axios from 'axios';

const url = 'api/project/';

export async function getProjectNames(jwt: string) {
	const response = await axios.get(url, {
		headers: {
			auth: jwt,
		},
	});

	return response.data;
}
