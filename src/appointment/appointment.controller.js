import Pet from "../pet/pet.model.js";
import Appointment from "../appointment/appointment.model.js";
import { parse } from "date-fns";

export const saveAppointment = async (req, res) => {
  try {
    const data = req.body;

    const isoDate = new Date(data.date);

    if (isNaN(isoDate.getTime())) {
      return res.status(400).json({
        success: false,
        msg: "Fecha inválida",
      });
    }

    const pet = await Pet.findOne({ _id: data.pet });
    if (!pet) {
      return res.status(404).json({ 
        success: false, 
        msg: "No se encontró la mascota" 
      });
    }

    // Verificar si ya existe una cita para la misma mascota y usuario en el mismo día
    const existAppointment = await Appointment.findOne({
      pet: data.pet,
      user: data.user,
      date: {
        $gte: new Date(isoDate).setHours(0, 0, 0, 0),
        $lt: new Date(isoDate).setHours(23, 59, 59, 999),
      },
    });

    if (existAppointment) {
      return res.status(400).json({
        success: false,
        msg: "El usuario y la mascota ya tienen una cita para este día",
      });
    }

    // Verificar si el usuario tiene otra cita a la misma hora
    const userConflict = await Appointment.findOne({
      user: data.user,
      date: isoDate,
    });

    if (userConflict) {
      return res.status(400).json({
        success: false,
        msg: "Ya tienes una cita programada para esta hora con otra mascota",
      });
    }

    const appointment = new Appointment({ ...data, date: isoDate });
    await appointment.save();

    return res.status(200).json({
      success: true,
      msg: `Cita creada exitosamente en fecha ${data.date}`,
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      success: false, 
      msg: "Error al crear la cita", 
      error 
    }); 
  }
};

export const getUserAppointments = async (req, res) => {
  try {
      const { uid } = req.params;
      const { limite = 5, desde = 0 } = req.query
      const query = { user: uid }
      const [total, appointments ] = await Promise.all([
          Appointment.countDocuments(query),
          Appointment.find(query)   
          .skip(Number(desde))
          .limit(Number(limite))
      ])
      return res.status(200).json({
          success: true,
          total,
          appointments
      })
  }catch(err){
      return res.status(500).json({
          success: false,
          message: "Error al obtener las citas",
          error: err.message
      })
  }
}

export const updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { date } = req.body;

        const currentAppointment = await Appointment.findById(id);
        if (!currentAppointment) {
            return res.status(404).json({
                success: false,
                msg: "Cita no encontrada"
            });
        }

        const isoDate = new Date(date);

        if (isNaN(isoDate.getTime())) {
          return res.status(400).json({
            success: false,
            msg: "Fecha inválida",
          });
        }
    
        const userConflict = await Appointment.findOne({
            _id: { $ne: id },
            user: currentAppointment.user,
            date: isoDate,
        });

        if (userConflict) {
            return res.status(400).json({
                success: false,
                msg: "Ya tienes una cita programada para esta hora con otra mascota",
            });
        }

        const appointment = await Appointment.findByIdAndUpdate(id, { date: isoDate }, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Cita Actualizada',
            appointment,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar la cita',
            error: err.message
        });
    }
}

export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params

    const appointment = await Appointment.findByIdAndUpdate(id, {status: "CANCELLED"}, {new: true})

  return res.status(200).json({
            success: true,
            message: "Cita cancelada",
            appointment
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Error al cancelar la cita",
            error: err.message
        })
    }
}

