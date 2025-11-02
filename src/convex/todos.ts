import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getTodos = query({
  handler: async (ctx) => {
    return await ctx.db.query("todos").collect();
  },
});

export const createTodo = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    dueDate: v.optional(v.string()),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("todos", {
      title: args.title,
      description: args.description || "",
      completed: false,
      dueDate: args.dueDate || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: args.userId,
      position: 0, // Placeholder
    });
  },
});

export const deleteTodo = mutation({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const updateTodo = mutation({
  args: {
    id: v.id("todos"),
    title: v.string(),
    description: v.optional(v.string()),
    completed: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, { ...rest, updatedAt: new Date().toISOString() });
  },
});

export const clearCompleted = mutation({
  handler: async (ctx) => {
    const completedTasks = await ctx.db
      .query("todos")
      .filter((q) => q.eq(q.field("completed"), true))
      .collect();

    for (const task of completedTasks) {
      await ctx.db.delete(task._id);
    }
  },
});

export const clearCompleted = mutation({
  handler: async (ctx) => {
    const completedTasks = await ctx.db
      .query("todos")
      .filter((q) => q.eq(q.field("completed"), true))
      .collect();

    for (const task of completedTasks) {
      await ctx.db.delete(task._id);
    }
  },
});
