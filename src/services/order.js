import {api} from '@/utils/axios'

async function createOrder(shippingAddress, bearToken) {
    const response = await api.post('/orders',
        {
            shippingAddress: shippingAddress
        },
        {
            headers: {
                Authorization: `Bearer ${bearToken}`,
            },
        })
        .catch(function (error) {
            console.log(error.toJSON());
        });
    const data = await response.data;
    console.log(data)
    return data;
}

async function orderCreditPayment(orderId, cardNumber, bearToken){
    const response = await api.post(`/orders/${orderId}/payment`,
        {
            paymentMethod : "CREDIT_CARD",
            cardNumber: cardNumber
        },
        {
            headers: {
                Authorization: `Bearer ${bearToken}`,
            },
        })
        .catch(function (error) {
            console.log(error.toJSON());
        });
    const data = await response.data;
    console.log(data)
    return data;
}

async function orderApplePayPayment(orderId, applePayToken, bearToken){
    const response = await api.post(`/orders/${orderId}/payment`,
        {
            paymentMethod : "APPLE_PAY",
            applePayToken: applePayToken
        },
        {
            headers: {
                Authorization: `Bearer ${bearToken}`,
            },
        })
        .catch(function (error) {
            console.log(error.toJSON());
        });
    const data = await response.data;
    console.log(data)
    return data;
}

async function getOrder(bearToken){
    const response = await api.get('/orders/all',
        {
            headers: {
                Authorization: `Bearer ${bearToken}`,
            },
        })
        .catch(function (error) {
            console.log(error.toJSON());
        });
    const data = await response.data;
    //console.log(data.orders)
    return data.orders;
}

async function getOrderDetail(orderId ,bearToken){
    const response = await api.get(`/orders/${orderId}`,
        {
            headers: {
                Authorization: `Bearer ${bearToken}`,
            },
        })
        .catch(function (error) {
            console.log(error.toJSON());
        });
    const data = await response.data;
    console.log(data.data)
    return data.data;
}

export {createOrder, orderCreditPayment, orderApplePayPayment, getOrder, getOrderDetail}
