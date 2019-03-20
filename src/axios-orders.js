import axios from 'axios';

const instance = axios.create({

    baseURL:'https://my-react-burger-9aae4.firebaseio.com'

})

export default instance;