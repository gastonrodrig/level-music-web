import { useEffect, useMemo, useState } from "react";
import { UseEventTaskStore, useQuotationStore } from "../../../../../hooks";
import {
  Box,
  Typography,
  Button,
  Link,
  useTheme,
} from "@mui/material";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { useScreenSizes } from "../../../../../shared/constants/screen-width";
import { useNavigate } from "react-router-dom";
import { Assignment, PostAdd, Save } from "@mui/icons-material";
import {
  QuotationActivitiesSummery,
  QuotationsFatherSubActivites,
  ActivityFatherModal,
} from "../../../components";

export const EventQuotationsActivitiesPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { isMd } = useScreenSizes();

  const { loading, selected } = useQuotationStore();
  const { startAddEventTasks } = UseEventTaskStore();

  const [isFatherModalOpen, setIsFatherModalOpen] = useState(false);

  const handleOpenFatherModal = () => setIsFatherModalOpen(true);
  const handleCloseFatherModal = () => setIsFatherModalOpen(false);

  const methods = useForm({
    defaultValues: {
      tasks: [], 
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "tasks", // Debe coincidir con el 'defaultValues'
  });

  const { watch, handleSubmit } = methods;

  const taskData = watch("tasks");

  const parentPrices = useMemo(() => {
    if (!Array.isArray(taskData)) return [];
    return taskData.map((task) => {
      if (!task.subtasks) return 0;
      return task.subtasks.reduce((subtotal, sub) => {
        return subtotal + (Number(sub.price) || 0);
      }, 0);
    });
  }, [JSON.stringify(taskData)]);

  useEffect(() => {
    if (!selected) {
      navigate("/admin/quotations");
    }
  }, [selected, navigate]);

  useEffect(() => {
    if (selected && selected.tasks) {
      // Mapeamos los datos del backend (inglés) al formato del formulario (español)
      const tasksParaFormulario = selected.tasks.map((task) => ({
        // Campos del padre
        id_original: task._id, // Guardamos el ID por si lo necesitas para 'update'
        task_name: task.name,
        description: task.description,

        // Mapeamos las sub-tareas
        subtasks: task.subtasks.map((sub) => ({
          id_original: sub._id,
          subtask_name: sub.name,
          phase: sub.phase,
          price: sub.price,
          worker_name: sub.worker_name,
          worker_id: sub.worker,
          storehouse_code: sub.storehouse_code,
          storehouse_movement_type: sub.storehouse_movement_type,
          requires_evidence: sub.requires_evidence,
          is_for_storehouse: sub.is_for_storehouse, // El switch del modal
          // ...mapea cualquier otro campo que tus modales usen
        })),
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
    const tasksArray = data.tasks.map((act) => {
      const formattedSubtasks = act.subtasks.map((sub) => ({
        is_for_storehouse: sub.is_for_storehouse || false,
        subtask_name: sub.subtask_name,
        phase: sub.phase,
        price: sub.price || 0,
        worker_id: sub.worker_id || null,
        requires_evidence: sub.requires_evidence || false,
        storehouse_movement_type: sub.storehouse_movement_type || "",
        storehouse_code: sub.storehouse_code || "pruebita",
      }));
      console.log("Formatted Subtasks:", formattedSubtasks);

      return {
        task_name: act.task_name,
        description: act.description,
        event_id: eventId,
        subtasks: formattedSubtasks,
      };
    });

    console.log("Payload FINAL que se envía al API:", tasksArray);


    if (tasksArray.length > 0) {
      const success = await startAddEventTasks(tasksArray); 
      if (success) {
        navigate("/admin/quotations");
      }
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
        sx={{ px: isMd ? 4 : 0, pt: 2, maxWidth: 1200, margin: "0 auto" }}
        onSubmit={handleSubmit(onSaveAllTasks)}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems={isMd ? "center" : "flex-start"}
          flexDirection={isMd ? "row" : "column"}
        >
          <Box flexDirection={"column"}>
            <Typography variant="h4" sx={{ mb: 1 }}>
              Gestion de actividades
            </Typography>
            <Typography sx={{ mb: 3, fontSize: 16 }} color="text.secondary">
              {eventData.tipo} - {eventData.cliente} - {eventData.codigoEvent}
            </Typography>
          </Box>

          <Link style={{ textDecoration: "none", color: "inherit" }}>
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
                mb: isMd ? 0 : 3,
              }}
            >
              Crear Actividad
            </Button>
          </Link>
        </Box>

        {taskData.length === 0 && (
          <Box
            sx={{
              mb: 3,
              p: 5,
              borderRadius: 3,
              textAlign: "center",
              bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
            }}
          >
            <Assignment sx={{ fontSize: 48, mb: 1 }} />

            <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
              No hay actividades aún
            </Typography>

            <Typography sx={{ fontSize: 16, color: "text.secondary", mt: 1 }}>
              Crea actividades para empezar a planificar este evento.
            </Typography>
          </Box>
        )}

        {fields.map((field, index) => (
          <QuotationsFatherSubActivites
            key={field.id}
            index={index}
            onDeleteFather={() => remove(index)}
          />
        ))}

        <QuotationActivitiesSummery amount={parentPrices} />
        {fields.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<Save />}
              disabled={
                loading ||
                methods.formState.isSubmitting ||
                fields.some(
                  (field, idx) =>
                    !taskData[idx]?.subtasks ||
                    taskData[idx].subtasks.length === 0
                )
              }
              sx={{
                textTransform: "none",
                borderRadius: 2,
                color: "#fff",
                fontWeight: 600,
                px: 4,
                py: 1.5,
              }}
            >
              {methods.formState.isSubmitting
                ? "Guardando..."
                : `Guardar ${fields.length} Actividad(es)`}
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
