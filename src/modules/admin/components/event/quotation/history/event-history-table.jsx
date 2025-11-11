import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Typography,
  Chip,
  useTheme,
  Button,
  Tooltip,
  Stack,
} from "@mui/material";
import { Article, AccessTime, Visibility } from "@mui/icons-material";
import { formatEventVersions } from "../../../../../../shared/utils";

export const EventHistoryTable = ({ versions = [], onView }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        mt: 1,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        overflowX: "auto", // 👉 scroll horizontal en pantallas pequeñas
        WebkitOverflowScrolling: "touch",
      }}
    >
      <Table sx={{ minWidth: 500 }}>
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: isDark ? "#151515" : "#e0e0e0",
            }}
          >
            {["Versión", "Fecha", "Monto", "Estado", "Acciones"].map(
              (col, i) => (
                <TableCell key={i} sx={{ fontWeight: 700 }}>
                  {col}
                </TableCell>
              )
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {versions.map((v) => (
            <TableRow
              key={v.version}
              sx={{
                backgroundColor: isDark ? "#1f1e1e" : "#f5f5f5",
                borderLeft: v.is_latest
                  ? `4px solid ${theme.palette.primary.main}`
                  : `4px solid transparent`,
                "&:not(:last-child)": {
                  borderBottom: `1px solid ${theme.palette.divider}`,
                },
              }}
            >
              <TableCell sx={{ py: 2 }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Article
                    fontSize="small"
                    sx={{ color: theme.palette.text.primary, opacity: 0.9 }}
                  />
                  <Typography sx={{ fontWeight: 700 }}>{v.version}</Typography>
                </Box>
              </TableCell>

              <TableCell sx={{ py: 2 }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <AccessTime fontSize="small" />
                  <Typography>{formatEventVersions(v)}</Typography>
                </Box>
              </TableCell>

              <TableCell sx={{ py: 2, fontWeight: 700 }}>
                S/ {v.estimated_price.toFixed(2)}
              </TableCell>

              <TableCell sx={{ py: 2 }}>
                <Chip
                  label={v.is_latest ? "Actual" : v.status}
                  size="small"
                  color={v.is_latest ? "success" : "default"}
                />
              </TableCell>

              <TableCell sx={{ py: 2 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Tooltip title="Ver versión" placement="top">
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Visibility fontSize="small" />}
                      onClick={() => onView?.(v)}
                      sx={{
                        textTransform: "none",
                        borderRadius: 2,
                        px: 1,
                        color: theme.palette.text.primary,
                        borderColor: theme.palette.divider,
                        backgroundColor: isDark ? "#2c2c2c" : "#fafafa",
                        "&:hover": {
                          backgroundColor: isDark ? "#3a3a3a" : "#f0f0f0",
                        },
                      }}
                    >
                      Ver detalles
                    </Button>
                  </Tooltip>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};
