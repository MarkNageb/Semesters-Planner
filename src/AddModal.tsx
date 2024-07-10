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
import React, { FC } from "react";
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

interface AddModalProps {
  opened: boolean;
  close: () => void;
  addCourse: (arg0: Course) => void;
}

const AddModal: FC<AddModalProps> = ({ opened, close, addCourse }) => {
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

  const onSubmit = (values: Form) => {
    const newCourse: Course = {
      semester: values.semester!,
      code: values.code,
      name: values.name,
      bucket: values.bucket,
      isTheory: values.isTheory,
      credits: values.credits!,
      counted: true,
    };
    addCourse(newCourse);
    close();
    form.reset();
  };

  return (
    <Modal
      title="Add New Course"
      centered
      opened={opened}
      onClose={() => {
        close();
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

export default AddModal;
