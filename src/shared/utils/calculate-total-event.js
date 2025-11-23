export const calculateEventTotal = (event) => {
  // --- SUMA DE ASSIGNATIONS ---
  const totalAssignations = Array.isArray(event.assignations)
    ? event.assignations.reduce(
        (sum, a) => sum + (a?.hourly_rate ?? 0),
        0
      )
    : 0;

  // --- SUMA DE TODAS LAS SUBTASKS ---
  const totalSubtasks = Array.isArray(event.tasks)
    ? event.tasks.reduce((taskSum, task) => {
        if (!Array.isArray(task.subtasks)) return taskSum;

        const subSum = task.subtasks.reduce(
          (subAcc, sub) => subAcc + (sub?.price ?? 0),
          0
        );

        return taskSum + subSum;
      }, 0)
    : 0;

  return totalAssignations + totalSubtasks;
}
