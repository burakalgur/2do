"use client";

import "react-toastify/dist/ReactToastify.css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Tasks from "./Tasks";
import Filter from "./Filter";
import Box from "@mui/material/Box";
import CreateTaskModal from "./CreateTaskModal";

import { useState } from "react";

export default function Content() {
  const [filterQuery, setFilterQuery] = useState("");
  const [taskAdded, setTaskAdded] = useState(false); 

  const handleFilter = (query: string) => {
    setFilterQuery(query);
  };

  const handleTaskAdded = () => {
    setTaskAdded(!taskAdded);
  };


  return (
    <Card sx={{ minWidth: 275, width: "80%", margin: "30px auto" }}>
      <CardContent>
        <Box
          sx={{
            minWidth: 120,
            my: 2,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Filter onFilter={handleFilter} />
          <CreateTaskModal onTaskAdded={handleTaskAdded}  />
        </Box>

        <Tasks filterQuery={filterQuery} taskAdded={taskAdded} />
      </CardContent>
    </Card>
  );
}
