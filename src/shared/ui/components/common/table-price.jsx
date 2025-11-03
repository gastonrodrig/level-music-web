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
import { formatDatePrice } from "../../../utils";

export const PaginatedTable = ({
  columns = [],
  rows = [],
  loading = false,
  total = 0,
  page = 0,
  rowsPerPage = 5,
  order = "asc",
  descendingLabel = false,
  onPageChange,
  onRowsPerPageChange,
  emptyMessage = "No hay registros disponibles",
  getRowId = (row) => row._id,
  minWidth = 500,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const safeRowsPerPage = Number.isFinite(rowsPerPage) && rowsPerPage > 0 ? rowsPerPage : 5;
  const safeTotal = Number.isFinite(total) && total >= 0 ? total : 0;
  const totalPages = Math.max(1, Math.ceil(safeTotal / safeRowsPerPage));
  const safePage = Math.min(Number.isFinite(page) ? page : 0, totalPages - 1);

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
                      value = formatDatePrice(value);
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
                /* hide the rows-per-page selector by providing a single option
                   and clearing the label; also hide the select via sx */
                rowsPerPageOptions={[safeRowsPerPage]}
                labelRowsPerPage={""}
                count={safeTotal}
                rowsPerPage={safeRowsPerPage}
                page={safePage}
                labelDisplayedRows={() => {
                  // custom label: display ranges in descending order when forced or when order === 'desc'
                  if (safeTotal <= 0) return `0 of 0`;
                  const useDesc = descendingLabel || order === "desc";
                  if (useDesc) {
                    const start = safeTotal - safePage * safeRowsPerPage;
                    const end = Math.max(safeTotal - (safePage + 1) * safeRowsPerPage + 1, 1);
                    return start === end ? `${start} of ${safeTotal}` : `${start}–${end} of ${safeTotal}`;
                  }
                  // default ascending behavior
                  const from = safePage * safeRowsPerPage + 1;
                  const to = Math.min((safePage + 1) * safeRowsPerPage, safeTotal);
                  return from === to ? `${from} of ${safeTotal}` : `${from}–${to} of ${safeTotal}`;
                }}
                onPageChange={(e, newPage) => {
                  if (newPage >= 0 && newPage < totalPages) {
                    // pass only the numeric page index to the parent/store
                    onPageChange?.(newPage);
                  }
                }}
                onRowsPerPageChange={(e) => {
                  // pass only the numeric rows value (serializable)
                  const value = Number(e.target?.value ?? safeRowsPerPage);
                  onRowsPerPageChange?.(value);
                }}
                sx={{
                  borderTop: `1px solid ${isDark ? "#444" : "#D0D0D0"}`,
                  "& .MuiTablePagination-toolbar": {
                    px: 2,
                    justifyContent: "flex-end",
                  },
                  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                    fontSize: "0.85rem",
                    color: isDark ? "#CFCFCF" : "#555",
                  },
                  /* hide the select input entirely so the user doesn't see the dropdown */
                  "& .MuiTablePagination-select": {
                    display: "none",
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
