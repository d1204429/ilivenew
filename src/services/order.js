import {api} from '@/utils/axios'

// 創建訂單
async function createOrder(shippingAddress, bearToken) {
    try {
        const response = await api.post('/orders',
            {
                shippingAddress: shippingAddress
            },
            {
                headers: {
                    Authorization: `Bearer ${bearToken}`,
                },
            });
        return response.data;
    } catch (error) {
        console.error('創建訂單失敗:', error);
        throw error;
    }
}

// 信用卡支付
async function orderCreditPayment(orderId, cardNumber, bearToken) {
    try {
        const response = await api.post(`/orders/${orderId}/payment`,
            {
                paymentMethod: "CREDIT_CARD",
                cardNumber: cardNumber
            },
            {
                headers: {
                    Authorization: `Bearer ${bearToken}`,
                },
            });
        return response.data;
    } catch (error) {
        console.error('信用卡支付失敗:', error);
        throw error;
    }
}

// Apple Pay 支付
async function orderApplePayPayment(orderId, applePayToken, bearToken) {
    try {
        const response = await api.post(`/orders/${orderId}/payment`,
            {
                paymentMethod: "APPLE_PAY",
                applePayToken: applePayToken
            },
            {
                headers: {
                    Authorization: `Bearer ${bearToken}`,
                },
            });
        return response.data;
    } catch (error) {
        console.error('Apple Pay 支付失敗:', error);
        throw error;
    }
}

// 獲取所有訂單
async function getOrder(bearToken) {
    try {
        const response = await api.get('/orders/all',
            {
                headers: {
                    Authorization: `Bearer ${bearToken}`,
                },
            });
        // 確保返回陣列，即使是空的
        return response?.data?.orders || [];
    } catch (error) {
        console.error('獲取訂單列表失敗:', error);
        throw error;
    }
}

// 獲取訂單詳情
async function getOrderDetail(orderId, bearToken) {
    try {
        const response = await api.get(`/orders/${orderId}`,
            {
                headers: {
                    Authorization: `Bearer ${bearToken}`,
                },
            });
        return response.data?.data;
    } catch (error) {
        console.error('獲取訂單詳情失敗:', error);
        throw error;
    }
}

export {createOrder, orderCreditPayment, orderApplePayPayment, getOrder, getOrderDetail}
