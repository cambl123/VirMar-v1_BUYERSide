import jwt from 'jsonwebtoken';
import 'dotenv/config';

const token = jwt.sign({ foo: 'bar' }, process.env.JWT_SECRET_SELLER, { expiresIn: '1d' });
console.log('Token:', token);

jwt.verify(token, process.env.JWT_SECRET_SELLER, (err, decoded) => {
  if (err) {
    console.error('Verify error:', err);
  } else {
    console.log('Decoded:', decoded);
  }
});




// console.log(email)

    //check for existing email
//     const emailExist = await Seller.findOne({email})

//     if(emailExist){return res.status(404).json({message:"existing email"})}

//     const nameExist = await Seller.findOne({name})

//     if(nameExist){return res.status(404).json({message:"existing username"})}

//     const newSeller = new Seller({
//         name:name,
//         password:password, //i will hash it later
//         email:email,
//         fullname:fullname,
//         phone:phone
//     })

//     if(newSeller){
//       await newSeller.save();

//       const store  = await Store.create({
//         name: `${newSeller.name}'s Store`,
//         seller_id: newSeller._id // Use seller_id as required by your Store schema
//       });

//       // Optionally, you can associate the store with the seller if needed
//       // newSeller.store = store._id;
//       // await newSeller.save();

//       // Token and response
//       const { token, seller: SellerNoPassword } = giveTokenAndCookieForSeller(res, newSeller);

//       res.status(201).json({
//         message: "seller created successfully",
//         seller: SellerNoPassword
//       });
//       return;
//     }

//     const { token, seller: SellerNoPassword } = giveTokenAndCookieForSeller(res, newSeller);


//     res.status(201).json({
//     message: "seller created successfully",
//     seller: SellerNoPassword
// });
//     // const SellerNoPassword = await Seller.findById(newSeller._id).select('-password')
//     // res.status(201).json({
//     //     message:"seller created successfully",
//     //     seller:SellerNoPassword
//     // })