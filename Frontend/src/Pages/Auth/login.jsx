"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Login() {
  const router = useRouter()

  function onSubmit(e) {
    e.preventDefault()
    // Demo navigation — after "login" go to dashboard
    router.push("/dashboard")
  }

  return (
    <main className="min-h-screen grid place-items-center bg-blue-50">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-balance">Sign in to Crewzy</CardTitle>
          <CardDescription>Access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@company.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800">
              Sign in
            </Button>
            <div className="mt-2 text-center text-xs text-muted-foreground">
              <Link href="/dashboard" className="text-blue-700 hover:underline">
                Skip and go to dashboard
              </Link>
            </div>
            {/* end change */}
            <div className="text-sm text-center text-muted-foreground">
              <span>New here? </span>
              <Link href="/register/employer" className="text-blue-700 hover:underline">
                Employer registration
              </Link>
              <span> · </span>
              <Link href="/register/organization" className="text-blue-700 hover:underline">
                Organization registration
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
