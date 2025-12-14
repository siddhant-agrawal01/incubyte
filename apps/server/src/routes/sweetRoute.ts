import { Router } from "express";
import {
  createSweet,
  getSweets,
  searchSweetsHandler,
  updateSweet,
  deleteSweet,
  purchaseSweet,
  restockSweet,
} from "../controllers/sweetController";
import { authenticate, requireAdmin } from "../middleware/auth";
import { validateBody, validateQuery } from "../middleware/validate";
import {
  createSweetSchema,
  updateSweetSchema,
  purchaseSchema,
  restockSchema,
  sweetListQuerySchema,
  searchQuerySchema,
} from "validation";

const router = Router();

router.get("/", authenticate, validateQuery(sweetListQuerySchema), getSweets);
router.get(
  "/search",
  authenticate,
  validateQuery(searchQuerySchema),
  searchSweetsHandler
);

router.post(
  "/:id/purchase",
  authenticate,
  validateBody(purchaseSchema),
  purchaseSweet
);

router.post(
  "/",
  authenticate,
  requireAdmin,
  validateBody(createSweetSchema),
  createSweet
);
router.put(
  "/:id",
  authenticate,
  requireAdmin,
  validateBody(updateSweetSchema),
  updateSweet
);
router.delete("/:id", authenticate, requireAdmin, deleteSweet);
router.post(
  "/:id/restock",
  authenticate,
  requireAdmin,
  validateBody(restockSchema),
  restockSweet
);

export default router;
