"use client";

import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface LoginFormProps {
  url: string;
  title: string;
}

export default function LoginForm(props: LoginFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(props.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        document.cookie = `jwt=${data.token}; path=/`;
        router.push("/tasks");
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

  return (
    <form onSubmit={handleLogin}> 
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography component="div" sx={{ width: "100%", margin: "10px auto" }}>
            <TextField
              id="username"
              name="username" 
              label="Username"
              variant="standard"
              sx={{ width: "100%" }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Typography>

          <Typography component="div" sx={{ width: "100%", margin: "10px auto" }}>
            <TextField
              id="password"
              name="password" 
              label="Password"
              variant="standard"
              type="password"
              sx={{ width: "100%" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            type="submit" 
            variant="contained"
            sx={{ width: "80%", margin: "auto" }}
          >
            {props.title}
          </Button>
        </CardActions>
      </Card>
    </form> 
  );
}
