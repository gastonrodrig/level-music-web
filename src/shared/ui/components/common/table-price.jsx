import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  CircularProgress,
  Typography,
  useTheme,
  Paper,
} from "@mui/material";

export const PaginatedTable = ({
  columns = [],
  rows = [],
  loading = false,
  total = 0,
  page = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  emptyMessage = "No hay registros disponibles",
  getRowId = (row) => row._id,
  minWidth = 700,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box sx={{ mt: 3 }}>
      <TableContainer
        component={Paper}
        sx={{
          overflowX: "auto",
          borderRadius: 2,
          border: `1px solid ${isDark ? "#444" : "#D0D0D0"}`,
          boxShadow: isDark
            ? "0 2px 6px rgba(0,0,0,0.4)"
            : "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <Table sx={{ minWidth }} size="small">
          {/* ===== ENCABEZADO ===== */}
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: isDark ? "#2B2B2B" : "#F6F6F6",
              }}
            >
              {columns.map((col, idx) => (
                <TableCell
                  key={idx}
                  align={col.align || "left"}
                  sx={{
                    fontWeight: 600,
                    color: isDark ? "#EAEAEA" : "#1E1E1E",
                    fontSize: "0.9rem",
                    textTransform: "none",
                    borderBottom: `1px solid ${isDark ? "#555" : "#E0E0E0"}`,
                    py: 1.5,
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* ===== CUERPO ===== */}
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  sx={{ py: 4 }}
                >
                  <CircularProgress size={26} />
                </TableCell>
              </TableRow>
            ) : rows.length > 0 ? (
              rows.map((row, idx) => (
                <TableRow
                  key={getRowId(row) || idx}
                  sx={{
                    "&:hover": {
                      backgroundColor: isDark ? "#262626" : "#FAFAFA",
                      transition: "background-color 0.2s ease",
                    },
                  }}
                >
                  {columns.map((col, cIdx) => {
                    let value = row[col.field];

                    // Formateadores opcionales
                    if (col.format === "currency" && value != null) {
                      value = `S/ ${Number(value).toFixed(2)}`;
                    } else if (col.format === "date" && value) {
                      value = new Date(value).toLocaleDateString("es-PE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      });
                    }

                    return (
                      <TableCell
                        key={cIdx}
                        align={col.align || "left"}
                        sx={{
                          border: "none",
                          color: isDark ? "#E0E0E0" : "#333333",
                          fontSize: "0.9rem",
                          py: 1.4,
                        }}
                      >
                        {value ?? "-"}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontStyle: "italic",
                    }}
                  >
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          {/* ===== PAGINACIÓN ===== */}
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                count={total}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(_, newPage) => onPageChange(newPage)}
                onRowsPerPageChange={(e) =>
                  onRowsPerPageChange(parseInt(e.target.value, 10))
                }
                sx={{
                  borderTop: `1px solid ${isDark ? "#444" : "#D0D0D0"}`,
                  "& .MuiTablePagination-toolbar": {
                    px: 2,
                    justifyContent: "flex-end",
                  },
                  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                    {
                      fontSize: "0.85rem",
                      color: isDark ? "#CFCFCF" : "#555",
                    },
                }}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  );
};
