"use client";

import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import UpdateTaskModal from "./UpdateTaskModal";

type Task = {
  _id: number;
  text: string;
  thumbnail: string;
  status: string;
  file: string;
  priority: string;
  userId: string;
  __v: number;
  fileData?: Buffer;
  thumbnailData?: any;
};

export default function Tasks({
  filterQuery,
  taskAdded,
}: {
  filterQuery: string;
  taskAdded: boolean;
}) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    getData();
  }, [filterQuery, taskAdded]);

  const getData = async () => {
    try {
      const jwtToken = Cookies.get("jwt");
      const response = await fetch(
        `http://localhost:4000/api/v1/task${filterQuery}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTasks(data);
        console.log(data);
      } else {
        console.error("Login failed");
        const err = await response.json();
        toast.error(err.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const downloadFile = (fileData: Buffer | undefined, fileName: string) => {
    const getFileType = (fileExtension: string): string => {
      switch (fileExtension) {
        case "txt":
          return "text/plain";
        case "pdf":
          return "application/pdf";
        case "jpg":
        case "jpeg":
          return "image/jpeg";
        case "docx":
          return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        case "csv":
          return "text/csv";
        case "xlsx":
          return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        default:
          return "application/octet-stream";
      }
    };

    if (fileData) {
      try {
        // @ts-ignore
        const uint8Array = new Uint8Array(fileData.data);
        const blob = new Blob([uint8Array], { type: getFileType(fileName.split(".").pop()?.toLowerCase() || "jpg") });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(url);
        
      } catch (error) {
        console.error('Error downloading file:', error);
      }
    } else {
      console.error('File data is undefined.');
    }
  };

  const handleDelete = async (taskId: number) => {
    try {
      const jwtToken = Cookies.get("jwt");
      const response = await fetch(`http://localhost:4000/api/v1/task/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
  
      if (response.ok) {
        // İstek başarıyla tamamlandıysa, veriyi güncelleyin
        toast.success("Task deleted successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        // Veriyi yenilemek için getData fonksiyonunu yeniden çağırın
        getData();
      } else {
        // İstek başarısız olduysa, kullanıcıya uygun hata mesajını gösterin
        const errorData = await response.json();
        toast.error(errorData.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("An error occurred while deleting the task", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };
  


  return (
    <div>
      {tasks.map((task, index) => (
        <Accordion key={task._id}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index}-content`}
            id={`panel${index}-header`}
            sx={{ display: "flex", alignContent: "center" }}
          >
            {task.thumbnailData ? (
              <img
                src={`data:image/jpeg;base64,${Buffer.from(
                  task.thumbnailData
                ).toString("base64")}`}
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  alignSelf: "center",
                  marginRight: "30px",
                }}
                alt=""
              />
            ) : (
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  alignSelf: "center",
                  backgroundColor: "lightgrey",
                  marginRight: "30px",
                }}
              />
            )}
            <p>{task.text}</p>
          </AccordionSummary>
          <AccordionDetails sx={{ display: "flex" }}>
            <div style={{ marginRight: "50px" }}>
              <b>Status</b>
              <p>{task.status}</p>
            </div>

            <div style={{ marginRight: "50px" }}>
              <b>Priority</b>
              <p>{task.priority}</p>
            </div>

            <div>
              <b>File</b>
              <p>{task.file}</p>
            </div>
          </AccordionDetails>
          <AccordionActions>
            {task.fileData && (
              <Button onClick={() => downloadFile(task.fileData, task.file)}>
                Download File
              </Button>
            )}

            <UpdateTaskModal refreshData={getData} currentStatus={task.status} currentPriority={task.priority} currentText={task.text} id={task._id} />

<Button onClick={() => handleDelete(task._id)}>Delete</Button>
          </AccordionActions>
        </Accordion>
      ))}
    </div>
  );
}
