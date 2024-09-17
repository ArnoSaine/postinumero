import { Button } from "@mui/material";
import Typography from "@mui/material/Typography";

export default function About() {
  return (
    <>
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        Material UI Remix in TypeScript example
      </Typography>
      <Button variant="contained" href="/">
        Go to the main page
      </Button>
    </>
  );
}
