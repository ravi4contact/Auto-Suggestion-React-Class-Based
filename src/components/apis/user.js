import axios from 'axios';
import { GET_USERS } from "./../utils/ulr";
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';


export const debouncedSearchAPI = debounce(async () => {
	return await axios.get(`${GET_USERS}`)
}, 800, { leading: true });

export const throttledSearchAPI = throttle(async () => {
	return await axios.get(`${GET_USERS}`)
}, 1000, { leading: true });

export const getUsers = async () => (
	axios.get(`${GET_USERS}`)
);
