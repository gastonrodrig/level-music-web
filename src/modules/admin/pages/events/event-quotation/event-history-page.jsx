import { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { useQuotationStore } from "../../../../../hooks";
import {
  EventHistoryTable,
  EventSummaryBox,
  EventVersionModal,
} from "../../../components";
import { formatDay } from "../../../../../shared/utils";
import { useNavigate } from "react-router-dom";
import { useScreenSizes } from "../../../../../shared/constants/screen-width";

export const EventHistoryPage = () => {
  const { selected, quotations, startLoadingQuotationVersionsByCode } =
    useQuotationStore();
  const navigate = useNavigate();
  const { isMd } = useScreenSizes();

  useEffect(() => {
    if (!selected) {
      navigate("/admin/quotations");
    }
  }, [selected, navigate]);

  useEffect(() => {
    if (selected?.event_code) {
      startLoadingQuotationVersionsByCode(selected?.event_code);
    }
  }, [selected]);

  const getClientName = () => {
    if (selected?.client_type === "Persona") {
      return `${selected?.first_name} ${selected?.last_name}`;
    } else {
      return selected?.company_name || selected?.client_name || "—";
    }
  };

  const top = {
    version: selected?.version,
    lastUpdate: formatDay(selected?.updated_at),
    client: getClientName(),
    eventType: selected?.event_type_name,
    eventDate: formatDay(selected?.event_date),
    selected
  };

  const [openVersion, setOpenVersion] = useState(false);
  const [versionSelected, setVersionSelected] = useState(null);

  const handleView = (v) => {
    setVersionSelected(v);
    setOpenVersion(true);
  };

  return (
    <Box 
      sx={{ px: isMd ? 4 : 0, pt: 2, maxWidth: 1200, margin: "0 auto" }}
    >
      <Typography variant="h4" sx={{ mb: 1 }}>
        Historial de Versiones - Cotización {selected?.event_code}
      </Typography>
      <Typography sx={{ mb: 3, fontSize: 16 }} color="text.secondary">
        Revisa todas las versiones guardadas de esta cotización
      </Typography>

      <EventSummaryBox data={top} />

      <Typography variant="h6" sx={{ mb: 1 }}>
        Todas las Versiones
      </Typography>

      <EventHistoryTable versions={quotations} onView={handleView} />

      <EventVersionModal
        open={openVersion}
        onClose={() => setOpenVersion(false)}
        client={getClientName()}
        version={versionSelected}
      />
    </Box>
  );
};
