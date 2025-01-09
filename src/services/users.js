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

async function putUser(userId, username, email, fullName, phoneNumber, address, bearToken) {
    const response = await api.put(`/users/${userId}`,
        {
            username :username,
            email: email,
            fullName:fullName,
            phoneNumber: phoneNumber,
            address:address
        },
        {
            headers: {
                Authorization: `Bearer ${bearToken}`,
            },
        })
    .catch(function (error) {
        console.log(error.toJSON());
        return false
    });
    if (response.status === 200) {
        //console.log(`put to ${cartItemId} qty successful`);
        return true; // 返回成功標誌
    } else {
        console.error(`Unexpected status code: ${response.status}`);
        return false; // 返回失敗標誌
    }
}

async function register(userData) {
    const response = await api.post('/users/register',userData)
    .catch(function (error) {
        console.log(error.toJSON());
    });
    const data = await response.data;
    console.log(data)
    return data;
}

export {login, getUser, putUser, register}