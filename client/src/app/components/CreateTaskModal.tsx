"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import AddIcon from "@mui/icons-material/Add";
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

export default function CreateTaskModal({
  onTaskAdded,
}: {
  onTaskAdded: Function;
}) {
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState("");
  const [thumbnail, setThumbnail] = React.useState(null);
  const [file, setFile] = React.useState(null);
  const [status, setStatus] = React.useState("Not Started");
  const [priority, setPriority] = React.useState("Low");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setText(event.target.value);

  const handleThumbnailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // @ts-ignore
    const file = event.target.files[0];
    // @ts-ignore
    setThumbnail(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    const file = event.target.files[0];
    // @ts-ignore
    setFile(file);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setStatus(event.target.value);
  const handlePriorityChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setPriority(event.target.value);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("text", text);
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }
    if (file) {
      formData.append("file", file);
    }
    formData.append("status", status);
    formData.append("priority", priority);

    try {
      const jwtToken = Cookies.get("jwt");
      const response = await fetch(`http://localhost:4000/api/v1/task`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Success:", data);
      onTaskAdded();
      setOpen(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <Button variant="contained" onClick={handleOpen} startIcon={<AddIcon />}>
        New Task
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
          <label htmlFor="taskImg">Image: </label>
          <input
            id="taskImg"
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleThumbnailChange}
            style={{ marginBottom: "20px" }}
          />
          <br />
          <label htmlFor="taskFile">File: </label>

          <input
            id="taskFile"
            type="file"
            accept=".pdf, .xlsx, .csv, .docx"
            onChange={handleFileChange}
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
            Create Task
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
