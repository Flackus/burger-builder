import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-6534f.firebaseio.com/'
});

export default instance;
