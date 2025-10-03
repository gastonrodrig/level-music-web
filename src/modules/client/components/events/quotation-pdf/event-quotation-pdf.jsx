import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { useQuotationStore, useAuthStore } from '../../../../../hooks';



// Define estilos
const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { marginBottom: 10 }
});

export const handleDownloadPdf = async (quotation) => {
  const {
      quotations,
      total,
      loading,
      searchTerm,
      rowsPerPage,
      currentPage,
      orderBy,
      order,
      setSearchTerm,
      setRowsPerPageGlobal,
      setPageGlobal,
      setOrderBy,
      setOrder,
      startLoadingUserEvents,
      setSelectedQuotation,
    } = useQuotationStore();
  const blob = await pdf(<MyQuotationPdf quotation={quotation} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `cotizacion_${quotation.event_code}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
};
// Componente PDF
const MyQuotationPdf = ({ quotation }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Cotización de Evento</Text>
      </View>
      <View style={styles.section}>
        <Text>Código Evento: {quotation.event_code}</Text>
        <Text>Tipo Evento: {quotation.event_type_name}</Text>
        <Text>Fecha Evento: {quotation.event_date}</Text>
        <Text>Estado: {quotation.status}</Text>
      </View>
    </Page>
  </Document>
);