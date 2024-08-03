import { Router } from "express";
import userRoutes from "./users.mjs";
import productRoutes from "./products.mjs";
const route = Router()

route.use(userRoutes);  // Use userRoutes for '/api/users'
route.use(productRoutes);  // Use productRoutes for '/api/products'

export default route