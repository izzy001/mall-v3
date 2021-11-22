import { Cart } from '../models/cart.model';
import { User } from '../models/user.model';

//get user cart
export const getUserCart = async (req: any, res: any) => {
    const cart = await Cart.findOne({ user_id: req.user._id, checkoutStatus: false})
   //.populate(["user_id"]); //, "items.product"
    if(!cart) return res.status(404).send({ message: 'There is no cart instance for user'});
    if(cart.items.length === 0) return res.send({ message: 'user cart is empty!'});
    res.send({
        message: 'user cart successfully retrieved',
        details: cart
    });
};

//add item to Cart
export const addToCart = async (req: any, res: any) => {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(400).send({
        message: 'Bad Request: Cannot add item to cart',
        details: "This user does not exist"
    });

     //check if req.body.item  passed exists
    // const item = await Product.findById(req.body.item);
    // if(!item) return res.status(400).send({
    //     message: 'Fatal Error: Cannot add item to wish list',
    //     details: "This item does not exist"
    // });

    //check if cart exist for user
    const cartExist = await Cart.findOne({ "user_id": req.user._id, checkoutStatus: false});
    if(cartExist) {
        //update cart instance for user by pushing new Product
        return res.send({
            message: "cart updated!",
           // details: updatedWishlist
        });
    };

    if(!cartExist) {
        let newCartInstance = new Cart({
            user_id: req.user._id,
            items: {
                product_id: req.body.product_id,
                quantity: req.body.quantity,
                color: req.body.color,
                size: req.body.size,
                price: req.body.price //should be quantity * item price
            }
        });

        await newCartInstance.save();
        return res.send({
             message: "item added to cart successfully",
             details: newCartInstance
        
        });
    }
    
};


//remove item from cart
export const removeItemFromCart = async (req: any, res: any) => {
    const user = await User.findById(req.user._id);
    console.log(`This is user_id: ${req.user._id}`);
    if (!user) return res.status(404).send({
        message: 'Bad Request: Cannot remove the item from cart',
        details: "This user does not exist"
    });

    //check if cart exist for user
    const cartExist = await Cart.findOne({ user_id: req.user._id });
    if(!cartExist) return res.status(404).send({
        message: 'Bad Request',
        details: "Cannot find cart for this user"
    });

    const removeCartItem = await Cart.findOneAndRemove({'items._id': req.params.id});
    if(!removeCartItem) return res.status(404).send({
        message: 'Bad Request: Cannot remove the item from cart',
        details: "This item does not exist in user's cart"
    });

    res.send({ 
        message: 'This item has been removed from the cart successfully!',
        details: removeCartItem
    });

};

//delete user Cart
export const deleteUserCart = async (req: any, res: any) => {
    const user = await User.findById(req.user._id);
    console.log(`This is user_id: ${req.user._id}`);
    if (!user) return res.status(404).send({
        message: 'Bad Request: Cannot remove the item from cart',
        details: "This user does not exist"
    });

    //check if cart exist for user
    const cartExist = await Cart.findOne({ user_id: req.user._id });
    if(!cartExist) return res.status(404).send({
        message: 'Bad Request',
        details: "Cannot find cart for this user"
    });

    const emptyCart = await Cart.findByIdAndDelete(req.params.id);
    if(!emptyCart) return res.status(404).send({
        message: 'Bad Request: cart instance not found',
        details: "no cart instance for this user"
    });

    res.send({
        message: 'Cart instance deleted successfully',
        details: emptyCart
    });
};


