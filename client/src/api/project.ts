import axios from 'axios';

const url = 'api/project/';

export async function getProjectNames(jwt: string) {
	const response = await axios.get(url, {
		headers: {
			authtoken: jwt,
		},
	});

	return response.data;
}
