import bcrypt from "bcryptjs"
//import { json } from "express"
import buyer from "../models/buyer.model.js"


    export const signin = async (req, res) => {
    // this is the signin function for the buyer
        try {
            console.log("Received request body:", req.body)
            // Check if the request body is empty
            
            // Ensure the request body contains the required fields
            const { email, name, password, location } =  req.body || { email:"aime@gmail.com", name:"guetta", password:"6543216", location:{ type: "point", coordinates: [1] } }
            //const { email, name, password, location } = req.body
            const data =  req.body || { email, name, password, location }
            console.log("Received data:", data)

            if (!email || !name || !password || !location) {
                return res.status(400).json({ message: "All fields are required" });
            }

            const existingBuyer = await buyer.findOne({ email })


            if (existingBuyer) {
                return res.status(400).json({ message: "Buyer already exists" })
            }
            const existingname = await buyer.findOne({ name })


            if (existingname) {
                return res.status(400).json({ message: "Name already exists" })
            }
            const validpassword = password.length >= 6
            if (!validpassword) {
                return res.status(400).json({ message: "Password must be at least 6 characters long" })
            }
            // hash password here 
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            const newBuyer = new buyer({
                email: email,
                name:name,   
                password: hashedPassword, // store the hashed password
                location: {
                    type: "Point",
                    coordinates: location.coordinates || [0, 0] // default to [0, 0] if not provided
                },
            })
            await newBuyer.save()
            const buyerWithoutPassword = newBuyer.toObject()
            delete buyerWithoutPassword.password
            
            if(newBuyer) {
                return res.status(201).json({ message: "Buyer created successfully", buyer: buyerWithoutPassword })
            }

        }
        catch (error) {
            console.error("Error during signin:", error)
            return res.status(500).json({ message: `Internal server error: ${error}` })
        }
}


export const login = async (req, res) => {
    // this is the login function for the buyer
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" })
        }
        const existingBuyer = await buyer.findOne({ email })
        if (!existingBuyer) {
            return res.status(404).json({ message: "Buyer not found" })
        }
        const isPasswordValid = await bcrypt.compare(password, existingBuyer.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" })
        }
        const buyerWithoutPassword = existingBuyer.toObject()
        delete buyerWithoutPassword.password
        return res.status(200).json({ message: "Login successful", buyer: buyerWithoutPassword })
    } catch (error) {
        console.error("Error during login:", error)
        return res.status(500).json({ message: `Internal server error: ${error}` })
    }
}

export const getProfile = async (req, res) => {
    // this is the get profile function for the buyer
    try {
        const buyerId = req.params.id
        const existingBuyer = await buyer.findById(buyerId)
        if (!existingBuyer) {
            return res.status(404).json({ message: "Buyer not found" })
        }
        const buyerWithoutPassword = existingBuyer.toObject()
        delete buyerWithoutPassword.password
        return res.status(200).json({ message: "Profile fetched successfully", buyer: buyerWithoutPassword })
    } catch (error) {
        console.error("Error fetching profile:", error)
        return res.status(500).json({ message: `Internal server error: ${error}` })
    }
}

export const logout = (req, res) => {
    // this is the logout function for the buyer
    try {
        // Logic for logging out the buyer (e.g., clearing session or token)
        return res.status(200).json({ message: "Logout successful" })
    } catch (error) {
        console.error("Error during logout:", error)
        return res.status(500).json({ message: `Internal server error: ${error}` })
    }
}

export const getOrders = async (req, res) => {
    // this is the get orders function for the buyer
    try {
        const buyerId = req.params.id
        const existingBuyer = await buyer.findById(buyerId)
        if (!existingBuyer) {
            return res.status(404).json({ message: "Buyer not found" })
        }
        // Assuming orders are stored in the buyer model
        const orders = existingBuyer.orders || []
        return res.status(200).json({ message: "Orders fetched successfully", orders })
    } catch (error) {
        console.error("Error fetching orders:", error)
        return res.status(500).json({ message: `Internal server error: ${error}` })
    }
}

export const createOrder = async (req, res) => {
    // this is the create order function for the buyer
    try {
        const { buyerId, items } = req.body
        if (!buyerId || !items || items.length === 0) {
            return res.status(400).json({ message: "Buyer ID and items are required" })
        }
        const existingBuyer = await buyer.findById(buyerId)
        if (!existingBuyer) {
            return res.status(404).json({ message: "Buyer not found" })
        }
        // Logic to create an order (e.g., saving to database)
        // For now, we will just return a success message
        return res.status(201).json({ message: "Order created successfully", order: { buyerId, items } })
    } catch (error) {
        console.error("Error creating order:", error)
        return res.status(500).json({ message: `Internal server error: ${error}` })
    }
}

export const getCart = async (req, res) => {
    // this is the get cart function for the buyer
    try {
        const buyerId = req.params.id
        const existingBuyer = await buyer.findById(buyerId)
        if (!existingBuyer) {
            return res.status(404).json({ message: "Buyer not found" })
        }
        const cart = existingBuyer.cart || []
        return res.status(200).json({ message: "Cart fetched successfully", cart })
    } catch (error) {
        console.error("Error fetching cart:", error)
        return res.status(500).json({ message: `Internal server error: ${error}` })
    }
}

export const addToCart = async (req, res) => {
    // this is the add to cart function for the buyer
    try {
        const { buyerId, item } = req.body
        if (!buyerId || !item) {
            return res.status(400).json({ message: "Buyer ID and item are required" })
        }
        const existingBuyer = await buyer.findById(buyerId)
        if (!existingBuyer) {
            return res.status(404).json({ message: "Buyer not found" })
        }
        // Logic to add item to cart (e.g., saving to database)
        // For now, we will just return a success message
        return res.status(201).json({ message: "Item added to cart successfully", cartItem: item })
    } catch (error) {
        console.error("Error adding to cart:", error)
        return res.status(500).json({ message: `Internal server error: ${error}` })
    }
}

