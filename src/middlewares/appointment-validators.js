import { body, param } from "express-validator";
import { validarCampos } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { userExists } from "../helpers/db-validators.js";

export const createAppointmentValidator = [
    body("date").notEmpty().withMessage("La fecha es requerida"),
    body("pet").notEmpty().withMessage("La mascota es requerida"),
    body("pet").isMongoId().withMessage("No es un ID válido de MongoDB"),
    validarCampos,
    handleErrors
];

export const getUserAppointmentsValidator = [
    param("uid").isMongoId().withMessage("No es un ID valido de MongoDB"),
    param("uid").custom(userExists),
    validarCampos,
    handleErrors
]

export const updateAppointmentValidator = [
    body("date").notEmpty().withMessage("La fecha es requerida"),
    validarCampos,
    handleErrors
]

export const cancelAppointmentValidator = [
    param("id").isMongoId().withMessage("No es un ID valido"),
    validarCampos,
    handleErrors
]
