import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function StatCard({
  title,
  value,
  delta,
  icon,
  tone = "green",
}: {
  title: string
  value: string
  delta?: string
  icon?: React.ReactNode
  tone?: "green" | "red" | "blue" | "amber"
}) {
  const toneMap: Record<string, string> = {
    green: "text-green-600 bg-green-50",
    red: "text-red-600 bg-red-50",
    blue: "text-blue-600 bg-blue-50",
    amber: "text-amber-600 bg-amber-50",
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {delta ? (
          <p className="mt-1 text-sm">
            <span className={`inline-flex rounded px-1.5 py-0.5 text-xs ${toneMap[tone]}`}>{delta}</span>
            <span className="ml-2 text-muted-foreground">since last month</span>
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}
