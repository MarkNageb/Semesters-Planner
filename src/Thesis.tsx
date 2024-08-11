import { NumberInput, Stack, Title } from "@mantine/core";
import React, { Dispatch, FC, SetStateAction } from "react";

interface ThesisProps {
  thesisSemester: number | undefined;
  setThesisSemester: Dispatch<SetStateAction<number | undefined>>;
}

const Thesis: FC<ThesisProps> = ({ thesisSemester, setThesisSemester }) => {

  const saveThesis = (thesis:number) => {
    localStorage.setItem("thesis", JSON.stringify(thesis));
  };

  const changeThesisSemester = (newValue:number)=>{
    saveThesis(newValue)
    setThesisSemester(newValue)
  }

  return (
    <Stack>
      <Title order={3}>Thesis:</Title>
      <NumberInput
        min={1}
        max={7}
        allowDecimal={false}
        value={thesisSemester}
        onChange={(value) =>changeThesisSemester(Number(value))}
        w="100%"
      />
    </Stack>
  );
};

export default Thesis;