export const removeFromCart = async (req, res) => {
    // this is the remove from cart function for the buyer
    try {
        const { buyerId, itemId } = req.params
        if (!buyerId || !itemId) {
            return res.status(400).json({ message: "Buyer ID and item ID are required" })
        }
        const existingBuyer = await buyer.findById(buyerId)
        if (!existingBuyer) {
            return res.status(404).json({ message: "Buyer not found" })
        }
        // Logic to remove item from cart (e.g., updating database)
        // For now, we will just return a success message
        return res.status(200).json({ message: "Item removed from cart successfully", itemId })
    } catch (error) {
        console.error("Error removing from cart:", error)
        return res.status(500).json({ message: `Internal server error: ${error}` })
    }
}

export const getWishlist = async (req, res) => {
    // this is the get wishlist function for the buyer
    try {
        const buyerId = req.params.id
        const existingBuyer = await buyer.findById(buyerId)
        if (!existingBuyer) {
            return res.status(404).json({ message: "Buyer not found" })
        }
        const wishlist = existingBuyer.wishlist || []
        return res.status(200).json({ message: "Wishlist fetched successfully", wishlist })
    } catch (error) {
        console.error("Error fetching wishlist:", error)
        return res.status(500).json({ message: `Internal server error: ${error}` })
    }
}

export const addToWishlist = async (req, res) => {
    // this is the add to wishlist function for the buyer
    try {
        const { buyerId, item } = req.body
        if (!buyerId || !item) {
            return res.status(400).json({ message: "Buyer ID and item are required" })
        }
        const existingBuyer = await buyer.findById(buyerId)
        if (!existingBuyer) {
            return res.status(404).json({ message: "Buyer not found" })
        }
        // Logic to add item to wishlist (e.g., saving to database)
        // For now, we will just return a success message
        return res.status(201).json({ message: "Item added to wishlist successfully", wishlistItem: item })
    } catch (error) {
        console.error("Error adding to wishlist:", error)
        return res.status(500).json({ message: `Internal server error: ${error}` })
    }
}

export const removeFromWishlist = async (req, res) => {
    // this is the remove from wishlist function for the buyer
    try {
        const { buyerId, itemId } = req.params
        if (!buyerId || !itemId) {
            return res.status(400).json({ message: "Buyer ID and item ID are required" })
        }
        const existingBuyer = await buyer.findById(buyerId)
        if (!existingBuyer) {
            return res.status(404).json({ message: "Buyer not found" })
        }
        // Logic to remove item from wishlist (e.g., updating database)
        // For now, we will just return a success message
        return res.status(200).json({ message: "Item removed from wishlist successfully", itemId })
    } catch (error) {
        console.error("Error removing from wishlist:", error)
        return res.status(500).json({ message: `Internal server error: ${error}` })
    }
}

export const searchItems = async (req, res) => {
    // this is the search items function for the buyer
    try {
        const { query } = req.query
        if (!query) {
            return res.status(400).json({ message: "Search query is required" })
        }
        // Logic to search items (e.g., querying database)
        // For now, we will just return a success message with dummy data
        const results = [{ id: 1, name: "Sample Item", description: "This is a sample item" }]
        return res.status(200).json({ message: "Search results fetched successfully", results })
    } catch (error) {
        console.error("Error searching items:", error)
        return res.status(500).json({ message: `Internal server error: ${error}` })
    }
}   

export const getLikes = async (req, res) => {
    // this is the get likes function for the buyer
    try {
        const buyerId = req.params.id
        const existingBuyer = await buyer.findById(buyerId)
        if (!existingBuyer) {
            return res.status(404).json({ message: "Buyer not found" })
        }
        const likes = existingBuyer.likes || []
        return res.status(200).json({ message: "Likes fetched successfully", likes })
    } catch (error) {
        console.error("Error fetching likes:", error)
        return res.status(500).json({ message: `Internal server error: ${error}` })
    }
}

export const addLike = async (req, res) => {
    // this is the add like function for the buyer
    try {
        const { buyerId, item } = req.body
        if (!buyerId || !item) {
            return res.status(400).json({ message: "Buyer ID and item are required" })
        }
        const existingBuyer = await buyer.findById(buyerId)
        if (!existingBuyer) {
            return res.status(404).json({ message: "Buyer not found" })
        }
        // Logic to add item to likes (e.g., saving to database)
        // For now, we will just return a success message
        return res.status(201).json({ message: "Item liked successfully", likedItem: item })
    } catch (error) {
        console.error("Error adding like:", error)
        return res.status(500).json({ message: `Internal server error: ${error}` })
    }
}

export const removeLike = async (req, res) => {
    // this is the remove like function for the buyer
    try {
        const { buyerId, itemId } = req.params
        if (!buyerId || !itemId) {
            return res.status(400).json({ message: "Buyer ID and item ID are required" })
        }
        const existingBuyer = await buyer.findById(buyerId)
        if (!existingBuyer) {
            return res.status(404).json({ message: "Buyer not found" })
        }
        // Logic to remove item from likes (e.g., updating database)
        // For now, we will just return a success message
        return res.status(200).json({ message: "Item removed from likes successfully", itemId })
    } catch (error) {
        console.error("Error removing like:", error)
        return res.status(500).json({ message: `Internal server error: ${error}` })
    }
}


