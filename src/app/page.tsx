import Image from "next/image";
import styles from "./page.module.css";
import { Button } from "@mui/material";

export default function Home() {
  return (
    <main>
      <h1>Gestión de Personas</h1>
      <Button variant="contained" color="primary">
        Botón de prueba
      </Button>
    </main>
  );
}
