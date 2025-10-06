import { Box, Typography } from "@mui/material";

export const StepHeader = ({ n = 1, label = "Paso", sx = {} }) => (
  <Box sx={{ display: "flex", alignItems: "center", mb: 2, mt: 2, ...sx }}>
    <Box
      sx={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        bgcolor: "grey.900",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.875rem",
        fontWeight: "bold",
        mr: 1.5,
      }}
    >
      {n}
    </Box>
    <Typography variant="subtitle1" fontWeight={600}>
      {label}
    </Typography>
  </Box>
);
