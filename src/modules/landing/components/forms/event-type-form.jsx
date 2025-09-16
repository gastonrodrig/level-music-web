import {
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  TextField,
  CircularProgress,
  useTheme,
  CardMedia,
} from "@mui/material";
import { CheckCircleRounded, Edit } from "@mui/icons-material";
import { useFormContext } from "react-hook-form";
import { useEventTypeStore } from "../../../../hooks";
import { categoriesEvents as categories } from "../../constants";

export const EventTypeForm = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { loading, eventTypes } = useEventTypeStore();

  const { 
    setValue, 
    watch, 
    register,
    formState: { errors },
  } = useFormContext();

  const selectedCategory = watch("eventCategory");
  const selectedType = watch("eventType");
  const customType = watch("customEventType", "");
  const selectedTypeName = watch("event_type_name");

  const otherEventType = eventTypes.find((evt) => evt.type === "Otros");

  const handleCategoryPick = (key) => {
    setValue("eventCategory", key, { shouldValidate: true });
    setValue("eventType", "");
    setValue("customEventType", "");
    setValue("event_type_id", null);
    setValue("event_type_name", null);
  };

  const handleTypePick = (evt) => {
    if (evt.type === "Otros") {
      setValue("eventType", "Otros", { shouldValidate: true });
      setValue("event_type_id", otherEventType?._id);
      setValue("event_type_name", "Otros");
    } else {
      setValue("eventType", evt.type, { shouldValidate: true });
      setValue("event_type_id", evt._id);
      setValue("event_type_name", evt.type);
      setValue("customEventType", "");
    }
  };

  const currentOptions = eventTypes.filter(
    (evt) => evt.category?.toLowerCase() === selectedCategory?.toLowerCase()
  );

  return (
    <Box>
      {/* Encabezado */}
      <Box textAlign="center" my={4}>
        <Typography variant="h5" fontWeight={800} gutterBottom>
          ¿Qué tipo de evento deseas organizar?
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Selecciona primero la categoría de tu evento y luego el tipo específico.
        </Typography>
      </Box>

      {/* Selección categoría */}
      <Grid container spacing={3} mb={4} justifyContent="center">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.key;
          return (
            <Grid item xs={12} md={6} key={cat.key}>
              <Card
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  border: `2px solid ${isSelected ? "#f7931e" : "transparent"}`,
                  boxShadow: isSelected
                    ? "0 10px 28px rgba(247,147,30,.35)"
                    : isDark
                    ? "0 6px 20px rgba(0,0,0,.3)"
                    : "0 6px 20px rgba(2,8,23,.06)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                <CardActionArea onClick={() => handleCategoryPick(cat.key)}>
                  <Box sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      height="180"
                      image={cat.image}
                      alt={cat.title}
                      sx={{ objectFit: "cover" }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        bgcolor: "rgba(0,0,0,0.6)",
                        color: "#fff",
                        px: 2,
                        py: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      {cat.icon}
                      <Typography fontWeight={700}>{cat.title}</Typography>
                      {isSelected && <CheckCircleRounded color="warning" />}
                    </Box>
                  </Box>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {cat.desc}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Subtipos dinámicos */}
      {selectedCategory && (
        <>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Selecciona tu evento {selectedCategory}
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center" my={3}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2}>
              {currentOptions.map((evt) => {
                const isSelected = selectedType === evt.type;
                return (
                  <Grid item xs={12} md={4} key={evt._id}>
                    <Card
                      sx={{
                        border: `2px solid ${
                          isSelected ? "#f7931e" : isDark ? "#494949" : "#efefef"
                        }`,
                        borderRadius: 2,
                        cursor: "pointer",
                      }}
                    >
                      <CardActionArea onClick={() => handleTypePick(evt)}>
                        <CardContent>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography fontWeight={600}>{evt.type}</Typography>
                            {isSelected && (
                              <CheckCircleRounded color="warning" />
                            )}
                          </Stack>
                          <Typography variant="body2" color="text.secondary">
                            {evt.description}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                );
              })}

              {/* Card de "Otros" */}
              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    border: `2px solid ${
                      selectedType === "Otros"
                        ? "#f7931e"
                        : isDark
                        ? "#494949"
                        : "#efefef"
                    }`,
                    borderRadius: 2,
                    cursor: "pointer",
                  }}
                >
                  <CardActionArea
                    onClick={() =>
                      handleTypePick({ type: "Otros", _id: otherEventType?._id })
                    }
                  >
                    <CardContent>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Edit />
                        <Typography fontWeight={600}>Otros</Typography>
                        {selectedType === "Otros" && (
                          <CheckCircleRounded color="warning" />
                        )}
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        Especifica tu tipo de evento
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Campo "Otros" */}
          {selectedType === "Otros" && (
            <Box mt={3}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                gutterBottom
                sx={{ color: "text.primary" }}
              >
                Especifica tu tipo de evento
              </Typography>
              <TextField
                fullWidth
                placeholder="Ej: Reunión familiar, Evento de caridad..."
                {...register("customEventType", {
                  required: "Especifica el tipo de evento",
                  onChange: (e) =>
                    setValue("event_type_name", e.target.value || "Otros"),
                })}
                error={!!errors.customEventType}
                helperText={errors.customEventType?.message}
              />
            </Box>
          )}

          {/* Resumen */}
          {selectedCategory && (
            <Box
              mt={4}
              p={3}
              sx={{
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 2,
                bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0, 0, 0, 0.05)",
              }}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                Tu selección
              </Typography>
              <Typography variant="body2">
                {selectedCategory === "social"
                  ? "Eventos Sociales"
                  : "Eventos Corporativos"}
                {selectedType &&
                  ` > ${
                    selectedType === "Otros"
                      ? customType || "Especificar tipo de evento..."
                      : selectedTypeName
                  }`}
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};
