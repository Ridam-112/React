import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import shopsRouter from "./shops";
import categoriesRouter from "./categories";
import ordersRouter from "./orders";
import homepageRouter from "./homepage";
import serviceAreasRouter from "./service-areas";
import usersRouter from "./users";

const router: IRouter = Router();

router.use(healthRouter);
router.use(productsRouter);
router.use(shopsRouter);
router.use(categoriesRouter);
router.use(ordersRouter);
router.use(homepageRouter);
router.use(serviceAreasRouter);
router.use(usersRouter);

export default router;
