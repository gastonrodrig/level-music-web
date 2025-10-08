import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CircularProgress, Stack, Typography } from "@mui/material";
import { baseURL } from "../../../../shared/helpers";
import axios from "axios";

export const ActivationProcessingPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    if (!token) return navigate("/activation/error");

    const controller = new AbortController();

    const checkToken = async () => {
      try {
        const { data } = await axios.get(
          `${baseURL}/t/${token}`,
          { signal: controller.signal }
        );

        console.log("Respuesta del backend:", data);

        if (!data.success) {
          navigate("/activation/error");
          return;
        }

        if (data.used) {
          navigate("/activation/error");
        } else {
          navigate("/activation/success");
        }
      } catch (err) {
        console.error("Error procesando token:", err);
        navigate("/activation/error");
      }
    };

    checkToken();
    return () => controller.abort();
  }, [token, navigate]);

  return (
    <Stack alignItems="center" justifyContent="center" height="100vh">
      <CircularProgress />
      <Typography sx={{ mt: 2 }}>Verificando enlace de activación...</Typography>
    </Stack>
  );
};
