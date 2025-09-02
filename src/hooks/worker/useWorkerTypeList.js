import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { workerTypeApi } from "../../api";
import { getAuthConfig } from "../../shared/utils";

export const useWorkerTypeList = () => {
  const { token } = useSelector((state) => state.auth);

  const [workerTypes, setWorkerTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return; 

    setLoading(true);
    workerTypeApi
      .get("/all", getAuthConfig(token))
      .then((res) => setWorkerTypes(res.data))
      .catch(() => setWorkerTypes([]))
      .finally(() => setLoading(false));
  }, [token]);

  return { workerTypes, loading };
};
