import axios from 'axios';
import { GET_USERS } from "./../utils/ulr";
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';


export const debouncedSearchAPI = debounce(async () => {
	return await axios.get(`${GET_USERS}`)
}, 800, { leading: true });

export const throttledSearchAPI = throttle(async () => {
	return await axios.get(`${GET_USERS}`)
}, 800, { leading: true });



export const getUsers = async () => {
	return await axios.get(`${GET_USERS}`)
};


/*export const throttledSearchAPI =  (func, interval) => {
	var timeout;
	return async function() {
	  var context = this, args = arguments;
	  var later =  function () {
		timeout = false;
	  };
	  if (!timeout) {
		timeout = true;
		setTimeout(later,  interval || 1000)
		return await axios.get(`${GET_USERS}`)
	  }
	}
  }


  export const debouncedSearchAPI  = (func, interval)  => {
	var timeout;
	return function () {
	  var context = this, args = arguments;
	  var later = async function () {
		timeout = null;
		return await axios.get(`${GET_USERS}`)
	  };
	  clearTimeout(timeout);
	  timeout = setTimeout(later, interval || 1000);
	}
  }*/


