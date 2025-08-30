import { EmployerRegistered } from "./Register"
import {Link} from "react-router-dom"

export default function EmployerRegisterPage() {
  return (
    <main className="min-h-screen grid place-items-center bg-blue-50">
      <EmployerRegistered />
      <p className="mt-3 text-center text-xs text-muted-foreground">
        <Link href="/dashboard" className="text-blue-700 hover:underline">
          Skip and go to dashboard
        </Link>
      </p>
    </main>
  )
}
