import { mutation } from "./_generated/server";

/**
 * A one-time migration to ensure all existing todos have a `position` field.
 * This is necessary for the drag-and-drop functionality to work correctly with legacy data.
 */
export const migrateTodoPositions = mutation({
  handler: async (ctx) => {
    // Retrieve all todos from the database.
    const todos = await ctx.db.query("todos").collect();
    
    // Iterate over each todo and assign a position if it's missing.
    for (let i = 0; i < todos.length; i++) {
      const todo = todos[i];
      if (todo.position === undefined || todo.position === null) {
        // Assign the current index as the position for legacy todos.
        await ctx.db.patch(todo._id, { 
          position: i,
          updatedAt: new Date().toISOString()
        });
      }
    }
  },
});