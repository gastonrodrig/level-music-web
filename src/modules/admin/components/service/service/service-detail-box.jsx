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
  Grid
} from "@mui/material";
import { Close,Delete, Add } from "@mui/icons-material";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect } from "react";
export const ServiceDetailBox = ({ 
index,
initialData = {},
onSubmit,
onDelete,
open,
onAddField,
onClose,
loading,
onRemoveField,
fields = [],
}) => {
    
    const {
        register,
        handleSubmit,
        reset,
        watch,
        control,
        formState: { errors },
    }= useForm({
        mode: "onBlur",
        defaultValues: {
            ref_price: initialData.ref_price || "",
            details: initialData.details || { },
        },
    });
const watchedRefPrice = watch("ref_price");
const watchedDetails = watch("details");


   useEffect(() => {
 
    onSubmit({
      ref_price: watchedRefPrice,
      details: watchedDetails,
    }, index);
  
  // eslint-disable-next-line
}, [watchedRefPrice, watchedDetails]);
      const handleFormSubmit = (data) => {
        const detailsObj = {};
        fields.forEach((field) => {
          detailsObj[field.name] = data.details?.[field.name];
        });
        onSubmit({
          ref_price: data.ref_price,
          details: detailsObj,
        }, index);
      };
    return (
        <Box sx={{ p: 3, borderRadius: 3, bgcolor: "#1f1e1e", mb: 2 }}>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="h6" sx={{ mb: 1, mt:1 }}>
        Detalle #{index + 1}
      </Typography>
      {onDelete && (
            <IconButton
              color="error"
              onClick={() => onDelete(index)}
              sx={{ ml: 1 , bgcolor:'#b80f42ff', color:'white', borderRadius:2}}
            >
               <Delete />
            </IconButton>
          )}
          </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography fontWeight={500} mb={1}>
          Campos del Servicio
        </Typography>
         <Button
          variant="outlined"
          onClick={onAddField}
          sx={{ mb: 2, mt: 1, bgcolor: '#ffffffff', color: '#000000ff', borderRadius: 2, textTransform: 'none' }}
          startIcon={<Add />}
        >
          Agregar Campo
        </Button>
          </Box>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Grid container spacing={2}>
          {/* Precio de Referencia ocupa toda la fila */}
          <Grid item xs={12}>
            <Typography fontWeight={500} mb={1} mt={1}>
              Precio de Referencia *
            </Typography>
            <TextField
              label="0"
              type="number"
              fullWidth
              sx={{ mb: 2 }}
              {...register("ref_price", { required: "El precio es obligatorio" })}
              error={!!errors.ref_price}
              helperText={errors.ref_price?.message}
            />
          </Grid>
        
        {fields.length === 0 && (
          <Grid item xs={12}>
            <Typography color="text.secondary" mb={2}>
              No hay campos configurados para este detalle.
            </Typography>
          </Grid>
        )}
         {fields.map((field, idx) => (
      <Grid item xs={12} sm={6} key={idx}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography sx={{ mb: 0.5 }}>
              {field.name}
              {field.required && (
                <Typography component="span" color="error" sx={{ ml: 0.5 }}>*</Typography>
              )}
            </Typography>
            <IconButton onClick={() => onRemoveField(idx)} color="error">
            <Delete />
          </IconButton>
          </Box>
            <TextField
              {...register(`details.${field.name}`, { required: field.required ? "Campo requerido" : false })}
              error={!!errors.details?.[field.name]}
              helperText={errors.details?.[field.name]?.message}
              fullWidth
              sx={{ mb: 0 }}
            />
          </Box>
          
        </Box>
        
      </Grid>
    ))}
  </Grid>
      </form>
    </Box>
    )
}
