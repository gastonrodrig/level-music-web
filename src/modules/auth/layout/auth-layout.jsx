import { Grid, Typography, Box } from "@mui/material";
import { imagen_1 } from '../../../assets/images/carrousel';
import { useTheme } from "@mui/material/styles";
import { Logo } from "../../../shared/ui/components/common/logo";

export const AuthLayout = ({ children, title = '', subtitle = '', isLogin = false }) => {
  const theme = useTheme();

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        minHeight: "calc(100vh - 64px)",
        backgroundImage: { md: `url(${imagen_1})`, xs: 'none' },
        padding: 2,
        backgroundSize: "cover",
        backgroundPosition: "center",
        mt: { xs: '80px', md: 0 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: { xs: "100%", sm: "80%", md: "70%", lg: "50%", xl: "40%" },
          padding: { xs: 2, md: 5 },
          textAlign: "center",
          backgroundColor: { xs: "transparent", md: theme.palette.background.default },
          borderRadius: { md: 8 },
          boxShadow: { md: 3 },
          maxWidth: { xs: "100%", sm: "90%", md: "70%", lg: "60%", xl: "45%" },
          margin: "0 auto",
          mt: { xs: 4, sm: 6, md: 8, lg: 8 } 
        }}
      >
        {isLogin && <Logo />}
        <Typography sx={{ fontSize: isLogin ? 16 : 22, fontWeight: 600, pt: isLogin ? 2 : 0 }}>
          {title}
        </Typography>
        <Typography sx={{ fontSize: 16, fontWeight: 200, py: 2 }}>
          {subtitle}
        </Typography>
        {children}
      </Box>
    </Grid>
  );
};
