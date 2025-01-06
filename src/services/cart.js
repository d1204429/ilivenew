import {api} from '@/utils/axios'

 async function addCart(productId, quantity, bearToken) {
    const response = await api.post('/cart/items/add',
        {
            productId :productId,
            quantity: quantity
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
        console.log('Add to cart successful');
        return true; // 返回成功標誌
    } else {
        console.error(`Unexpected status code: ${response.status}`);
        return false; // 返回失敗標誌
    }
}

async function getCartItems(bearToken) {
    const response = await api.get('/cart/items',
        {
            headers: {
                Authorization: `Bearer ${bearToken}`,
            },
        })
    .catch(function (error) {
        console.log(error.toJSON());
    });
    const data = await response.data;
    //console.log(data)
    return data;
}

async function putCartQty(cartItemId, productId, quantity, bearToken) {
    const response = await api.put(`/cart/items/${cartItemId}`,
        {
            productId :productId,
            quantity: quantity
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


async function delCartItem(cartItemId, bearToken){
    const response = await api.delete(`/cart/items/${cartItemId}`,
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

async function clearCart(cartId, bearToken){
    const response = await api.delete(`/cart/${cartId}`,
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
export {addCart, getCartItems, putCartQty, delCartItem, clearCart}