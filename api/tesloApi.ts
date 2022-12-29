//importamos axios para hacer peticiones http --> yarn add axios
import axios from 'axios';

const tesloApi = axios.create({
    baseURL: '/api'
});

export default tesloApi;