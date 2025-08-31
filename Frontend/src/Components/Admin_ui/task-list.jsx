"use client"

export default function TaskList({ tasks, onFocusTask, onDeleteTask }) {
  return (
    <div className="rounded-xl border border-[#E2E9F9] bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-[#1f2a44]">Tasks</h3>
        <span className="text-sm text-[#4b587c]">{tasks.length} total</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#F4F7FF] text-[#1f2a44]">
            <tr>
              <th className="px-3 py-2">Task</th>
              <th className="px-3 py-2">Employee</th>
              <th className="px-3 py-2">Customer</th>
              <th className="px-3 py-2">Contact</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Scheduled</th>
              <th className="px-3 py-2">Expected</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-3 py-6 text-center text-[#4b587c]">
                  No tasks yet. Create your first one on the left.
                </td>
              </tr>
            ) : (
              tasks.map((t) => (
                <tr key={t.id} className="border-t border-[#E2E9F9]">
                  <td className="px-3 py-2">
                    <div className="font-medium text-[#1f2a44]">{t.taskName}</div>
                    {t.notes ? <div className="text-xs text-[#4b587c]">{t.notes}</div> : null}
                  </td>
                  <td className="px-3 py-2 text-[#1f2a44]">{t.employeeName}</td>
                  <td className="px-3 py-2 text-[#1f2a44]">{t.customerName || "-"}</td>
                  <td className="px-3 py-2 text-[#1f2a44]">{t.contactNumber || "-"}</td>
                  <td className="px-3 py-2">
                    <span className="rounded-full bg-[#D1DFFA] px-2 py-1 text-xs text-[#1f2a44]">{t.category}</span>
                  </td>
                  <td className="px-3 py-2 text-[#1f2a44]">
                    {t.scheduledDate || "-"} {t.scheduledTime || ""}
                  </td>
                  <td className="px-3 py-2 text-[#1f2a44]">{t.expectedDate || "-"}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onFocusTask(t)}
                        className="rounded-md border border-[#E2E9F9] bg-white px-2 py-1 text-xs text-[#1f2a44] hover:bg-[#F4F7FF]"
                      >
                        Locate
                      </button>
                      <button
                        onClick={() => onDeleteTask(t.id)}
                        className="rounded-md bg-[#4786FA] px-2 py-1 text-xs text-white hover:opacity-95"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
