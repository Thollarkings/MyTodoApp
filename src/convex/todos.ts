// convex/todos.ts - Corrected version
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getTodos = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("todos")
      .order("position")
      .collect();
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
    // Get the highest position to add new todo at the end
    const todos = await ctx.db.query("todos").order("position").collect();
    const highestPosition = todos.length > 0 ? Math.max(...todos.map(t => t.position)) : 0;
    
    await ctx.db.insert("todos", {
      title: args.title,
      description: args.description || "",
      completed: false,
      dueDate: args.dueDate || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: args.userId,
      position: highestPosition + 1,
    });
  },
});

export const updateTodoPosition = mutation({
  args: {
    id: v.id("todos"),
    position: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { 
      position: args.position,
      updatedAt: new Date().toISOString()
    });
  },
});

export const reorderTodos = mutation({
  args: {
    updates: v.array(v.object({
      id: v.id("todos"),
      position: v.number(),
    }))
  },
  handler: async (ctx, args) => {
    // Update all positions in a transaction
    const updates = args.updates.map(update => 
      ctx.db.patch(update.id, { 
        position: update.position,
        updatedAt: new Date().toISOString()
      })
    );
    
    await Promise.all(updates);
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