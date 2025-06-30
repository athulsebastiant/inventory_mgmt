import express from "express";
import {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
  getClientCount,
} from "../controllers/clientControllers.js";
import protect from "../middleware/authMiddleware.js";
const router = express.Router();

router.use(protect);

router.post("/", createClient);
router.get("/", getAllClients);
router.get("/:id", getClientById);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);
router.get("/clients/count", getClientCount);

export default router;
