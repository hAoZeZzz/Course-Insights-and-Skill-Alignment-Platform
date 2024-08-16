import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import UpArrow from "../assets/up-arrow.svg";
//  This is the button which is located in the footer and it can move to the top of page.
const theme = createTheme({
  palette: {
    violet: {
      main: "linear-gradient(120deg,#f6d365 ,#fda085 100%)",
    },
  },
});


const FooterTopButton = () => {
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <ThemeProvider theme={theme}>
        <Button
          variant="contained"
          color="violet"
          sx={{
            fontSize: "1.2rem",
            minWidth: "50px",
            height: "50px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          onClick={handleScrollToTop}  
        >
          <img src={UpArrow} style={{height:"24px"}} alt="" />
          Top
        </Button>
    </ThemeProvider>
  );
};

export default FooterTopButton;
