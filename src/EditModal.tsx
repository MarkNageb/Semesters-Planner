import {
  Button,
  Checkbox,
  Modal,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import React, { FC, useEffect } from "react";
import Course from "./Course";
import { buckets } from "./appSettings";

interface Form {
  semester?: number;
  code: string;
  name: string;
  bucket: string;
  isTheory: boolean;
  credits?: number;
}

interface EditModalProps {
  opened: boolean;
  close: () => void;
  editCourse: (arg0: Course) => void;
  course?: Course;
  setCourse:Function;
}

const EditModal: FC<EditModalProps> = ({ opened, close, editCourse,course,setCourse }) => {
  const form = useForm<Form>({
    initialValues: {
      semester: undefined,
      code: "",
      name: "",
      bucket: "",
      isTheory: false,
      credits: undefined,
    },
    validate: {
      semester: isNotEmpty("Required"),
      code: isNotEmpty("Required"),
      name: isNotEmpty("Required"),
      bucket: isNotEmpty("Required"),
      credits: isNotEmpty("Required"),
    },
  });
  useEffect(()=>{
    if(course){
      form.setValues({
        semester: course.semester,
        code: course.code,
        name: course.name,
        bucket: course.bucket,
        isTheory: course.isTheory,
        credits: course.credits,
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[course])

  const onSubmit = (values: Form) => {
    const editedCourse: Course = {
      semester: values.semester!,
      code: values.code,
      name: values.name,
      bucket: values.bucket,
      isTheory: values.isTheory,
      credits: values.credits!,
      counted: true,
    };
    editCourse(editedCourse);
    setCourse(undefined);
    close();
    form.reset();
  };

  return (
    <Modal
      title="Edit Course"
      centered
      opened={opened}
      onClose={() => {
        close();
        setCourse(undefined);
        form.reset();
      }}
    >
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap="sm">
          <NumberInput
            label="Semester"
            placeholder="Semester"
            {...form.getInputProps("semester")}
            min={1}
            max={7}
            allowDecimal={false}
          />
          <TextInput
            withAsterisk
            disabled
            label="Code"
            placeholder="Course Code"
            {...form.getInputProps("code")}
          />
          <TextInput
            withAsterisk
            label="Name"
            placeholder="Course Name"
            {...form.getInputProps("name")}
          />
          <NumberInput
            label="Credits"
            placeholder="Credits"
            {...form.getInputProps("credits")}
            min={1}
            allowDecimal={false}
          />
          <Select
            withAsterisk
            label="Bucket"
            placeholder="Bucket"
            {...form.getInputProps("bucket")}
            data={buckets}
          />
          <Checkbox
            label="Theory"
            {...form.getInputProps("isTheory", { type: "checkbox" })}
          />
          <Button type="submit">Submit</Button>
        </Stack>
      </form>
    </Modal>
  );
};

export default EditModal;
