import {api} from '@/utils/axios'

 async function getPromotionProduct() {
    const response = await api.get('/admin/product-promotions/products')
    .catch(function (error) {
        console.log(error.toJSON());
    });
    const data = await response.data;
    //console.log(data)
  return data;
}

async function getProductInfo() {
    try {
        const response = await api.get('/products');
        console.log('API Response:', response); // 添加日誌
        return response.data;
    } catch (error) {
        console.error('獲取商品資訊失敗:', error);
        if (error.code === 'ECONNABORTED') {
            throw new Error('請求超時，請稍後重試');
        }
        throw error;
    }
}
async function getProductsByCategory(categoryId) {
    try {
        const response = await api.get(`/products?categoryId=${categoryId}`);
        console.log('API Response:', response); // 添加日誌
        return response.data;
    } catch (error) {
        console.error('獲取分類商品失敗:', error);
        // 檢查是否為超時錯誤
        if (error.code === 'ECONNABORTED') {
            throw new Error('請求超時，請稍後重試');
        }
        throw error;
    }
}

export {   getPromotionProduct,
    getProductInfo,
    getProductsByCategory }
