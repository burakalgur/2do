"use client";

import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Button, TextField } from "@mui/material";

export default function Filter({ onFilter }: { onFilter: Function }) {
  const [status, setStatus] = React.useState("");
  const [priority, setPriority] = React.useState("");
  const [text, setText] = React.useState("");

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value as string);
  };

  const handlePriorityChange = (event: SelectChangeEvent) => {
    setPriority(event.target.value as string);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleFilterClick = () => {
    let queryParams = "";

    if (status) {
      queryParams += `&status=${status}`;
    }
    if (priority) {
      queryParams += `&priority=${priority}`;
    }
    if (text) {
      queryParams += `&text=${text}`;
    }

    if (queryParams) {
      queryParams = "?" + queryParams.substring(1);
    }

    onFilter(queryParams);
  };

  const handleClear = () => {
    setStatus("");
    setPriority("");
    setText("");
    onFilter("");
  };

  return (
    <div style={{ flex: 1 }}>
      <FormControl sx={{ width: "13%", mr: 1 }} size="small">
        <InputLabel id="Status-label">Status</InputLabel>
        <Select
          labelId="Status-label"
          id="Status"
          value={status}
          label="Status"
          onChange={handleStatusChange}
        >
          <MenuItem value={"Not Started"}>Not Started</MenuItem>
          <MenuItem value={"In Progress"}>In Progress</MenuItem>
          <MenuItem value={"Completed"}>Completed</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ width: "13%", mr: 1 }} size="small">
        <InputLabel id="priority-label">Priority</InputLabel>
        <Select
          labelId="priority-label"
          id="priority"
          value={priority}
          label="Priority"
          onChange={handlePriorityChange}
        >
          <MenuItem value={"Low"}>Low</MenuItem>
          <MenuItem value={"Medium"}>Medium</MenuItem>
          <MenuItem value={"High"}>High</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ width: "25%", mr: 1 }}>
        <TextField
          id="taskText"
          label="Task"
          variant="outlined"
          size="small"
          value={text}
          onChange={handleTextChange}
        />
      </FormControl>
      <Button variant="outlined" onClick={handleFilterClick}>
        Filter
      </Button>
      <Button variant="text" onClick={handleClear}>
        Clear
      </Button>
    </div>
  );
}
