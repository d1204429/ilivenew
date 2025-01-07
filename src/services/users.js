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
    console.log(data.accessToken)
  return data;
}

async function getUser(userId, bearToken){
    const response = await api.get(`/users/${userId}`,
        {
            headers: {
                Authorization: `Bearer ${bearToken}`,
            },
        })
        .catch(function (error) {
            console.log(error.toJSON());
            return false
        });
        const data = await response.data;
        return data;
}

export {login, getUser}