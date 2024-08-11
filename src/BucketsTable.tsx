import { Group, Stack, Table, Title } from '@mantine/core'
import React, { FC, useMemo } from 'react'
import Course from './Course';
import { buckets } from './appSettings';
import _ from 'underscore';

interface BucketsTableProps {
    courses: Course[];
}

const BucketsTable:FC<BucketsTableProps> = ({courses}) => {
  const bucketsRows = useMemo(() => {
    const groupedByBucket = _.groupBy(courses, "bucket");
    const bucketsArr = buckets
      .map((bucket) => {
        return [
          bucket.value,
          groupedByBucket[bucket.value]?.reduce(
            (creds, course) =>
              course.counted ? creds + course.credits : creds,
            0
          ),
        ];
      })
      .sort((a, b) => {
        if (!a[1] && !b[1]) return 0;
        if (!a[1]) return 1;
        if (!b[1]) return -1;
        if (a[1] >= b[1]) return -1;
        return 1;
      });

    return bucketsArr
      .filter((bucket) => bucket[1] && Number(bucket[1]) > 0)
      .map((b) => (
        <Table.Tr key={b[0]} style={{ whiteSpace: "nowrap" }}>
          <Table.Td>{b[0]}</Table.Td>
          <Table.Td>{b[1] ?? "-"}</Table.Td>
        </Table.Tr>
      ));
  }, [courses]);
  return (
    <Stack>
    <Group justify="space-between">
    <Title order={3}>Buckets Credits</Title>
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
      <Table.Tr>
        <Table.Th>Bucket</Table.Th>
        <Table.Th>Credits</Table.Th>
      </Table.Tr>
    </Table.Thead>
    <Table.Tbody>{bucketsRows}</Table.Tbody>
  </Table>
  </Stack>
  )
}

export default BucketsTable