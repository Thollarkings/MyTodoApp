// convex/todos.ts - Corrected version
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Fetches all todos from the database, ordered by their position.
 */
export const getTodos = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("todos")
      .order("position") // Ensures todos are returned in the correct order for display
      .collect();
  },
});

/**
 * Creates a new todo item.
 * A new todo is always added to the end of the list.
 */
export const createTodo = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    dueDate: v.optional(v.string()),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // Determine the position for the new todo by finding the current highest position.
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
      position: highestPosition + 1, // Place the new todo at the end
    });
  },
});

/**
 * Updates the position of a single todo item.
 * This is used for drag-and-drop reordering.
 */
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

/**
 * Atomically updates the positions of multiple todos in a single transaction.
 * This is crucial for maintaining data integrity during drag-and-drop operations.
 */
export const reorderTodos = mutation({
  args: {
    updates: v.array(v.object({
      id: v.id("todos"),
      position: v.number(),
    }))
  },
  handler: async (ctx, args) => {
    // Use Promise.all to apply all updates concurrently for better performance.
    const updates = args.updates.map(update => 
      ctx.db.patch(update.id, { 
        position: update.position,
        updatedAt: new Date().toISOString()
      })
    );
    
    await Promise.all(updates);
  },
});

/**
 * Deletes a single todo item by its ID.
 */
export const deleteTodo = mutation({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

/**
 * Updates the content and completion status of a todo item.
 */
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

/**
 * Removes all completed todos from the database.
 */
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