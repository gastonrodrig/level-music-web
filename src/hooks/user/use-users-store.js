import { useDispatch, useSelector } from "react-redux";
import { userApi } from "../../api";
import {
  removeClientProfile,
  setClientData,
  setClientProfile,
  setLoadingClientProfile,
  showSnackbar,
  stopLoadingClientProfile,
} from "../../store";
import { 
  createUserGoogleModel,
  createUserEmailPasswordModel,
  updateClientDataModel,
  updateClientProfileModel
} from "../../shared/models";
import { getAuthConfig } from "../../shared/utils";

export const useUsersStore = () => {
  const dispatch = useDispatch();
  const { 
    uid,
    email,
    firstName,
    lastName,
    phone,
    documentType,
    documentNumber,
    photoURL,
    token
  } = useSelector((state) => state.auth);
  const { loadingClientProfile } = useSelector((state) => state.clientProfile);

  const openSnackbar = (message) => dispatch(showSnackbar({ message }));

  const startCreateUser = async (user, model) => {
    try {
      const modelMap = {
        "google": createUserGoogleModel,
        "email/password": createUserEmailPasswordModel,
      };
      let newUser = modelMap[model](user);
      const { data } = await userApi.post("/client-landing", newUser);
      return { ok: true, data };
    } catch (error) {
      console.log(error);
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al registrar el cliente.");
      return false;
    }
  };

  const findUserByEmail = async (email) => {
    try {
      const { data } = await userApi.get(`find/${email}`);
      if (!data) {
        return { ok: false, data: null };
      }
      return { ok: true, data };
    } catch (error) {
      return false;
    }
  }

  const startUpdateExtraData = async (uid, extraData) => {
    dispatch(setLoadingClientProfile());
    try {
      console.log(extraData)
      const payload = updateClientDataModel(extraData);
      const { data } = await userApi.patch(`extra-data/${uid}`, payload, getAuthConfig(token));
      dispatch(
        setClientData({
          firstName: data.first_name,
          lastName: data.last_name,
          phone: data.phone,
          documentType: data.document_type,
          documentNumber: data.document_number
        })
      );
      openSnackbar("Datos actualizados correctamente.");
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al actualizar los datos.");
      return false;
    } finally {
      dispatch(stopLoadingClientProfile());
    }
  };

  const startUpdateClientProfileData = async (uid, profileData) => {
    dispatch(setLoadingClientProfile());
    try {
      const payload = updateClientDataModel(profileData);
      const { data } = await userApi.patch(`client-profile/${uid}`, payload, getAuthConfig(token));
      dispatch(
        setClientData({
          firstName: data.first_name,
          lastName: data.last_name,
          phone: data.phone,
          documentType: data.document_type,
          documentNumber: data.document_number
        })
      )
      openSnackbar("Datos actualizados correctamente.");
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al actualizar los datos.");
      return false;
    } finally {
      dispatch(stopLoadingClientProfile());
    }
  }; 

  const startUpdateClientProfilePicture = async (uid, profileData) => {
    dispatch(setLoadingClientProfile());
    try {
      const payload = updateClientProfileModel(profileData);
      const { data } = await userApi.patch(`upload-photo/${uid}`, payload, getAuthConfig(token, true));
      dispatch(
        setClientProfile({
          photoURL: data.profile_picture
        })
      );
      openSnackbar("Foto de perfil actualizada correctamente.");
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al actualizar la foto de perfil.");
      return false;
    } finally {
      dispatch(stopLoadingClientProfile());
    }
  };

  const startRemoveClientProfilePicture = async (uid) => {
    dispatch(setLoadingClientProfile());
    try {
      await userApi.patch(`remove-photo/${uid}`, {}, getAuthConfig(token));
      dispatch(removeClientProfile());
      openSnackbar("Foto de perfil eliminada correctamente.");
      return true;
    } catch (error) {
      const message = error.response?.data?.message;
      openSnackbar(message ?? "Ocurrió un error al eliminar la foto de perfil.");
      return false;
    } finally {
      dispatch(stopLoadingClientProfile());
    }
  };

  return {
    // state
    uid,
    email,
    firstName,
    lastName,
    phone,
    documentType,
    documentNumber,
    photoURL,
    loadingClientProfile,

    // actions
    startCreateUser,
    findUserByEmail,
    startUpdateExtraData,
    startUpdateClientProfileData,
    startUpdateClientProfilePicture,
    startRemoveClientProfilePicture
  };
};