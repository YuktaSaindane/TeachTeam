import { useMemo } from "react";
export const useApplicantStats = (applications: any[]) => {
  return useMemo(() => {
    let mostChosen: { name: string; count: number } | null = null;
    let leastChosen: { name: string; count: number } | null = null;
    const unselected: { id: number; name: string }[] = [];
    // Group by user ID instead of name to handle duplicate names correctly
    const applicantCount: { [userId: number]: { name: string; count: number } } = {};

    applications.forEach((app) => {
      const userId = app.user?.id;
      const name = app.user?.name;
      if (!userId || !name) return;

      if (app.is_selected) {
        if (!applicantCount[userId]) {
          applicantCount[userId] = { name, count: 0 };
        }
        applicantCount[userId].count++;
      } else {
        // For unselected, check if this user is not already in the list
        const alreadyAdded = unselected.some(u => u.id === userId);
        if (!alreadyAdded) {
          unselected.push({ id: userId, name });
        }
      }
    });

    for (const { name, count } of Object.values(applicantCount)) {
      if (!mostChosen || count > mostChosen.count) {
        mostChosen = { name, count };
      }
      if (!leastChosen || count < leastChosen.count) {
        leastChosen = { name, count };
      }
    }

    // Convert unselected back to array of names for backward compatibility
    const unselectedNames = unselected.map(u => u.name);

    return { mostChosen, leastChosen, unselected: unselectedNames };
  }, [applications]);
};
