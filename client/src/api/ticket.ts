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

export async function getTicket(ticketID: string, jwt: string) {
	const response = await axios.get(url + 'ticket/' + ticketID, {
		headers: {
			Authorization: 'Bearer ' + jwt,
		},
	});

	return response.data;
}

export async function getTickets(projectID: string, jwt: string) {
	const response = await axios.get(url + projectID, {
		headers: {
			Authorization: 'Bearer ' + jwt,
		},
	});

	return response.data;
}

export async function getAssignedTickets(projectID: string, jwt: string) {
	const response = await axios.get(`${url}assigned/${projectID}`, {
		headers: {
			Authorization: 'Bearer ' + jwt,
		},
	});

	return response.data;
}

export async function getUnassignedTickets(projectID: string, jwt: string) {
	const response = await axios.get(`${url}unassigned/${projectID}`, {
		headers: {
			Authorization: 'Bearer ' + jwt,
		},
	});

	return response.data;
}

export async function getActiveTickets(projectID: string, jwt: string) {
	const response = await axios.get(`${url}active/${projectID}`, {
		headers: {
			Authorization: 'Bearer ' + jwt,
		},
	});

	return response.data;
}

export async function getClosedTickets(projectID: string, jwt: string) {
	const response = await axios.get(`${url}closed/${projectID}`, {
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

export async function postComment(text: string, ticketID: string, jwt: string) {
	const response = await axios.post(url + ticketID + '/comment',
		{
			text,
		},
		{
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

export async function editTicket(status: string, severity: string, ticketID: string, jwt: string) {
	const response = await axios.put(url + ticketID,
		{
			status,
			severity,
		},
		{
		headers: {
			Authorization: 'Bearer ' + jwt,
		},
	});

	return response.data;
}

export async function removeUserFromTicket(ticketID: string, userID: string, jwt: string) {
	const response = await axios.delete(`${url}${ticketID}/user/${userID}`,
		{
		headers: {
			Authorization: 'Bearer ' + jwt,
		},
	});

	return response.data;
}

export async function getEligibleUsers(ticketID: string, jwt: string) {
	const response = await axios.get(`${url}eligibleusers/${ticketID}`,
		{
		headers: {
			Authorization: 'Bearer ' + jwt,
		},
	});

	return response.data;
}

export async function assignUserToTicket(ticketID: string, userID: string,	jwt: string) {
	const response = await axios.post(`${url}${ticketID}/user/${userID}`, {}, {
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
