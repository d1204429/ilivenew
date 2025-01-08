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

// 在 services/order.js 中
export const orderCreditPayment = async (orderId, cardNumber, token) => {
    try {
        const response = await api.post(`/api/v1/orders/${orderId}/payment`, {
            paymentMethod: 'CREDIT_CARD',
            cardNumber: cardNumber
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response;  // 直接返回整個 response
    } catch (error) {
        console.error('信用卡付款請求失敗:', error);
        throw error;  // 拋出錯誤讓調用者處理
    }
};

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
    const response = await api.get('/orders',
        {
            headers: {
                Authorization: `Bearer ${bearToken}`,
            },
        })
    .catch(function (error) {
        console.log(error.toJSON());
    });
    const data = await response.data;
    console.log(data.data.orders)
  return data.data.orders;
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
