import {api} from '@/utils/axios'

 async function login(username, password) {
    const response = await api.post('/users/login',
        {
            username: username,
            password: password
        })
    .catch(function (error) {
        console.log(error.toJSON());
    });
    const data = await response.data;
    console.log(data)
  return data;
}

export {login}