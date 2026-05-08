import { AppBar, Box, Button, Container, Typography, Toolbar } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Container>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              <Link to="/" style={{ textDecoration: "none", color: "grey" }}>
                Dashboard PES
              </Link>
            </Typography>

            <Button color="inherit" onClick={() => navigate("/")}>
              Resumen
            </Button>

            <Button color="inherit" onClick={() => navigate("/consultants")}>
              Consultores
            </Button>

            <Button color="inherit" onClick={() => navigate("/work-orders")}>
              Órdenes
            </Button>

            <Button color="inherit" onClick={() => navigate("/tickets")}>
              Tickets
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
}