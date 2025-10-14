import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import { useScreenSizes } from "../../../../shared/constants/screen-width";

export const PaymentTableBase = ({
  title,
  policy,
  columns,
  rows,
  subtotalLabel = "Subtotal:",
  getRowKey,
}) => {
  const { isMd } = useScreenSizes();
  
  const formatoMoneda = (valor) =>
    `S/ ${valor?.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`;

  const subtotal = rows.reduce((acc, r) => acc + (r.partial || 0), 0);
  const subtotalTotal = rows.reduce((acc, r) => acc + (r.total || 0), 0);

  return (
    <>
      <Typography sx={{ mb: 1, fontWeight: 600 }}>
        {title}{" "}
        <Typography
          component="span"
          sx={{ color: "text.secondary", ml: 0.5 }}
        >
          ({policy})
        </Typography>
      </Typography>

      <Box
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#1F1E1E" : "#FCFCFC",
          borderColor: (theme) =>
            theme.palette.mode === "dark" ? "#3b4a7e" : "#c5cae9",
          mb: 3,
        }}
      >
        {!isMd ? (
          // Vista móvil - Cards
          <Box sx={{ p: 2 }}>
            {rows.map((row, i) => (
              <Card 
                key={getRowKey?.(row, i) || i}
                sx={{ 
                  mb: 2, 
                  borderRadius: 2,
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark" ? "#2A2A2A" : "#FFFFFF",
                  border: (theme) =>
                    `1px solid ${theme.palette.mode === "dark" ? "#3A3A3A" : "#E0E0E0"}`,
                  boxShadow: 'none'
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  {columns.map((col) => (
                    <Box key={col.key} sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {col.label}:
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{
                          color: col.key === "partial" ? "success.main" : "inherit",
                          fontWeight: col.key === "partial" ? 600 : "normal",
                        }}
                      >
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            ))}
            
            {/* Subtotal para móvil */}
            <Card 
              sx={{ 
                borderRadius: 2,
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark" ? "#141414" : "#F5F5F5",
                border: (theme) =>
                  `1px solid ${theme.palette.mode === "dark" ? "#3A3A3A" : "#E0E0E0"}`,
                boxShadow: 'none'
              }}
            >
              <CardContent sx={{ p: 2 }}>
                {/* Solo mostrar subtotal total si existe columna total */}
                {columns.find(col => col.key === "total") && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                      Subtotal Total:
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: "primary.main", 
                        fontWeight: 700 
                      }}
                    >
                      {formatoMoneda(subtotalTotal)}
                    </Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {subtotalLabel}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: "success.main", 
                      fontWeight: 700 
                    }}
                  >
                    {formatoMoneda(subtotal)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ) : (
          // Vista escritorio - Tabla
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark" ? "#141414" : "#F5F5F5",
                  "& th": {
                    color: (theme) =>
                      theme.palette.mode === "dark" ? "#E0E0E0" : "#333333",
                  },
                }}
              >
                {columns.map((col, index) => (
                  <TableCell
                    key={col.key}
                    sx={{
                      textAlign:
                        index === columns.length - 1 ? "right" : "left",
                    }}
                  >
                    {col.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row, i) => (
                <TableRow key={getRowKey?.(row, i) || i}>
                  {columns.map((col, index) => (
                    <TableCell
                      key={col.key}
                      sx={{
                        textAlign:
                          index === columns.length - 1 ? "right" : "left",
                        color:
                          col.key === "partial"
                            ? "success.main"
                            : "inherit",
                        fontWeight:
                          col.key === "partial" ? 500 : "normal",
                      }}
                    >
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}

              {/* Subtotal */}
              <TableRow
                sx={{
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark" ? "#141414" : "#F5F5F5",
                }}
              >
                <TableCell sx={{ fontWeight: "bold" }}>
                  {subtotalLabel}
                </TableCell>
                {/* Llenar celdas vacías hasta las últimas columnas */}
                {columns.slice(1, -1).map((col, index) => (
                  <TableCell key={`empty-${index}`} sx={{ textAlign: "left" }}>
                    {/* Solo mostrar subtotal si es una columna de dinero */}
                    {col.key === "total" ? (
                      <Typography sx={{ color: "white", fontWeight: "bold", textAlign: "left" }}>
                        {formatoMoneda(subtotalTotal)}
                      </Typography>
                    ) : null}
                  </TableCell>
                ))}
                {/* Última columna siempre es el subtotal parcial */}
                <TableCell
                  sx={{
                    color: "success.main",
                    fontWeight: "bold",
                    textAlign: "right",
                  }}
                >
                  {formatoMoneda(subtotal)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </Box>
    </>
  );
};
