import { randomUUID } from "node:crypto";

import { database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

export const routes = [
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (!title) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ message: "Título é obrigatório" }));
      }

      if (!description) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ message: "Descrição é obrigatória" }));
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      database.create("tasks", task);

      return res.writeHead(201).end();
    },
  },
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = database.select("tasks", {
        title: search,
        description: search,
      });

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      if (!title) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ message: "Título é obrigatório" }));
      }

      if (!description) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ message: "Descrição é obrigatória" }));
      }

      const [task] = database.select("tasks", { id });

      if (!task) {
        return res.writeHead(404).end();
      }

      database.update("tasks", id, {
        title,
        description,
        updated_at: new Date(),
      });

      return res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const [task] = database.select("tasks", { id });

      if (!task) {
        return res.writeHead(404).end();
      }

      const isCompleted = !!task.completed_at;
      const completed_at = isCompleted ? null : new Date();

      database.update("tasks", id, { completed_at });

      return res.writeHeader(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const [task] = database.select("tasks", { id });

      if (!task) {
        return res.writeHead(404).end();
      }

      database.remove("tasks", id);

      return res.writeHeader(204).end();
    },
  },
];
