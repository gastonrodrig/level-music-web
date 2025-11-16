
import { useEffect, useMemo, useState } from "react";
import {UseEventTaskStore, useQuotationStore,} from "../../../../../hooks";
import { Box, Typography, Button, TextField,useTheme, Link} from "@mui/material";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { useScreenSizes } from "../../../../../shared/constants/screen-width";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { PostAdd, Edit, Payments,History, Assignment,Save } from "@mui/icons-material";
import { QuotationActivitiesSummery, QuotationsFatherSubActivites, ActivityFatherModal } from "../../../components";


export const EventQuotationsActivitiesPage = () => {

const theme = useTheme();
const isDark = theme.palette.mode === "dark";
const navigate = useNavigate();
const dispatch = useDispatch();
const { isLg } = useScreenSizes();

  const {
    quotations,
    total,
    loading,
    selected,
  } = useQuotationStore();
  
  const {
    startAddEventTasks,
  } = UseEventTaskStore();
  
  
  const [isFatherModalOpen, setIsFatherModalOpen] = useState(false);

  
  const handleOpenFatherModal = () => setIsFatherModalOpen(true);
  const handleCloseFatherModal = () => setIsFatherModalOpen(false);
  const methods = useForm({
      defaultValues: {
        tasks: [], // Aquí vivirán nuestras Actividades Padre
      },
    });
   const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "tasks", // Debe coincidir con el 'defaultValues'
  }); 
  const { watch } = methods;
  const taskData = watch(`tasks`);
  const parentPrices = useMemo(() => {
    if (!taskData) return [];
    return taskData.map(task => 
      task.subtasks.reduce((subtotal, sub) => {
        return subtotal + (Number(sub.price) || 0);
      }, 0)
    );
  }, [taskData]);

  useEffect(() => {
    if(!selected){
      navigate('/admin/quotations');
    }

  }, [selected, navigate]);

  useEffect(() => {
    if (selected && selected.tasks) {
      // Mapeamos los datos del backend (inglés) al formato del formulario (español)
      const tasksParaFormulario = selected.tasks.map(task => ({
        // Campos del padre
        id_original: task._id, // Guardamos el ID por si lo necesitas para 'update'
        name: task.name,
        description: task.description,
        
        // Mapeamos las sub-tareas
        subtasks: task.subtasks.map(sub => ({
          id_original: sub._id,
          name: sub.name,
          phase: sub.phase,
          price: sub.price,
          worker_name: sub.worker_name,
          requires_evidence: sub.requires_evidence,
          is_for_storehouse: sub.is_for_storehouse, // El switch del modal
          // ...mapea cualquier otro campo que tus modales usen
        }))
      }));
      
      // ¡Aquí está la magia!
      methods.reset({ tasks: tasksParaFormulario });
    }
  }, [selected, methods.reset]);

  const handleSaveFatherActivity = (data) => {
    // 'data' es el objeto del formulario del modal
    append({
      ...data,
      subtasks: [], // Añadimos el array vacío para las sub-tareas
    });
    handleCloseFatherModal();
  };
  const onSaveAllTasks = async (data) => {
    const eventId = selected?._id;
    if (!eventId) {
      console.error("No hay cotización seleccionada");
      return;
    }

    // El 'data' ya tiene casi todo. Solo necesitamos mapearlo
    // para añadir el eventId y limpiar los campos.
    const tasksArray = data.tasks.map(act => {
      
      const formattedSubtasks = act.subtasks.map(sub => ({
        name: sub.name,
        phase: sub.phase,
        price: sub.price || 0,
        worker_name: sub.worker_name,
        status: sub.status,
        requires_evidence: sub.requires_evidence || false,
        is_for_storehouse: sub.is_for_storehouse || false,
        // ...otros campos
      }));
      console.log("Formatted Subtasks:", formattedSubtasks);

      return {
        name: act.name,
        description: act.description,
        event: eventId,
        subtasks: formattedSubtasks,
      };
    });

     const success = await startAddEventTasks(tasksArray);
     if (success) {
       methods.reset(); // Limpia el formulario
     }
  };

  const eventData = {
      tipo: selected?.event_type_name || "N/A",
      cliente: `${selected?.first_name || ""} ${selected?.last_name || ""}`,
      codigoEvent: selected?.event_code || "N/A",
    };


return (
    <FormProvider {...methods}>
    <Box
        component="form"
        sx={{borderRadius: 2,}}
        onSubmit={methods.handleSubmit(onSaveAllTasks)}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 3, py: 2 }}
        >
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: 24 }}>
              Gestion de actividades 
            </Typography>
            <Typography sx={{ color: "text.secondary", fontSize: 16 }}>
              {eventData.tipo} - {eventData.cliente} - {eventData.codigoEvent}
            </Typography>
          </Box>
          <Link  style={{ textDecoration: 'none', color: 'inherit' }}>
            <Button
              variant="contained"
              startIcon={<PostAdd />}
              onClick={handleOpenFatherModal}
              sx={{
                backgroundColor: "#212121",
                color: "#fff",
                borderRadius: 2,
                textTransform: "none",
                px: 3,
                py: 1.5,
              }}
            >
              {isLg ? "Crear Actividad padre" : "Actividad padre"}
            </Button>
          </Link>
        </Box>

        <Box
          display="flex"
          justifyContent="start"
          alignItems="center"
          sx={{
            px: 3,
            pb: { xs: 1, lg: 3 },
            width: { xs: "100%", sm: "300px" },
          }}
        >
          
        </Box>
        {fields.map((field, index) => (
          <QuotationsFatherSubActivites
            key={field.id} // <-- ¡Usa el 'id' de RHF!
            index={index} // <-- Pasa el índice
            onDeleteFather={() => remove(index)} // <-- Pasa la función 'remove'
            // Ya no necesitas pasar 'actividades'
          />
        ))}
        <QuotationActivitiesSummery amount={parentPrices}/> 
        {fields.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 3 }}>
            <Button
              type="submit" // <-- ¡Clave!
              variant="contained"
              color="primary"
              startIcon={<Save />}
              disabled={loading || methods.formState.isSubmitting}
              sx={{
                textTransform: "none", borderRadius: 2, color: "#fff",
                fontWeight: 600, px: 4, py: 1.5,
              }}
            >
              {methods.formState.isSubmitting 
                ? "Guardando..." 
                : `Guardar ${fields.length} Actividad(es)`
              }
            </Button>
          </Box>
        )}

         
      </Box>
      <ActivityFatherModal
        open={isFatherModalOpen}
        onClose={handleCloseFatherModal}
        onSubmit={handleSaveFatherActivity}
      />
    </FormProvider>
  );
};