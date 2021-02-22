import axios from 'axios';

const url = 'api/user/';

export async function register(
	username: string,
	email: string,
	password: string
) {
	const response = await axios.post(url, {
		username,
		email,
		password,
	});

	return response;
}

export async function login(email: string, password: string) {
	const response = await axios.post(url + 'login', { email, password });
	const userObject = await axios.get(url + 'userdata', {
		headers: {
			Authorization: 'Bearer ' + response.headers.authorization,
		},
	});

	return userObject.data;
}
