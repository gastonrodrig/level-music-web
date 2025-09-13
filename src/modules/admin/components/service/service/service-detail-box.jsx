import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { Close,Delete } from "@mui/icons-material";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect } from "react";
export const ServiceDetailBox = ({ 
index,
detail,
initialData = {},
details ={},
onSubmit,
onDelete,
open,
onClose,
loading,
}) => {
    const isEditing = !!details?._id;
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
         

    }= useForm({
        mode: "onBlur",
        defaultValues: {
            ref_price: initialData.ref_price || "",
            field_detail: initialData.field_detail || [],
        },
    });
     const { fields, append, remove } = useFieldArray({
    control,
    name: "details",
  });
  const handleAddField = () => {
    append({ key: "", value: "" });
  };

    useEffect(() => {
        if(open){
            reset({
                field_detail: details.field_detail || [],
            });
        }
    }, [open, details.field_detail, reset]);
    const handleFormSubmit = (data) => {
        const detailsObj = {};
        data.details.forEach(({ key, value }) => {
      if (key) detailsObj[key] = value;
    });
    onSubmit({
      ref_price: data.ref_price,
      details: detailsObj,
    }, index);
    }
    return (
        <Box sx={{ p: 3, borderRadius: 3, bgcolor: "#23293a", mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Detalle #{index + 1}
      </Typography>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <TextField
          label="Precio de Referencia *"
          type="number"
          fullWidth
          sx={{ mb: 2 }}
          {...register("ref_price", { required: "El precio es obligatorio" })}
          error={!!errors.ref_price}
          helperText={errors.ref_price?.message}
        />
        <Typography fontWeight={500} mb={1}>
          Campos del Servicio
        </Typography>
        {fields.length === 0 && (
          <Typography color="text.secondary" mb={2}>
            No hay campos configurados para este detalle.
          </Typography>
        )}
        {fields.map((field, idx) => (
          <Box key={field.id} sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="Nombre del campo"
              {...register(`details.${idx}.key`, { required: "Campo requerido" })}
              error={!!errors.details?.[idx]?.key}
              helperText={errors.details?.[idx]?.key?.message}
              sx={{ flex: 1 }}
               />
            <TextField
              label="Valor"
              {...register(`details.${idx}.value`, { required: "Valor requerido" })}
              error={!!errors.details?.[idx]?.value}
              helperText={errors.details?.[idx]?.value?.message}
              sx={{ flex: 1 }}
            />
            <IconButton onClick={() => remove(idx)} color="error">
              <Delete />
            </IconButton>
          </Box>
        ))}
        <Button
          variant="outlined"
          onClick={handleAddField}
          sx={{ mb: 2, mt: 1 }}
        >
          Agregar Campo
        </Button>
        <Box display="flex" gap={2} mt={2}>
          <Button type="submit" variant="contained" disabled={loading}>
            Guardar Detalle
          </Button>
          {onDelete && (
            <Button
              variant="outlined"
              color="error"
              onClick={() => onDelete(index)}
            >
              Eliminar Detalle
            </Button>
          )}
        </Box>
      </form>
    </Box>
    )
}
