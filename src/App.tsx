import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Flex,
  Heading,
  Input,
  Stack,
  Tfoot,
  useColorMode,
} from "@chakra-ui/react";
import { useState } from "react";
import ColorModeSwitcher from "./components/ColorModeSwitcher";
import Papa from "papaparse";
import moment from "moment";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import EmployeeCard from "./components/EmployeeCard";

const LOG_FORMAT = "DD/MM/YYYY HH:mm";

const calculateDailyOvertime = (log: Log) => {
  const momentDate = moment(log.date, LOG_FORMAT);

  const day = momentDate.format("dddd");

  const closingTime = momentDate
    .clone()
    .set({ hour: day !== "Saturday" ? 17 : 15, minute: 0, second: 0 });

  const overtime = momentDate.diff(closingTime, "minutes");

  return overtime > 0 ? overtime : 0;
};

function App() {
  const { colorMode } = useColorMode();
  const [csv, setCsv] = useState<unknown[][] | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Papa.parse(e.target.files[0], {
        complete: function (results) {
          setCsv(results.data as unknown[][]);
        },
      });
    }
  };

  const parsedLog: Log[] =
    csv
      ?.slice(1)
      .map((row) => {
        const [name, date, logType] = row as LogRow;
        return {
          name,
          date,
          logType,
        };
      })
      .filter((log) => log.logType) || [];

  const logGroupedByName = parsedLog.reduce((acc, log) => {
    if (acc[log.name]) {
      acc[log.name].push(log);
    } else {
      acc[log.name] = [log];
    }
    return acc;
  }, {} as Record<string, Log[]>);

  const employeeLogSummary = Object.entries(logGroupedByName).reduce(
    (attAcc, [name, logs]) => {
      attAcc[name] = logs.reduce((logAcc, log) => {
        const momentDate = moment(log.date, LOG_FORMAT);

        const date = momentDate.format("DD/MM/YYYY");
        const time = momentDate.format("HH:mm");

        if (logAcc[date]) {
          if (log.logType === "C/In") {
            logAcc[date].in = time;
          } else {
            logAcc[date].out = time;
            logAcc[date].overtimeMinute = calculateDailyOvertime(log);
          }
        } else {
          logAcc[date] = {
            dayName: momentDate.format("dddd"),
            in: log.logType === "C/In" ? time : "-",
            out: log.logType === "C/Out" ? time : "-",
            overtimeMinute:
              log.logType === "C/Out" ? calculateDailyOvertime(log) : 0,
          };
        }

        return logAcc;
      }, {} as Record<string, Attendance>);
      return attAcc;
    },
    {} as Record<string, Record<string, Attendance>>
  );

  return (
    <Container color={colorMode} maxWidth="container.lg">
      <Flex justify="space-between" paddingBlock="20px">
        <Heading fontSize={"3xl"}>Attendance Summary</Heading>
        <ColorModeSwitcher />
      </Flex>
      <Stack gap="20px">
        <Input variant="unstyled" type="file" onChange={handleFileUpload} />
        {Object.entries(employeeLogSummary).map(([name, logs]) => (
          <EmployeeCard name={name} logs={logs} />
        ))}
      </Stack>
    </Container>
  );
}

export default App;
