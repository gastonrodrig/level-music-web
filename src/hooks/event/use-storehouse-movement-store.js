import { useDispatch, useSelector } from "react-redux";
import { showSnackbar } from "../../store";
import { storehouseMovementApi } from "../../api";
import { getAuthConfig, getAuthConfigWithParams } from "../../shared/utils";
import { useCallback } from "react";

export const useStorehouseMovementService = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const openSnackbar = useCallback(
    (message) => dispatch(showSnackbar({ message })),
    [dispatch]
  );

  // ==========================================================
  // PAGINADO + FILTROS
  // ==========================================================
  const fetchPaginated = useCallback(
    async (params = {}) => {
      try {
        const res = await storehouseMovementApi.get(
          "/paginated",
          getAuthConfigWithParams(token, params)
        );
        return res.data;
      } catch (err) {
        const msg = err?.response?.data?.message || "Error cargando movimientos";
        openSnackbar(msg);
        return { total: 0, items: [] };
      }
    },
    [token, openSnackbar]
  );

  // ==========================================================
  // LOOKUP POR STOREHOUSE CODE
  // ==========================================================
  const lookupByStorehouseCode = useCallback(
    async (code) => {
      try {
        const res = await storehouseMovementApi.get(
          "/by-storehouse-code",
          getAuthConfigWithParams(token, { code })
        );
        return res.data;
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          "Error buscando movimientos por código de subtarea";
        openSnackbar(msg);
        return { assignations: [] };
      }
    },
    [token, openSnackbar]
  );

  // ==========================================================
  // CREAR DESDE SUBTAREA
  // ==========================================================
  const createFromStorehouse = useCallback(
    async ({ code, movement_type, destination }) => {
      try {
        const res = await storehouseMovementApi.post(
          "/from-storehouse",
          { code, movement_type, destination },
          getAuthConfig(token)
        );
        openSnackbar(`${res.data.created || 0} movimientos creados desde subtarea.`);
        return res.data;
      } catch (err) {
        const msg =
          err?.response?.data?.message || "Error creando movimientos desde subtarea";
        openSnackbar(msg);
        return false;
      }
    },
    [token, openSnackbar]
  );

  // ==========================================================
  // CREAR POR ASIGNACIONES (lookup)
  // ==========================================================
  const createFromLookup = useCallback(
    async (assignations = [], movement_type, destination) => {
      if (!assignations.length) return [];

      const createdMovements = [];

      for (const a of assignations) {
        try {
          const res = await storehouseMovementApi.post(
            "/",
            {
              equipment_id: a.equipment_id,
              event_id: a.event_id,
              movement_type,
              destination,
              code: `MVT-${Date.now().toString(36)}-${Math.random()
                .toString(36)
                .slice(2, 6)}`,
              state: "Activo",
            },
            getAuthConfig(token)
          );
          createdMovements.push(res.data);
        } catch (err) {
          const msg =
            err?.response?.data?.message || "Error creando movimiento por asignación";
          openSnackbar(msg);
        }
      }

      openSnackbar(`${createdMovements.length} movimientos creados.`);
      return createdMovements;
    },
    [token, openSnackbar]
  );

  // ==========================================================
  // CREAR MOVIMIENTO MANUAL
  // ==========================================================
  const createManual = useCallback(
    async ({ serial_number, movement_type, event_code, destination, equipment_id }) => {
      try {
        const res = await storehouseMovementApi.post(
          "/manual",
          { serial_number, movement_type, event_code, destination, equipment_id },
          getAuthConfig(token)
        );
        openSnackbar("Movimiento manual creado.");
        return res.data;
      } catch (err) {
        const msg = err?.response?.data?.message || "Error creando movimiento manual";
        openSnackbar(msg);
        return false;
      }
    },
    [token, openSnackbar]
  );

  return {
    fetchPaginated,
    lookupByStorehouseCode,
    createFromStorehouse,
    createFromLookup,
    createManual,
  };
};
