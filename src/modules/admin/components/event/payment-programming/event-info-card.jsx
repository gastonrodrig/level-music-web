import { Box, Typography, useTheme } from "@mui/material";
import { useScreenSizes } from "../../../../../shared/constants/screen-width";
import { formatDateString } from "../../../../../shared/utils";

export const EventInfoCard = ({ selected }) => {
  const { isSm } = useScreenSizes();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  if (!selected) return null;

  const client =
    selected?.client_info?.client_type === "Persona"
      ? `${selected?.client_info?.first_name || ""} ${selected?.client_info?.last_name || ""}`.trim()
      : selected?.client_info?.company_name;

  return (
    <Box
      sx={{
        bgcolor: isDark ? "#1f1e1e" : "#f5f5f5",
        mb: 2,
        borderRadius: 2,
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
        gap: { xs: 1, sm: 0 },
        p: 2,
      }}
    >
      <Typography>
        <span style={{ fontWeight: 600 }}>Cliente: </span>
        {client || "—"}
      </Typography>
      <Typography>
        <span style={{ fontWeight: 600 }}>Fecha del evento: </span>
        {formatDateString(selected?.event_date)}
      </Typography>
    </Box>
  );
};
