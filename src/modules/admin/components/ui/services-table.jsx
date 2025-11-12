import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button,
  IconButton,
  useTheme,
} from "@mui/material";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useScreenSizes } from "../../../../shared/constants/screen-width";

export const ServicesTable = ({
  title = "Servicios",
  subtitle = "",
  providerName,
  providerEmail,
  badgeLabel,
  columns = [],
  rows = [],
  getRowKey = (r, i) => r._id || i,
  onRowClick,
  onRowAction,
  emptyMessage = "No hay registros",
}) => {
  const { isMd } = useScreenSizes();
  const theme = useTheme();

  const effectiveColumns = React.useMemo(() => {
    const cols = Array.isArray(columns) ? [...columns] : [];
    if (onRowAction && !cols.some((c) => c.key === "actions")) {
      cols.push({
        key: "actions",
        label: "Acciones",
        render: (_, row) => (
          <Button
            size="small"
            variant="outlined"
            onClick={(e) => {
              e.stopPropagation();
              onRowAction && onRowAction(row);
            }}
            startIcon={<VisibilityOutlinedIcon />}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 1,
              color: theme.palette.text.primary,
              borderColor: theme.palette.divider,
              backgroundColor: theme.palette.mode === "dark" ? "#2c2c2c" : "#fafafa",
              "&:hover": {
              backgroundColor: theme.palette.mode === "dark" ? "#3a3a3a" : "#f0f0f0",
              }
            }}
          >
            Ver Detalle
          </Button>
        ),
      });
    }
    return cols;
  }, [columns, onRowAction]);

  return (
    <Box>
      {/* title header */}
      <Box sx={{ mb: 1 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 18 }}>{title}</Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>

      {/* container */}
      <Box
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#1F1E1E" : "#FCFCFC",
          border: (theme) =>
            `1px solid ${theme.palette.mode === "dark" ? "#2f2f2f" : "#E8EAF6"}`,
          mb: 3,
        }}
      >
        {/* provider dark header bar */}
        {(providerName || providerEmail || badgeLabel) && (
          <Box
            sx={{
              px: 3,
              py: 2,
              backgroundColor: (theme) =>
                theme.palette.mode === "dark" ? "#1A1A1F" : "#e5e5e0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              {providerName && (
                <Typography sx={{ fontWeight: 700 }}>
                  {providerName}
                </Typography>
              )}
              {providerEmail && (
                <Typography variant="body2" sx={{ color: theme.palette.mode === "dark" ? "#cbd5e1" : "#342a1e", mt: 0.5 }}>
                  {providerEmail}
                </Typography>
              )}
            </Box>

            {badgeLabel && (
              <Chip
                label={badgeLabel}
                size="small"
                sx={{ bgcolor: "#1f6feb", color: "#fff", borderRadius: 8 }}
              />
            )}
          </Box>
        )}
        {!isMd ? (
          // mobile: cards / list
          <Box sx={{ p: 2 }}>
            {rows.length === 0 && (
              <Typography color="text.secondary">{emptyMessage}</Typography>
            )}
            {rows.map((row, i) => (
              <Card
                key={getRowKey(row, i)}
                variant="outlined"
                sx={{ mb: 2, boxShadow: "none", borderRadius: 2 }}
                onClick={() => onRowClick && onRowClick(row)}
              >
                <CardContent sx={{ p: 2 }}>
                  {columns.map((col) => (
                    <Box
                      key={col.key}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                        {col.label}
                      </Typography>
                      {/* emphasize service name */}
                      {col.key === "service_type_name" ? (
                        <Typography variant="body1" sx={{ fontWeight: 700 }}>
                          {col.render ? col.render(row[col.key], row) : row[col.key]}
                        </Typography>
                      ) : (
                        <Typography variant="body2">
                          {col.render ? col.render(row[col.key], row) : row[col.key]}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          // desktop: table
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark" ? "#141414" : "#F5F5F5",
                  "& th": { color: (theme) => (theme.palette.mode === "dark" ? "#E0E0E0" : "#333") },
                }}
              >
                {effectiveColumns.map((col, idx) => (
                  <TableCell key={col.key} sx={{ textAlign: idx === effectiveColumns.length - 1 ? "right" : "left" }}>
                    <Typography sx={{ fontWeight: 600 }}>{col.label}</Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={effectiveColumns.length}>
                    <Typography color="text.secondary">{emptyMessage}</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row, i) => (
                  <TableRow
                    key={getRowKey(row, i)}
                    hover={!!onRowClick}
                    onClick={() => onRowClick && onRowClick(row)}
                    sx={{
                      '&:last-child td': { borderBottom: 0 },
                    }}
                  >
                    {effectiveColumns.map((col, idx) => (
                      <TableCell
                        key={col.key}
                        sx={{ textAlign: idx === effectiveColumns.length - 1 ? "right" : "left" }}
                      >
                        {/* emphasize service name cell */}
                        {col.key === "service_type_name" ? (
                          <Typography sx={{ fontWeight: 700 }}>{col.render ? col.render(row[col.key], row) : row[col.key]}</Typography>
                        ) : (
                          col.render ? col.render(row[col.key], row) : row[col.key]
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Box>
    </Box>
  );
};
