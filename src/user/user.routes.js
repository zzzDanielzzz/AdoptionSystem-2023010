import { Router } from "express"
import { getUserById, getUsers, deleteUser, updatePassword, updateUser, getUserAppointments } from "./user.controller.js"
import { getUserByIdValidator, deleteUserValidator, updatePasswordValidator, updateUserValidator, getUserAppointmentsValidator} from "../middlewares/user-validators.js"

const router = Router()

router.get("/findUser/:uid", getUserByIdValidator, getUserById)

router.get("/", getUsers)

router.delete("/deleteUser/:uid", deleteUserValidator, deleteUser)

router.patch("/updatePassword/:uid", updatePasswordValidator, updatePassword)

router.put("/updateUser/:uid", updateUserValidator, updateUser)

router.get("/getAppointments/:uid", getUserAppointmentsValidator, getUserAppointments);



export default router
