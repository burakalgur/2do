"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Cookies from "js-cookie";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const statuses = ["Not Started", "In Progress", "Completed"];
const priorities = ["Low", "Medium", "High"];

export default function UpdateTaskModal({
    refreshData,
    currentStatus,
    currentPriority,
    currentText,
    id,
  }: {
    refreshData: () => void;
    currentStatus: string;
    currentPriority: string;
    currentText: string;
    id:any;
  }) {
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState(currentText);
  const [status, setStatus] = React.useState(currentStatus);
  const [priority, setPriority] = React.useState(currentPriority);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setText(event.target.value);


  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setStatus(event.target.value);
  const handlePriorityChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setPriority(event.target.value);

  const handleSubmit = async () => {
    try {
        const updateData = {
            "_id": id,
            "text": text,
            "status": status,
            "priority": priority,
        }
      const jwtToken = Cookies.get("jwt");
      console.log(updateData);
      
      const response = await fetch(`http://localhost:4000/api/v1/task`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Success:", data);
      refreshData();
      setOpen(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <Button onClick={handleOpen} >
        Update
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TextField
            label="Task Text"
            value={text}
            onChange={handleTextChange}
            fullWidth
            required
            style={{ marginBottom: "20px" }}
          />
          <TextField
            select
            label="Status"
            value={status}
            onChange={handleStatusChange}
            fullWidth
            style={{ marginBottom: "20px" }}
          >
            {statuses.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Priority"
            value={priority}
            onChange={handlePriorityChange}
            fullWidth
            style={{ marginBottom: "20px" }}
          >
            {priorities.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <Button variant="contained" onClick={handleSubmit}>
            Update Task
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
