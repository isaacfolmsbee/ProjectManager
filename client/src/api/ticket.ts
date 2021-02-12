import axios from 'axios';

const url = 'api/ticket/';

export async function getTickets(projectID: string, jwt: string) {
	const response = await axios.get(url + projectID, {
		headers: {
			authtoken: jwt,
		},
	});

	return response.data;
}

export async function getSeverityStat(projectID: string, jwt: string) {
	const response = await axios.get(`${url}severity/${projectID}`, {
		headers: {
			authtoken: jwt,
		},
	});

	return response.data;
}

export async function getTypeStat(projectID: string, jwt: string) {
	const response = await axios.get(`${url}type/${projectID}`, {
		headers: {
			authtoken: jwt,
		},
	});

	return response.data;
}