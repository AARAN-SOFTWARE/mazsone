import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { cn } from "../../lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "../Chart/card"
import PasswordInput from "../Input/passwordInput"
import FloatingInput from "../Input/FloatingInput"
import apiClient from "@/pages/app/api/apiClients" // ✅ Use this instead of axios
import Button from "../Input/Button"

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      // 1. Get CSRF cookie
      await apiClient.get("/sanctum/csrf-cookie")

      // 2. Attempt login
      await apiClient.post("/api/login", {
        email,
        password,
      })

      console.log("Login success:")
      navigate("/")
    } catch (err: any) {
      console.error("Login failed", err)
      setError(err.response?.data?.message || "Login failed")
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-center py-2 text-xl font-bold text-update">Welcome</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <FloatingInput
                  id="email"
                  type="email"
                  placeholder="demo@gmail.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  label="Email"
                  err=""
                />
              </div>
              <div className="grid gap-3">
                <PasswordInput
                  id="password"
                  value={password}
                  error=""
                  label="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full bg-update text-update-foreground" label={"Login"}/>
                 
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/signup" className="underline text-update underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
