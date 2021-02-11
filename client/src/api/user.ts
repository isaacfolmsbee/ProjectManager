import axios from 'axios';

const url = 'api/user/';

export async function login(email: string, password: string) {
	const response = await axios.post(url + 'login', { email, password });

	return response.data;
}
