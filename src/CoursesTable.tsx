import React, {
  Dispatch,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import _ from "underscore";
import { FaEdit, FaTrash } from "react-icons/fa";
import Course from "./Course";
import AddModal from "./AddModal";
import {
  ActionIcon,
  Button,
  Checkbox,
  Group,
  Stack,
  Table,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import EditModal from "./EditModal";

interface CoursesTableProps {
  courses: Course[];
  setCourses: Dispatch<React.SetStateAction<Course[]>>;
  thesisSemester: number | undefined;
}

const CoursesTable: FC<CoursesTableProps> = ({
  courses,
  setCourses,
  thesisSemester,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<Course>();
  const [addModalOpened, { open: openAddModal, close: closeAddModal }] =
    useDisclosure(false);
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);

  useEffect(() => {
    const savedCoursesString = localStorage.getItem("courses");
    if (savedCoursesString) setCourses(JSON.parse(savedCoursesString));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveCourses = (courses: Course[]) => {
    localStorage.setItem("courses", JSON.stringify(courses));
  };

  const addCourse = (newCourse: Course) => {
    setCourses((oldCourses) => {
      const newCourses = [...oldCourses, newCourse];
      saveCourses(newCourses);
      return newCourses;
    });
  };

  const editCourse = (editedCourse: Course) => {
    setCourses((oldCourses) => {
      const newCourses = oldCourses.map((course) => {
        if (course.code === editedCourse.code) {
          return {
            ...course,
            ...editedCourse,
          };
        } else {
          return course;
        }
      });

      saveCourses(newCourses);
      return newCourses;
    });
  };

  const toggleCourseCounted = useCallback(
    (code: string, value: boolean) => {
      setCourses((oldCourses) => {
        const newCourses = oldCourses.map((course) => {
          if (course.code === code) {
            return {
              ...course,
              counted: value,
            };
          } else return course;
        });
        saveCourses(newCourses);
        return newCourses;
      });
    },
    [setCourses]
  );

  const deleteCourse = useCallback((code: string) => {
    setCourses((oldCourses) => {
      const newCourses = oldCourses.filter((course) => course.code !== code);
      saveCourses(newCourses);
      return newCourses;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderCourse = useCallback(
    (course: Course) => {
      return (
        <>
          <Table.Td>{course.code}</Table.Td>
          <Table.Td>{course.name}</Table.Td>
          <Table.Td>{course.credits}</Table.Td>
          <Table.Td>{course.bucket}</Table.Td>
          <Table.Td>{course.isTheory ? "YES" : "NO"}</Table.Td>
          <Table.Td>
            <Group style={{ flexWrap: "nowrap" }}>
              <ActionIcon
                onClick={() => {
                  setSelectedCourse(course);
                  openEditModal();
                }}
              >
                <FaEdit />
              </ActionIcon>
              <ActionIcon
                color="red"
                onClick={() => {
                  deleteCourse(course.code);
                }}
              >
                <FaTrash />
              </ActionIcon>
            </Group>
          </Table.Td>
          <Table.Td>
            <Checkbox
              checked={course.counted}
              onChange={(event) =>
                toggleCourseCounted(course.code, event.target.checked)
              }
            />
          </Table.Td>
        </>
      );
    },
    [deleteCourse, toggleCourseCounted, openEditModal]
  );

  const rows = useMemo(() => {
    const groupedBySemester = _.groupBy(courses, "semester");

    const ordered = Object.keys(groupedBySemester)
      .sort()
      .reduce(
        (
          obj: {
            [key: string]: Course[];
          },
          key: string
        ) => {
          obj[key] = groupedBySemester[key];
          return obj;
        },
        {}
      );

    const semesters = Object.entries(ordered).map(([semester, courses]) => {
      return [
        <Table.Tr key={semester}>
          <Table.Td rowSpan={courses.length}>{semester}</Table.Td>
          {renderCourse(courses[0])}
          <Table.Td rowSpan={courses.length}>
            {courses.reduce(
              (creds, course) =>
                course.counted ? creds + course.credits : creds,
              0
            )}
          </Table.Td>
        </Table.Tr>,
        ...courses.slice(1).map((course) => {
          return <Table.Tr key={course.code}>{renderCourse(course)}</Table.Tr>;
        }),
      ];
    });

    return [
      ...semesters,
      <Table.Tr key="TOTAL">
        <Table.Td>Total</Table.Td>
        <Table.Td colSpan={7}></Table.Td>
        <Table.Td rowSpan={courses.length} align="right">
          {courses.reduce(
            (creds, course) =>
              course.counted ? creds + course.credits : creds,
            0
          )}
        </Table.Td>
      </Table.Tr>,
    ];
  }, [courses, renderCourse]);

  return (
    <Stack gap="lg">
      <AddModal
        opened={addModalOpened}
        close={closeAddModal}
        addCourse={addCourse}
      />
      <EditModal
        opened={editModalOpened}
        close={closeEditModal}
        editCourse={editCourse}
        setCourse={setSelectedCourse}
        course={selectedCourse}
      />
      <Group justify="space-between">
        <Title order={3}>Courses List</Title>
        <Button onClick={openAddModal}>Add</Button>
      </Group>
      <Table
        striped
        highlightOnHover
        withRowBorders
        withColumnBorders
        withTableBorder
        style={{
          tableLayout: "auto",
          width: 1,
          whiteSpace: "nowrap",
          textAlign: "center",
        }}
      >
        <Table.Thead>
          <Table.Tr style={{ textAlign: "center" }}>
            <Table.Th>Semester</Table.Th>
            <Table.Th>Code</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Credits</Table.Th>
            <Table.Th>Bucket</Table.Th>
            <Table.Th>Theory</Table.Th>
            <Table.Th>Actions</Table.Th>
            <Table.Th>Count?</Table.Th>
            <Table.Th>Sem. Credits</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Stack>
  );
};

export default CoursesTable;
