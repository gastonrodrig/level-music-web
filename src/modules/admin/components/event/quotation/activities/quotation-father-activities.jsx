import {
  Box,
  Typography,
  IconButton,
  useTheme,
  Button,
} from "@mui/material";
import {
  Add,
  Delete,
} from "@mui/icons-material";
import { useState } from "react";
import {
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import { useScreenSizes } from "../../../../../../shared/constants/screen-width";
import { SubActivityItem, SubActivityModal } from "./";

export const QuotationsFatherSubActivites = ({ index, onDeleteFather }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { isMd } = useScreenSizes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { control, watch } = useFormContext();
  const taskData = watch(`tasks.${index}`);

  const { fields, append, remove } = useFieldArray({
    control,
    name: `tasks.${index}.subtasks`,
  });

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSaveSubActivity = (data) => {
    append(data);
    handleCloseModal();
  };

  const handleDeleteSub = (subIndex) => {
    remove(subIndex);
  };

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
        mb: 3,
      }}
    >
      {/* Encabezado */}
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "flex-start" }}
        mb={2}
        gap={3}
      >
        {/* Izquierda: título, botón y estado */}
        <Box display="flex" flexDirection="column" alignItems="flex-start">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="start"
            gap={1}
            alignContent="center"
          >
            <Typography variant="h6" fontWeight={300}>
              {taskData.task_name}
            </Typography>
            <Typography>
              {taskData.description}
            </Typography>
          </Box>
        </Box>

        {/* Contenedor de botones, evita anidar <button> */}
        <Box display="flex" gap={1} flexDirection={"row"}>

          {/* Botón agregar campo */}
          {!isMd ? (
            <IconButton
              color="primary"
              onClick={handleOpenModal}
              sx={{
                bgcolor: theme.palette.primary.main,
                color: "#fff",
                borderRadius: "12px",
                "&:hover": {
                  bgcolor: theme.palette.primary.dark,
                },
              }}
            >
              <Add />
            </IconButton>
          ) : (
            <Button
              variant="contained"
              onClick={handleOpenModal}
              startIcon={<Add />}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                color: "#fff",
                fontWeight: 200,
              }}
            >
              Agregar Subactividad
            </Button>
          )}
          
          {/* Boton de eliminar campo */}
          <IconButton
            onClick={onDeleteFather}
            sx={{
              bgcolor: theme.palette.error.main,
              color: "#fff",
              borderRadius: 2,
              "&:hover": {
                bgcolor: theme.palette.error.dark,
              },
            }}
          >
            <Delete />
          </IconButton>
        </Box>
      </Box>

      <Box
        sx={{
          mt: 3,
          borderTop: `1px solid ${theme.palette.divider}`,
          pt: 2,
        }}
      >
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
          Sub-Actividades ({fields.length})
        </Typography>

        {fields.length > 0 ? (
          fields.map((subField, subIndex) => (
            <SubActivityItem
              key={subField.id}
              subActivity={subField}
              onDelete={() => handleDeleteSub(subIndex)} 
            />
          ))
        ) : (
          <Typography color="text.secondary" sx={{ fontStyle: "italic" }}>
            No hay sub-actividades registradas para esta actividad.
          </Typography>
        )}
      </Box>
      <SubActivityModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSaveSubActivity}
      />
    </Box>
  );
};
