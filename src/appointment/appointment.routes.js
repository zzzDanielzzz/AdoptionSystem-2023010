import { Router } from "express";
import { saveAppointment, updateAppointment, cancelAppointment} from "./appointment.controller.js";
import { createAppointmentValidator, updateAppointmentValidator, cancelAppointmentValidator } from "../middlewares/appointment-validators.js";

const router = Router();

router.post("/createAppointment", createAppointmentValidator, saveAppointment);
router.put("/updateAppointment/:id", updateAppointmentValidator, updateAppointment)
router.patch("/cancelAppointment/:id", cancelAppointmentValidator, cancelAppointment)


export default router;