export let cart=JSON.parse(localStorage.getItem('cart'));
if(!cart)
{

cart= [
        {
        productId:'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity:2,
        deliveryOptionId:'3'
        },
        {
            productId:'15b6fc6f-327a-4ec4-896f-486349e85a3d',
            quantity:1,
            deliveryOptionId:'2'
        }
    ];
}
function saveToStorage()
{
    localStorage.setItem('cart',JSON.stringify(cart));
}
export function addToCart(productId) {
    let matchingItem = cart.find((cartItem) => productId === cartItem.productId);
    
    if (matchingItem) {
        matchingItem.quantity += 1;
    } else {
        cart.push({
            productId: productId,
            quantity: 1,
            deliveryOptionId:'1'
        });
    }
    saveToStorage();
}
export function removeFromCart(productId)
{
    const newCart=[];
    cart.forEach((cartItem)=>{
        if(cartItem.productId!=productId)
        {
            newCart.push(cartItem);
        }
    });
    cart=newCart;
    saveToStorage();
}
export function updateDeliveryOption(productId, deliveryOptionId) {
    // Find the matching cart item
    const cartItem = cart.find((item) => item.productId === productId);
    
    // Check if the cartItem exists before trying to update it
    if (cartItem) {
        cartItem.deliveryOptionId = deliveryOptionId;
    } else {
        console.error(`Cart item with productId ${productId} not found.`);
    }
    saveToStorage();
}
export function updateCartQuantity()
{
    let initialCartQuantity = 0;
cart.forEach((cartItem) => {
    initialCartQuantity += cartItem.quantity;
});
document.querySelector('.js_cart_quantity').innerHTML = initialCartQuantity;
saveToStorage();

}