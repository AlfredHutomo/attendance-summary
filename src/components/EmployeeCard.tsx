import { memo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  Tfoot,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";

interface EmployeeCardProps {
  name: string;
  logs: Record<string, Attendance>;
}

const EmployeeCard = ({ name, logs }: EmployeeCardProps) => {
  const totalOvertime = Object.values(logs)
    .reduce((acc, log) => acc + log.overtimeMinute / 60, 0)
    .toFixed(1);

  return (
    <Card key={name} variant="outline">
      <CardHeader>
        <Heading>{name.replace(".", " ")}</Heading>
      </CardHeader>
      <CardBody>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Day Name</Th>
                <Th>Date</Th>
                <Th>In</Th>
                <Th>Out</Th>
                <Th isNumeric>Overtime</Th>
              </Tr>
            </Thead>
            <Tbody>
              {Object.entries(logs).map(([date, attendance]) => (
                <Tr key={date}>
                  <Td>{attendance.dayName}</Td>
                  <Td>{date}</Td>
                  <Td color={attendance.isLate ? "red" : ""}>
                    {attendance.in || "-"}
                  </Td>
                  <Td>{attendance.out || "-"}</Td>
                  <Td isNumeric>
                    {(attendance.overtimeMinute / 60).toFixed(1)}
                  </Td>
                </Tr>
              ))}
            </Tbody>
            <Tfoot>
              <Tr>
                <Th>Total Overtime</Th>
                <Th></Th>
                <Th></Th>
                <Th></Th>
                <Th isNumeric>{totalOvertime}</Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  );
};

export default memo(EmployeeCard);
