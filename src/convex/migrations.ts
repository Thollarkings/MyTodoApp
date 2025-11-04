import { mutation } from "./_generated/server";

export const migrateTodoPositions = mutation({
  handler: async (ctx) => {
    const todos = await ctx.db.query("todos").collect();
    
    // Assign positions to todos that don't have them
    for (let i = 0; i < todos.length; i++) {
      const todo = todos[i];
      if (todo.position === undefined || todo.position === null) {
        await ctx.db.patch(todo._id, { 
          position: i,
          updatedAt: new Date().toISOString()
        });
      }
    }
  },
});