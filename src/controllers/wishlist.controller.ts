import { Wishlist } from '../models/wishlist.model';
import { User } from '../models/user.model';
import { Product } from '../models/product.model';

//get user wishlist
export const getUserWishlist = async (req: any, res: any) => {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if(!wishlist) return res.status(404).send({
        message: 'Wishlist not found for this user'
    })
    res.send({
        message: 'user wishlist successfully retrieved',
        details: wishlist});
};

//add item to wish list
export const addToWishlist = async (req: any, res: any) => {
    //check if request header token is valid: using the auth middle ware in the wishlist routes
    //check if user exist
    const user = await User.findById(req.user._id);
    if (!user) return res.status(400).send({
        message: 'Bad Request: Cannot add item to wish list',
        details: "This user does not exist"
    });
    //check if req.body.item  passed exists
    const item = await Product.findById(req.body.product);
    if(!item) return res.status(400).send({
        message: 'Fatal Error: Cannot add item to wish list',
        details: "This item does not exist"
    });

    //check if wishlist exist for user
    const wishlist = await Wishlist.findOne({ "user": req.user._id });
    if (wishlist) {
       // console.log(req.body.product);
       // console.log(`this is wishlist id: ${wishlist._id}`);
        const updatedWishlist = await Wishlist.findByIdAndUpdate(
            { _id: wishlist._id },
            { $addToSet: { items: req.body } },
            { writeConcern: true, new: true},
        ).populate("items.product");
        return res.send({
            message: "wishlist updated!",
            details: updatedWishlist
        });
    };

    if (!wishlist) {
        let newWishlist = new Wishlist({
            user: req.user._id,
            items: {
                product: req.body.product
            }
        });
        await newWishlist.save();
        const wishlistDetails = await Wishlist.findOne({_id: newWishlist._id}).populate("items.product");
        return res.status(201).send({
            message: "Item added to wishlist!",
            details: wishlistDetails
        });
    }
};

//remove item from wish list
export const removeItemFromWishlist = async (req: any, res: any) => {
    //check if request header token is valid: using the auth middle ware in the wishlist routes
    //check if user exist
    const user = await User.findById(req.user._id);
    console.log(`This is user_id: ${req.user._id}`);
    if (!user) return res.status(400).send({
        message: 'Bad Request: Cannot remove the item from wish list',
        details: "This user does not exist"
    });
      //check if wishlist exist for user
      const wishlistExist = await Wishlist.findOne({ user: req.user._id });
      if(!wishlistExist) return res.status(404).send({
        message: 'Bad Request',
        details: "Cannot find wishlist for this user"
      });
     const removeWishlistItem =  await Wishlist.findOneAndRemove({'items._id': req.params.id});
     if(!removeWishlistItem) return res.status(404).send({
        message: 'Bad Request: Cannot remove the item from wish list',
        details: "This item does not exist in user's wishlist"
     })
     res.send({
        message: 'This item has been removed from the wishlist successfully!',
        details: removeWishlistItem
    });


 };

//delete wishlist
export const deleteWishlist = async (req: any, res: any) => {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send({
        message: 'Bad Request: Cannot remove the item from wishlist',
        details: "This user does not exist"
    });

    //check if wishlist exist for user
    const wishlistExist = await Wishlist.findOne({user: req.user._id});
    if(!wishlistExist) return res.status(404).send({
        message: 'Bad Request',
        details: 'Cannot find wishlist for this user'
    });

    const emptyWishlist = await Wishlist.findByIdAndDelete(req.params.id);
    if(!emptyWishlist) return res.status(404).send({
        message: 'Bad Request: wishlist instance not found',
        details: "no cart instance for this user"
    });

    res.send({
        message: 'Wishlist instance deleted successfully',
        details: emptyWishlist
    });
}
