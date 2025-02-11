import { Router } from "express";
import { saveAppointment, updateAppointment, cancelAppointment, getUserAppointments} from "./appointment.controller.js";
import { createAppointmentValidator, updateAppointmentValidator, cancelAppointmentValidator, getUserAppointmentsValidator } from "../middlewares/appointment-validators.js";


const router = Router();

router.post("/createAppointment", createAppointmentValidator, saveAppointment);
router.patch("/updateAppointment/:id", updateAppointmentValidator, updateAppointment)
router.delete("/cancelAppointment/:id", cancelAppointmentValidator, cancelAppointment)
router.get("/getUserAppointments/:uid", getUserAppointmentsValidator, getUserAppointments)


export default router;