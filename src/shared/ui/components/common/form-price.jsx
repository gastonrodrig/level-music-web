import { Box, Button, TextField, Typography } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useFormContext } from "react-hook-form";

export const PriceForm = ({ label = "Precio Ref. (S/)", onCancel }) => {
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext(); 

  return (
    <Box
      mt={3}
      p={2}
      sx={{
        borderRadius: 2,
        border: (theme) =>
          `1px solid ${theme.palette.mode === "dark" ? "#444" : "#d3d3d3"}`,
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#2a2a2b4e" : "#f5f5f5",
      }}
    >
      <Typography fontWeight={600} mb={2}>
        Agregar Nuevo Precio
      </Typography>

      <Box display="flex" flexDirection="column">
        <Box sx={{ width: "50%" }}>
          <TextField
            type="number"
            label={label}
            placeholder="Ej: 500.00"
            variant="outlined"
            fullWidth
            size="small"
            sx={{ mb: 1 }}
            {...register("referencePrice", {
              required: "El precio es obligatorio",
              min: { value: 0, message: "El precio debe ser mayor a 0" },
            })}
            error={!!errors.referencePrice}
            helperText={errors.referencePrice?.message}
          />
        </Box>

        <Box display="flex" gap={2} mt={1}>
          <Button
            variant="contained"
            type="submit"
            startIcon={<SaveIcon />}
            sx={{
              backgroundColor: (theme) => theme.palette.primary.main,
              color: "#fff",
              textTransform: "none",
              borderRadius: 2,
              fontWeight: 600,
              "&:hover": {
                backgroundColor: (theme) => theme.palette.primary.dark,
              },
            }}
          >
            Guardar Precio
          </Button>

          <Button
            variant="contained"
            onClick={() =>
              onCancel ? onCancel() : setValue("showPriceForm", false)
            }
            sx={{
              backgroundColor: "#363c4e",
              color: "#fff",
              textTransform: "none",
              borderRadius: 2,
              "&:hover": { backgroundColor: "#333" },
            }}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
