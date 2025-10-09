// src/modules/landing/pages/activations/activation-processing-page.jsx
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../../../../shared/helpers";
import { CircularProgress, Stack, Typography } from "@mui/material";

export const ActivationProcessingPage = () => {
  const { token } = useParams();

  useEffect(() => {
    if (!token) {
      window.location.replace("/activation/error");
      return;
    }

    // Fail-safe: si nada ocurre en 8s, manda a error
    const failSafe = setTimeout(() => {
      window.location.replace("/activation/error");
    }, 8000);

    axios
      .get(`${baseURL}/t/${token}`)
      .then(({ data }) => {
        clearTimeout(failSafe);
        // Cualquier success (usado o no) → success page
        if (data?.success === true) {
          window.location.replace("/activation/success");
                  console.log(data);
        } else {
          window.location.replace("/activation/error");
        }
      })
      .catch(() => {
        clearTimeout(failSafe);
        window.location.replace("/activation/error");
      });

    return () => clearTimeout(failSafe);
  }, [token]);

  return (
    <Stack alignItems="center" justifyContent="center" height="100vh">
      <CircularProgress />
      <Typography sx={{ mt: 2 }}>Verificando enlace de activación...</Typography>
    </Stack>
  );
};
