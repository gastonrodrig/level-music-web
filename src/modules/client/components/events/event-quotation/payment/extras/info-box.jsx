import { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { ContentCopy, CheckCircle } from "@mui/icons-material";

export const InfoBox = ({ isDark, label, value, onCopy }) => {
  const [copied, setCopied] = useState(false);

  const colors = {
    infoBg: isDark ? "#2d2d2dff" : "#f5f5f5",
    infoBorder: isDark ? "#515151ff" : "#e0e0e0",
    textPrimary: isDark ? "#fff" : "#000",
    textSecondary: isDark ? "#999" : "#666",
    success: "#4caf50",
  };

  const handleCopy = () => {
    onCopy?.();
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <Box
      sx={{
        border: `1px solid ${colors.infoBorder}`,
        borderRadius: 2,
        bgcolor: colors.infoBg,
        p: 1,
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Contenedor de texto */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
          flexGrow: 1,
        }}
      >
        <Typography fontSize={13} color={colors.textSecondary}>
          {label}:
        </Typography>

        <Typography
          fontSize={14}
          fontWeight={500}
          color={colors.textPrimary}
          sx={{
            wordBreak: "break-all",
            overflow: "hidden",
            textOverflow: "ellipsis",
            textAlign: "right",
          }}
        >
          {value ?? "-"}
        </Typography>
      </Box>

      {/* Ícono de copiar / check */}
      {onCopy && (
        <IconButton
          size="small"
          onClick={handleCopy}
          sx={{ ml: 1, flexShrink: 0, p: 0 }}
        >
          {copied ? (
            <CheckCircle sx={{ fontSize: 17, color: colors.success }} />
          ) : (
            <ContentCopy sx={{ fontSize: 16, color: colors.textSecondary }} />
          )}
        </IconButton>
      )}
    </Box>
  );
};
