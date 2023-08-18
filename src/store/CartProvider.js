import { useReducer } from "react";
import CartContext from "./cart-context";
import { act } from "react-dom/test-utils";

const defaultCartState = {
    items:[],
    totalAmount:0
};

const cartReducer = (state,action)=>{

    if(action.type === 'ADD'){
       
        const updatedTotalAmount = state.totalAmount + action.item.price*action.item.amount;
        
        const existingCartItemIndex = state.items.findIndex( (item)=>item.id === action.item.id);
        const existingCartItem = state.items[existingCartItemIndex];
        let updatedItem;
        let updatedItems;
        if(existingCartItem){
            updatedItem = {
                ...existingCartItem,
                amount:existingCartItem.amount + action.item.amount
            }
            updatedItems= [...state.items]
            updatedItems[existingCartItemIndex] = updatedItem
        }else{
            updatedItem = {...action.item};
            updatedItems = state.items.concat(action.item)

        }
        
        return{
            items:updatedItems,
            totalAmount:updatedTotalAmount
        }
    }
    if(action.type === 'REMOVE'){
        console.log('remove');
        console.log(action);
        
        const existingCartItemIndex =  state.items.findIndex( (item)=>item.id === action.id);
        const existingItem = state.items[existingCartItemIndex];
        const updatedTotalAmount = state.totalAmount - existingItem.price;
        let updatedItems;
        if(existingItem.amount === 1){
            updatedItems = state.item.filter( item=>item.id != action.id)
        }else{
            const updatedItem = {...existingItem,amount:existingItem.amount -1}
            updatedItems = [...state.items];
            updatedItem[existingCartItemIndex] = updatedItem;
        }
        return {
            items:updatedItems,
            totalAmount:updatedTotalAmount
        }
    }

    return defaultCartState
}

const CartProvider = (props)=>{
   const [cartState,dispatchCartState]= useReducer(cartReducer,defaultCartState);

    const addItemtoCartHandler = (item) =>{
        dispatchCartState({type:'ADD',item:item})
    };
    const removeItemFromCartHandler = (id)=>{
        console.log(id);
        
        dispatchCartState({type:'REMOVE',id:id})
    };

    const cartContext = {
        items:cartState.items,
        amount:cartState.totalAmount,
        addItem:addItemtoCartHandler,
        removeItem:removeItemFromCartHandler
    };
 return <CartContext.Provider value={cartContext}>
    {props.children}
 </CartContext.Provider>
}
export default CartProvider;