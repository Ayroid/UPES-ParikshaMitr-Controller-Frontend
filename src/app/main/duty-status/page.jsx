"use client";
import { getSlotsByDate } from "@/services/cont-teacher.service";
import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { useQuery } from "@tanstack/react-query";
import { enIN } from "date-fns/locale";
import { enqueueSnackbar } from "notistack";
import React, { useState } from "react";

const DutyStatus = () => {
  if (global?.window !== undefined) {
    // Now it's safe to access window and localStorage
    var controllerToken = localStorage.getItem("token");
  }

  const [date, setDate] = useState(new Date());

  const SlotGetQuery = useQuery({
    queryKey: ["slot-date", date, controllerToken],
    queryFn: () => getSlotsByDate(date, controllerToken),
  });

  if (SlotGetQuery.isError) {
    enqueueSnackbar({
      message:
        SlotGetQuery.error.response?.status +
        " : " +
        SlotGetQuery.error.response?.data.message,
      variant: "error",
    });
  }

  return (
    <Box>
      <Typography variant="h4">
        Duty Status {SlotGetQuery.isLoading && <CircularProgress />}
      </Typography>
      <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
        <Box>
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={enIN}
          >
            <DatePicker
              label="Slot Date"
              value={date}
              onChange={(newValue) => setDate(newValue)}
              sx={{ m: 1 }}
              format="dd/MM/yyyy"
            />
          </LocalizationProvider>
        </Box>
        <Box>
          {SlotGetQuery.isSuccess && (
            <ButtonGroup size="large" variant="outlined" sx={{ ml: 2 }}>
              {SlotGetQuery.data.data?.map((slot) => (
                <Button key={slot.slotId}>{slot?.timeSlot}</Button>
              ))}
            </ButtonGroup>
          )}
        </Box>
      </Box>
      {SlotGetQuery.isSuccess && console.log(SlotGetQuery.data)}
    </Box>
  );
};

export default DutyStatus;
