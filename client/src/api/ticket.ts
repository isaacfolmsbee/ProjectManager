import axios from 'axios';

const url = 'api/ticket/';

// export async function postTicket(
// 	ticket: {
// 		title: string;
// 		type: string;
// 		severity: string;
// 		description: string;
// 	},
// 	projectID: string,
// 	jwt: string
// ) {
// 	const response = await axios.post(url + projectID, ticket, {
// 		headers: {
// 			auth: jwt,
// 		},
// 	});

// 	return response.data;
// }

export async function getTickets(projectID: string, jwt: string) {
	const response = await axios.get(url + projectID, {
		headers: {
			Authorization: 'Bearer ' + jwt,
		},
	});

	return response.data;
}

export async function postTicket(
	ticket: {
		project: string;
		title: string;
		type: string;
		severity: string;
		description: string;
	},
	jwt: string
) {
	const response = await axios.post(url, ticket, {
		headers: {
			Authorization: 'Bearer ' + jwt,
		},
	});

	return response.data;
}

export async function attachImageToTicket(
	ticketID: string,
	formData: FormData,
	jwt: string
) {
	const response = await axios.post(url + 'attachment/' + ticketID, formData, {
		headers: {
			Authorization: 'Bearer ' + jwt,
		},
	});

	return response.data;
}

// export async function getSeverityStat(projectID: string, jwt: string) {
// 	const response = await axios.get(`${url}severity/${projectID}`, {
// 		headers: {
// 			auth: jwt,
// 		},
// 	});

// 	return response.data;
// }

// export async function getTypeStat(projectID: string, jwt: string) {
// 	const response = await axios.get(`${url}type/${projectID}`, {
// 		headers: {
// 			auth: jwt,
// 		},
// 	});

// 	return response.data;
// }
