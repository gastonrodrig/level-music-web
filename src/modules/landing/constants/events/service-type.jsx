import {
  MusicNote,
  PhotoCamera,
  Restaurant,
  LocalFlorist,
  Group,
  Add,
  Lightbulb,
  Construction,
  MiscellaneousServices,
} from "@mui/icons-material";

export const iconByCategory = {
  Entretenimiento: <MusicNote fontSize="small" />,
  Fotografía: <PhotoCamera fontSize="small" />,
  Gastronomía: <Restaurant fontSize="small" />,
  Estructura: <Construction fontSize="small" />,
  Decoración: <LocalFlorist fontSize="small" />,
  Iluminación: <Lightbulb fontSize="small" />,
  Servicio: <Group fontSize="small" />,
  Tecnología: <MiscellaneousServices fontSize="small" />,
  Custom: <Add fontSize="small" />,
};