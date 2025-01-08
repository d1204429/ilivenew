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
    try {
        const response = await api.get('/orders/all', // 修改為正確的端點 /orders/all
            {
                headers: {
                    Authorization: `Bearer ${bearToken}`,
                },
            });

        if (response && response.data) {
            return response.data.orders || []; // 確保返回陣列，即使是空的
        }
        return [];

    } catch (error) {
        console.error('獲取訂單失敗:', error);
        throw error; // 向上拋出錯誤，讓調用方處理
    }
}

async function getOrderDetail(orderId, bearToken) {
    try {
        const response = await api.get(`/orders/${orderId}`,
            {
                headers: {
                    Authorization: `Bearer ${bearToken}`,
                },
            });
        return response.data?.data;  // 直接返回 response.data.data
    } catch (error) {
        console.error('獲取訂單詳情失敗:', error);
        throw error;
    }
}

export {createOrder, orderCreditPayment, orderApplePayPayment, getOrder, getOrderDetail}
