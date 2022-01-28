import { Cart } from '../models/cart.model';
import { User } from '../models/user.model';
import { Product } from '../models/product.model';

//get user cart
export const getUserCart = async (req: any, res: any) => {
    const cart = await Cart.findOne({ user: req.user._id, checkoutStatus: false}).populate("items.product"); //, "items.product"
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
    const item = await Product.findById(req.body.product);
    if(!item) return res.status(400).send({
        message: 'Fatal Error: Cannot add item to cart',
        details: "This item does not exist"
    });

    //check if cart exist for user
    const cartExist = await Cart.findOne({ "user": req.user._id, checkoutStatus: false});
    if(cartExist) {
        //update cart instance for user by pushing new Product
        const updatedCart = await  Cart.findByIdAndUpdate({
            _id: cartExist._id
        },
        {$addToSet: {items: req.body }},
       {writeConcern: true, new: true }
        ).populate("items.product"); 
        return res.send({
            message: "cart updated!",
            details: updatedCart
        });
    };

    if(!cartExist) {
        let newCartInstance = new Cart({
            user: req.user._id,
            items: {
                product: req.body.product,
                quantity: req.body.quantity,
                color: req.body.color,
                size: req.body.size,
                price: req.body.price //should be quantity * item price
            }
        });

        await newCartInstance.save();
        const cartDetails = await Cart.findOne({_id: newCartInstance._id})
                            //.populate("user")
                            .populate("items.product");

        return res.status(201).send({
             message: "item added to cart successfully",
             details: cartDetails
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
    const cartExist = await Cart.findOne({ user: req.user._id, checkoutStatus: false});
    if(!cartExist) return res.status(404).send({
        message: 'Bad Request',
        details: "Cannot find cart item for this user"
    });


    const removeCartItem = await Cart.findOneAndUpdate(
        { user: req.user._id, checkoutStatus: false },
        { $pull:  { items: {product: req.params.id}} },
        { writeConcern: true, multi: true, new: true }
       ).populate("items.product");
    if(!removeCartItem) return res.status(404).send({
        message: 'Bad Request: Cannot remove the item from cart',
        details: "This item does not exist in user's cart"
    });

    if(removeCartItem.items.length === 0) return res.send({ message: 'user cart is empty!'});


    res.send({ 
        message: 'item has been removed from the cart and cart instance is updated successfully!',
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
    const cartExist = await Cart.findOne({ user: req.user._id });
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


//update cart item
export const updateCartItem = async (req: any, res: any) => {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(400).send({
        message: 'Bad Request: Cannot add item to cart',
        details: "This user does not exist"
    });

      //check if req.body.item  passed exists
      const item = await Product.findById(req.params.id);
      if(!item) return res.status(400).send({
          message: 'Fatal Error: Cannot update item in cart',
          details: "This item does not exist"
      });

    //update Item
    const updatedItem = await Cart.findOneAndUpdate({ 'items.product': req.params.id}, { $set: { 'items.$.quantity': req.body.quantity, 'items.$.price': req.body.price, 'items.$.color': req.body.color } }, { new: true }).populate("items.product");

   // if (!updatedItem) return res.status(404).send('Item not found');

    res.send({
        message: 'item updated successfully',
        details: updatedItem
    });
    
}


