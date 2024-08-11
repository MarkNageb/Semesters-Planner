import React, { useEffect, useState } from "react";
import "./App.css";
import { AppShell, Stack } from "@mantine/core";
import { createTheme, MantineProvider } from "@mantine/core";
import CoursesTable from "./CoursesTable";
import Thesis from "./Thesis";
import BucketsTable from "./BucketsTable";
import Course from "./Course";

const theme = createTheme({});

const App = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [thesisSemester, setThesisSemester] = useState<number>();
  useEffect(() => {
    const savedThesisString = localStorage.getItem("thesis");
    if (savedThesisString) setThesisSemester(JSON.parse(savedThesisString));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MantineProvider theme={theme}>
      <AppShell>
        <AppShell.Main p="lg">
          <Stack gap="md">
            <CoursesTable
              thesisSemester={thesisSemester}
              courses={courses}
              setCourses={setCourses}
            />
            <BucketsTable courses={courses} />
            <Thesis
              thesisSemester={thesisSemester}
              setThesisSemester={setThesisSemester}
            />
          </Stack>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
};

export default App;
