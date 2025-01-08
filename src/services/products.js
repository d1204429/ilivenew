import {api} from '@/utils/axios'

 async function getPromotionProduct() {
    const response = await api.get('/products/recommends')
    .catch(function (error) {
        console.log(error.toJSON());
    });
    const data = await response.data;
    console.log(data)
  return data;
}

async function getProductInfo(id){
    const response = await api.get(`/products/${id}`)
    .catch(function (error) {
        console.log(error.toJSON());
    });
    const data = await response.data;
    //console.log(data)
  return data;
}

async function getProduct(){
    const response = await api.get('/products')
    .catch(function (error) {
        console.log(error.toJSON());
    });
    const data = await response.data;
    //console.log(data)
  return data;
}

async function searchProduct(keyword){
  //console.log(keyword)
    const response = await api.get(`/products/search?keyword=${keyword}`)
    .catch(function (error) {
        console.log(error.toJSON());
    });
    const data = await response.data;
    //console.log(data)
  return data;
}

export {getPromotionProduct, getProductInfo, searchProduct, getProduct}