import { cart, removeFromCart, updateDeliveryOption } from "../../data/cart.js";
import { getProduct, products } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import { deliveryOptions,getDeliveryOption } from "../../data/deliveryOptions.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js"
import { renderPaymentSummary } from "./paymentSummary.js";

export function renderOrderSummary()
{
let cartSummaryHTML='';
function findDeliveryDate(deliveryOption)
{
const today=dayjs();
//console.log(today);
const deliveryDate=today.add(deliveryOption.deliveryDays,'days');
return deliveryDate.format('dddd, MMMM D')
}
cart.forEach((cartItem)=>
{

    const productId=cartItem.productId;
    let matchingProduct=getProduct(productId);
    //console.log(matchingProduct);
    const deliveryOptionId=cartItem.deliveryOptionId;
let deliveryOption=getDeliveryOption(deliveryOptionId);
    const dateStr=findDeliveryDate(deliveryOption);
    cartSummaryHTML+=`
<div class="cart-item-container 
js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
            Delivery date: ${dateStr}
        </div>

        <div class="cart-item-details-grid">
            <img class="product-image"
            src="${matchingProduct.image}">

            <div class="cart-item-details">
            <div class="product-name">
                ${matchingProduct.name}
            </div>
            <div class="product-price">
                $${(formatCurrency(matchingProduct.priceCents))}
            </div>
            <div class="product-quantity">
                <span>
                Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                </span>
                <span class="update-quantity-link link-primary">
                Update
                </span>
                <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                Delete
                </span>
            </div>
            </div>

            <div class="delivery-options">
            <div class="delivery-options-title">
                Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(matchingProduct,cartItem)};
            </div>
        </div>
        </div>

    `
})
function deliveryOptionsHTML(matchingProduct,cartItem)
{
    let html='';
    deliveryOptions.forEach((deliveryOption)=>{
        const today=dayjs();
        const deliveryDate=today.add(
deliveryOption.deliveryDays,
'days'
        );
        const dateString=deliveryDate.format(
            'dddd, MMMM D'
        );
        const priceString=deliveryOption.priceCents===0?'FREE':`${formatCurrency(deliveryOption.priceCents)}-`;
        const isChecked=deliveryOption.id===cartItem.deliveryOptionId;
    html+=`  <div class="delivery-option">
            <input type="radio" 
                class="delivery-option-input js-delivery-option" 
                name="delivery-option-${matchingProduct.id}" 
                data-product-id="${matchingProduct.id}" 
                data-delivery-option-id="${deliveryOption.id}"
                ${isChecked ? 'checked' : ''}>
            <div>
                <div class="delivery-option-date">
                 ${dateString}
                </div>
                <div class="delivery-option-price">
                    ${priceString}- Shipping
                </div>
                </div>
            </div>`
    })
    return html;
}
document.querySelector('.js-order-summary').innerHTML=cartSummaryHTML;
document.querySelectorAll('.js-delete-link')
.forEach((link)=>{
link.addEventListener('click',()=>
{
const productId=link.dataset.productId;
removeFromCart(productId);
const container=document.querySelector(`.js-cart-item-container-${productId}`);
container.remove();
renderPaymentSummary();
//console.log(cart);
})
})
// Attach event listeners for delivery option changes
document.querySelectorAll('.js-delivery-option').forEach((radio) => {
    radio.addEventListener('change', () => {
        const productId = radio.dataset.productId;
        const deliveryOptionId = radio.dataset.deliveryOptionId;
        if (productId && deliveryOptionId) {
            updateDeliveryOption(productId, deliveryOptionId);
            renderOrderSummary();
            renderPaymentSummary();
        } else {
            console.error('Product ID or Delivery Option ID is missing.');
        }
    });
});
}