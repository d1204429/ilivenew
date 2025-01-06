import {api} from '@/utils/axios'

 async function getPromotions() {
    const response = await api.get('/admin/promotions')
    .catch(function (error) {
        console.log(error.toJSON());
    });
    const data = await response.data;
    //console.log(data)
  return data;
}

export {getPromotions}