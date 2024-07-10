import React from "react";
import "./App.css";
import { AppShell } from "@mantine/core";
import { createTheme, MantineProvider } from "@mantine/core";
import CoursesTable from "./CoursesTable";

const theme = createTheme({});

const App = () => {
  return (
    <MantineProvider theme={theme}>
      <AppShell>
        <AppShell.Main p="lg">
          <CoursesTable />
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
};

export default App;
