// users.js
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
    console.log('Login response:', data)
    return data;
}

async function getUser(userId, bearToken){
    console.log('Getting user data for ID:', userId)
    const response = await api.get(`/users/${userId}`,
        {
            headers: {
                Authorization: `Bearer ${bearToken}`,
            },
        })
        .catch(function (error) {
            console.log('Get user error:', error.toJSON());
            return false
        });
    const data = await response.data;
    console.log('User data received:', data)
    return data;
}

async function updateUser(userId, userData, bearToken) {
    console.log('Updating user data:', userData)
    try {
        const response = await api.put(`/users/${userId}`,
            userData,
            {
                headers: {
                    Authorization: `Bearer ${bearToken}`,
                },
            }
        );
        const data = await response.data;
        console.log('Update response:', data)
        return data;
    } catch (error) {
        console.error('Update user error:', error.response || error);
        throw error;
    }
}
async function register(userData) {
    try {
        const response = await api.post('/users/register', userData);
        const data = await response.data;
        console.log('Register response:', data);
        return data;
    } catch (error) {
        console.error('Register error:', error.response || error);
        throw error;
    }
}

export {login, getUser, updateUser, register}
