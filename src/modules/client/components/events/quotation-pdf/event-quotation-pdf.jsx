import { Document, Page, Text, View, StyleSheet, pdf, Image } from '@react-pdf/renderer';

// Define estilos
const styles = StyleSheet.create({
  page: { padding: 30, position: 'relative' },
  section: { marginBottom: 10, marginTop:10 },
  logo: { width: 80, height: 80, marginBottom: 10 },
  bgImage: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 500,
    height: 500,
    marginLeft: -250, // half width
    marginTop: -200,  // half height
    zIndex: 0,
  },
  title: { fontSize: 12, fontWeight: 'bold', marginBottom: 4,marginTop:8, textTransform: 'uppercase' },
  conditions: { marginTop: 20, fontSize: 12 },
  check: { fontSize: 12, marginBottom: 4,paddingTop:4  },
  fecha: { fontSize: 12, marginBottom: 15, textAlign: "left" },
  texti: { fontSize: 12, marginBottom: 4 },
  textiSub: { fontSize: 12, marginBottom: 4,textDecoration: 'underline' },
  texoParrafo: { fontSize: 12, marginBottom: 4, paddingTop:12 },
  textoConditions: { fontSize: 12, marginBottom: 4, paddingTop:4, marginLeft:15   },
  checkIcon: { width: 10, height: 10, marginRight: 6, marginTop:4, color:'black' },
  firma: { width: 200, height: 100, marginTop: 10  },
});
const styles2 = StyleSheet.create({
  page: { padding: 30, position: 'relative' },
  logo: { width: 80, height: 80, marginBottom: 10 },
  headerText: { fontSize: 14, fontWeight: 'bold', textAlign: 'right' },
  galleryTitle: { fontSize: 12, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
 grid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  marginBottom: 20,
},
gridItem: {
  width: 160, // 3 x 160 = 480 + márgenes
  height: 110,
  margin: 8,
},
  footer: { position: "absolute", bottom: 30, left: 30, right: 30, width: "90%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  footerText: { fontSize: 10, color: "#888" },
  contactRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  contactIcon: { width: 14, height: 14, marginRight: 4 },
  contactText: { fontSize: 10, color: "#888", marginRight: 20 }
});

export const handleDownloadPdf = async (quotation) => {
  console.log('Generating PDF for quotation:', quotation);
  const blob = await pdf(<MyQuotationPdf quotation={quotation} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `cotizacion_${quotation.event_code}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
};
const PdfHeader = () => (
  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
    <Image src={"https://i.postimg.cc/qMY1qFPH/logo-512x512.png"} style={styles.logo} />
    <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'right', color: '#b66f28ff' }}>
      www.levelmusiceventos.com
    </Text>
  </View>
);
const PdfFooter = () => (
  <View style={{
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  }}>
    <Text style={{ fontSize: 10, color: "#888" }}>
      LEVEL MUSIC CORP SAC – Evento & Música Profesional
    </Text>
    <Text style={{ fontSize: 10, color: "#888" }}>
      www.levelmusiceventos.com
    </Text>
  </View>
);
// Componente PDF
const MyQuotationPdf = ({ quotation }) => {
  // Generar fecha actual en español
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const hoy = new Date();
  const dia = hoy.getDate();
  const mes = meses[hoy.getMonth()];
  const año = hoy.getFullYear();
  const fechaFormateada = `Surco, ${dia} de ${mes} del ${año}`;
  const fechaEvento = new Date(quotation.event_date);
  const diaEvento = fechaEvento.getDate();
  const mesEvento = meses[fechaEvento.getMonth()];
  const añoEvento = fechaEvento.getFullYear();
  const fechaEventoFormateada = `${diaEvento} de ${mesEvento} del ${añoEvento}`;
  const servicios = quotation.services_requested || [];

  const formatHour = (iso) => {
    const date = new Date(iso);
    return date.toLocaleTimeString("es-PE", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).replace(".", ""); // quita puntos como "p. m."
  };

  const start = formatHour(quotation.start_time);
  const end = formatHour(quotation.end_time);

const asignationsArr = Array.isArray(quotation.assignations)
  ? quotation.assignations
  : [];

  const tasksArr = Array.isArray(quotation.tasks)
    ? quotation.tasks
    : [];

  // Total de asignaciones
  const totalAsignaciones = asignationsArr.reduce(
    (acc, a) => acc + Number(a.hourly_rate || 0),
    0
  );

  // Total de actividades
  const totalActividades = tasksArr.reduce((acc, task) => {
    const subtasksArr = Array.isArray(task.subtasks) ? task.subtasks : [];
    const subtotalAct = subtasksArr.reduce((s, st) => s + Number(st.price || 0), 0);
    return acc + subtotalAct;
  }, 0);

  // Subtotal sin IGV (lo que ya calculaste)
  const subtotal = totalAsignaciones + totalActividades;

  // IGV adicional
  const igv = subtotal * 0.18;

  // Total con IGV
  const totalConIgv = subtotal + igv;

  return (
  <Document>

      <Page size="A4" style={styles2.page}>
      <PdfHeader />
      <Text style={styles2.galleryTitle}>LEVEL MUSIC CORP SAC – Evento & Música Profesional</Text>
      <View style={styles2.grid}>
        <Image src={"https://i.postimg.cc/sDN3XVfp/imagen-2.jpg"} style={styles2.gridItem} />
        <Image src={"https://i.postimg.cc/0yS1yDBv/imagen-3.jpg"} style={styles2.gridItem} />
        <Image src={"https://i.postimg.cc/yxxw4ZR4/imagen-4.jpg"} style={styles2.gridItem} />
        <Image src={"https://i.postimg.cc/mgf6Vq8p/imagen-5.jpg"} style={styles2.gridItem} />
        <Image src={"https://i.postimg.cc/KvByZtVy/imagen-6.jpg"} style={styles2.gridItem} />
        <Image src={"https://i.postimg.cc/VvnF2sNQ/imagen-1.png"} style={styles2.gridItem}/>
        <Image src={"https://i.postimg.cc/0ybhHDss/foto-1.webp"} style={styles2.gridItem} />
      </View>
      <PdfFooter/>
    </Page>

    <Page size="A4" style={styles.page}>
      {/* Imagen de fondo */}
      <Image src={"https://i.postimg.cc/3xmFRxjm/fondo-disco.png"} style={styles.bgImage} />

      {/* Logo */}
      <PdfHeader />
      <Text style={styles.fecha}>{fechaFormateada}</Text>

      <Text style={styles.texti}>Sres.</Text>
      <Text style={styles.texti}>Atención:                      {quotation.first_name} {quotation.last_name}</Text>
      <Text style={styles.texti}>Cod. Propuesta.           {quotation.event_code}</Text>
      <Text style={styles.texti}>Tipo:                             Evento {quotation.event_type_name} - {quotation.exact_address}  {quotation.fechaEventoFormateada}</Text>
      <Text style={styles.textiSub}>Presente.- </Text>
      <Text style={styles.texoParrafo}>.            La presente es para detallar la propuesta por el servicio de {servicios.map(s => s.name).join(', ')}
profesional para el evento a realizarse el {fechaEventoFormateada} del presente en el {quotation.exact_address}
</Text>
      {/* Servicios Adicionales */}
      <View style={{ marginTop: 10, marginBottom: 10 }}>
        <Text style={styles.title}>Servicios Adicionales Asignados</Text>
        <View>
          <View style={{ flexDirection: "row", marginBottom: 4 }}>
            <Text style={{ width: 165, fontSize: 12, fontWeight: 'bold' }}>Servicio</Text>
            <Text style={{ width: 160, fontSize: 12, fontWeight: 'bold' }}>Proveedor</Text>
            <Text style={{ width: 110, fontSize: 12, fontWeight: 'bold' }}>Precio/día</Text>
            <Text style={{ width: 60, fontSize: 12, fontWeight: 'bold' }}>Subtotal</Text>
          </View>

          {quotation.assignations
            ?.filter(a => a.resource_type === "Servicio Adicional")
            .map((a, idx) => (
              <View key={a._id || idx} style={{ flexDirection: "row", marginBottom: 2 }}>
                <Text style={{ width: 165, fontSize: 12 }}>{a.service_type_name || '-'}</Text>
                <Text style={{ width: 160, fontSize: 12 }}>{a.service_provider_name || '-'}</Text>
                <Text style={{ width: 110, fontSize: 12 }}>S/. {a.hourly_rate ?? '-'}</Text>
                <Text style={{ width: 60, fontSize: 12 }}>S/. {a.hourly_rate ?? '-'}</Text>
              </View>
            ))}

          {quotation.assignations?.filter(a => a.resource_type === "Servicio Adicional").length === 0 && (
            <Text style={{ fontSize: 12, color: "#888" }}>No hay servicios adicionales asignados.</Text>
          )}
        </View>
      </View>

      {/* Equipos */}
      <View style={{ marginTop: 10, marginBottom: 10 }}>
        <Text style={styles.title}>Equipos Asignados</Text>
        <View>
          <View style={{ flexDirection: "row", marginBottom: 4 }}>
            <Text style={{ width: 165, fontSize: 12, fontWeight: 'bold' }}>Equipo</Text>
            <Text style={{ width: 160, fontSize: 12, fontWeight: 'bold' }}>Horas</Text>
            <Text style={{ width: 110, fontSize: 12, fontWeight: 'bold' }}>Precio/h</Text>
            <Text style={{ width: 60, fontSize: 12, fontWeight: 'bold' }}>Subtotal</Text>
          </View>

          {quotation.assignations
            ?.filter(a => a.resource_type === "Equipo")
            .map((a, idx) => {
              const horas = a.hours || 0;
              const subtotal = a.hourly_rate || 0;
              const precioHora = horas > 0 ? (subtotal / horas).toFixed(2) : '-';

              return (
                <View key={a._id || idx} style={{ flexDirection: "row", marginBottom: 2 }}>
                  <Text style={{ width: 165, fontSize: 12 }}>{a.equipment_name || '-'}</Text>
                  <Text style={{ width: 160, fontSize: 12 }}>{horas || '-'}</Text>
                  <Text style={{ width: 110, fontSize: 12 }}>S/. {precioHora}</Text>
                  <Text style={{ width: 60, fontSize: 12 }}>S/. {subtotal}</Text>
                </View>
              );
            })}

          {quotation.assignations?.filter(a => a.resource_type === "Equipo").length === 0 && (
            <Text style={{ fontSize: 12, color: "#888" }}>No hay equipos asignados.</Text>
          )}
        </View>
      </View>

      {/* Trabajadores */}
      <View style={{ marginTop: 10, marginBottom: 10 }}>
        <Text style={styles.title}>Trabajadores Asignados</Text>
        <View>
          <View style={{ flexDirection: "row", marginBottom: 4 }}>
            <Text style={{ width: 108.3, fontSize: 12, fontWeight: 'bold' }}>Rol</Text>
            <Text style={{ width: 108.3, fontSize: 12, fontWeight: 'bold' }}>Cantidad</Text>
            <Text style={{ width: 108.3, fontSize: 12, fontWeight: 'bold' }}>Horas</Text>
            <Text style={{ width: 110, fontSize: 12, fontWeight: 'bold' }}>Precio/h</Text>
            <Text style={{ width: 60, fontSize: 12, fontWeight: 'bold' }}>Subtotal</Text>
          </View>

          {quotation.assignations
            ?.filter(a => a.resource_type === "Trabajador")
            .map((a, idx) => {
              const horas = a.hours || 0;
              const subtotal = a.hourly_rate || 0;
              const precioHora = horas > 0 ? (subtotal / (horas * (a.quantity_required || 1))).toFixed(2) : '-';

              return (
                <View key={a._id || idx} style={{ flexDirection: "row", marginBottom: 2 }}>
                  <Text style={{ width: 108.3, fontSize: 12 }}>{a.worker_type_name || '-'}</Text>
                  <Text style={{ width: 108.3, fontSize: 12 }}>{a.quantity_required || '-'}</Text>
                  <Text style={{ width: 108.3, fontSize: 12 }}>{horas || '-'}</Text>
                  <Text style={{ width: 110, fontSize: 12 }}>S/. {precioHora}</Text>
                  <Text style={{ width: 60, fontSize: 12 }}>S/. {subtotal}</Text>
                </View>
              );
            })}

          {quotation.assignations?.filter(a => a.resource_type === "Trabajador").length === 0 && (
            <Text style={{ fontSize: 12, color: "#888" }}>No hay trabajadores asignados.</Text>
          )}
        </View>
      </View>

      {/* Actividades */}
      <View style={{ marginTop: 10 }}>
        <Text style={styles.title}>Actividades del Evento</Text>

        <View style={{ flexDirection: "row", marginBottom: 4 }}>
          <Text style={{ width: 435, fontSize: 12, fontWeight: 'bold' }}>Actividad</Text>
          <Text style={{ width: 60, fontSize: 12, fontWeight: 'bold' }}>Subtotal</Text>
        </View>

        {quotation.tasks
          ?.map(t => {
            const total = t.subtasks.reduce((sum, st) => sum + (st.price || 0), 0);
            if (total === 0) return null;

            return (
              <View key={t._id} style={{ flexDirection: "row", marginBottom: 2 }}>
                <Text style={{ width: 435, fontSize: 12 }}>{t.name}</Text>
                <Text style={{ width: 60, fontSize: 12 }}>S/. {total}</Text>
              </View>
            );
          })
        }
      </View>

      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 12 }}>
          Subtotal: S/. {subtotal.toFixed(2)}
        </Text>

        <Text style={{ fontSize: 12 }}>
          IGV (18%): S/. {igv.toFixed(2)}
        </Text>

        <Text style={{ fontSize: 14, fontWeight: 'bold', marginTop: 6 }}>
          TOTAL A PAGAR: S/. {totalConIgv.toFixed(2)}
        </Text>
      </View>
      <PdfFooter/>
    </Page>
  <Page size="A4" style={styles.page}>
  <View >
      <PdfHeader />
      <View style={styles.section}>
        <Text style={styles.title}>Condiciones Generales</Text>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}><Image src={"https://i.postimg.cc/ZnWrhbKw/check.png"} style={styles.checkIcon} /><Text style={styles.check}> Los precios son en Soles y NO incluyen el IGV.</Text></View>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
          <Image
            src={"https://i.postimg.cc/ZnWrhbKw/check.png"}
            style={styles.checkIcon}
          />

          <Text style={styles.check}>
             El presente equipamiento está contemplado para {quotation.attendees_count} personas.
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
          <Image
            src={"https://i.postimg.cc/ZnWrhbKw/check.png"}
            style={styles.checkIcon}
          />

          <Text style={styles.check}>
            El servicio cubre la duración del evento de {start} a {end}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}><Image src={"https://i.postimg.cc/ZnWrhbKw/check.png"} style={styles.checkIcon} /><Text style={styles.check}> El concepto del servicio es música continua. Mixes non stop.</Text></View>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}><Image src={"https://i.postimg.cc/ZnWrhbKw/check.png"} style={styles.checkIcon} /><Text style={styles.check}> Incluye transporte de equipamiento y seguro de riesgo SCTR.</Text></View>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}><Image src={"https://i.postimg.cc/ZnWrhbKw/check.png"} style={styles.checkIcon} /><Text style={styles.check}> Incluye visita preliminar para ubicación de equipos y coordinación del play list.</Text></View>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}><Image src={"https://i.postimg.cc/ZnWrhbKw/check.png"} style={styles.checkIcon} /><Text style={styles.check}> No incluye equipo electrógeno.</Text></View>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}><Image src={"https://i.postimg.cc/ZnWrhbKw/check.png"} style={styles.checkIcon} /><Text style={styles.check}> Forma de pago:</Text></View>
        <View><Text style={styles.textoConditions}> 50% de adelanto para separación de la fecha . Saldo antes de iniciar el evento. </Text></View>
        <View><Text style={styles.textoConditions}> BCP SOLES 191-95491406-0-64</Text></View>
        <View><Text style={styles.textoConditions}> CCI 00219119549140606452 </Text></View>
        <View><Text style={styles.textoConditions}> A nombre de Renzo Rodríguez Osco </Text></View>
      </View>
      <Text style={styles.texoParrafo}>Agradeciendo la atención prestada, estaremos gustosos de poder servirlos</Text>
      <Text style={styles.texti}>Atentamente,</Text>
      <Image src={"https://i.postimg.cc/jjqcFrN3/firma.png"} style={styles.firma} />
      <Text style={{ marginTop: 20, fontSize: 12 }}>Renzo Rodríguez</Text>
      <Text style={{ fontSize: 12 }}>Gerente Comercial</Text>
      <Text style={{ fontSize: 12, fontWeight: 'bold' }}>LEVEL MUSIC CORP SAC</Text>
      <Text style={styles.texti}>Whatsapp: 928634395</Text>
      <Text style={styles.texti}>Facebook: https://www.facebook.com/LEVELMUSICpage/</Text>
      <Text style={styles.texti}>Instagram: level_music1</Text>
    </View>
    <Text style={styles.title}>LEVEL MUSIC CORP SAC – Evento & Música Profesional</Text>
    <PdfFooter/>
  </Page>
  </Document>

); };