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

async function getProductInfo(id){
    const response = await api.get(`products/${id}`)
    .catch(function (error) {
        console.log(error.toJSON());
    });
    const data = await response.data;
    //console.log(data)
  return data;
}

export {getPromotionProduct, getProductInfo}