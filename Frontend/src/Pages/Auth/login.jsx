import React, { useState } from 'react';
import {Link,useNavigate }from "react-router-dom"
import { Button } from "../../Components/Login_ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../Components/Login_ui/card"
import { Input } from "../../Components/Login_ui/input"
import { Label } from "../../Components/Login_ui/label"
import { authAPI } from "../../utils/api"
import { useAuth } from "../../context/AuthContext"

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
    // Clear error when user starts typing
    if (error) setError('')
  }

  async function onSubmit(e) {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await authAPI.login(formData)
      const { token, user } = response.data
      
      // Update auth context
      login({ token, user })
      
      // Navigate based on user role
      if (user.role === 'admin') {
        navigate("/admin-dashboard")
      } else {
        navigate("/dashboard") // Employee dashboard
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(err.response?.data?.error || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
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
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@company.com" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={formData.password}
                onChange={handleChange}
                required 
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-700 hover:bg-blue-800"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
            <div className="mt-2 text-center text-xs text-muted-foreground">
              <Link to="/admin-dashboard" className="text-blue-700 hover:underline">
                Skip and go to dashboard
              </Link>
            </div>
            <div className="text-sm text-center text-muted-foreground">
              <span>New here? </span>
              <Link to="/employer" className="text-blue-700 hover:underline">
                Employer registration
              </Link>
              <span> · </span>
              <Link to="/admin-registration" className="text-blue-700 hover:underline">
                Organization registration
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
