import { Box, Typography, Divider, useTheme } from "@mui/material";
import {
  Person,
  AccountCircle,
  Business,
  Badge,
  Phone,
  Email,
} from "@mui/icons-material";

export const EventHistoryTab1 = ({ version = {} }) => {
  const theme = useTheme();

  return (
    <Box>
      <Typography
        color="text.secondary"
        sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}
      >
        <Person fontSize="small" /> Datos del cliente
      </Typography>
      <Divider sx={{ my: 1 }} />

      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          p: 2,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        {/* Client type row (different icon) */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <AccountCircle fontSize="small" />
          <Box>
            <Typography fontSize={14} color="text.secondary">
              Tipo de cliente
            </Typography>
            <Typography sx={{ fontWeight: 700 }}>
              {version?.client_type || "Persona"}
            </Typography>
          </Box>
        </Box>

        {/* Document type + number (always shown) */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Badge fontSize="small" />
          <Box>
            <Typography fontSize={14} color="text.secondary">
              # Documento
            </Typography>
            <Typography sx={{ fontWeight: 700 }}>
              {version?.document_type || ""} {version?.document_number || "-"}
            </Typography>
          </Box>
        </Box>

        {/* Conditional: Persona -> nombre y apellido (Person icon); Empresa -> company (Business icon) and contact person */}
        {(version?.client_type || "Persona") === "Empresa" ? (
          <>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Business fontSize="small" />
              <Box>
                <Typography fontSize={14} color="text.secondary">
                  Empresa
                </Typography>
                <Typography sx={{ fontWeight: 700 }}>
                  {version?.company_name || "-"}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Person fontSize="small" />
              <Box>
                <Typography fontSize={14} color="text.secondary">
                  Persona de contacto
                </Typography>
                <Typography sx={{ fontWeight: 700 }}>
                  {version?.contact_person || "-"}
                </Typography>
              </Box>
            </Box>
          </>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Person fontSize="small" />
            <Box>
              <Typography fontSize={14} color="text.secondary">
                Nombre
              </Typography>
              <Typography sx={{ fontWeight: 700 }}>
                {`${version?.first_name || ""} ${
                  version?.last_name || ""
                }`.trim() || "-"}
              </Typography>
            </Box>
          </Box>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Phone fontSize="small" />
          <Box>
            <Typography fontSize={14} color="text.secondary">
              Teléfono
            </Typography>
            <Typography sx={{ fontWeight: 700 }}>
              {version?.phone || "-"}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Email fontSize="small" />
          <Box>
            <Typography fontSize={14} color="text.secondary">
              Email
            </Typography>
            <Typography sx={{ fontWeight: 700 }}>
              {version?.client_email || version?.email || "-"}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};