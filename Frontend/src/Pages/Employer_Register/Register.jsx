import React, { useState } from 'react';
import { useNavigate } from "react-router-dom"
import { Button } from "../../Components/Login_ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../Components/Login_ui/card"
import { Input } from "../../Components/Login_ui/input"
import { Label } from "../../Components/Login_ui/label"
import { authAPI } from "../../utils/api"

export function EmployerRegistered() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        organization: '',
        subRole: '',
        workType: 'office'
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        // Clear error when user starts typing
        if (error) setError('')
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        setError('')

        try {
            // Prepare employee signup data matching backend schema
            const employeeData = {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
                role: 'employee', // Fixed to match backend enum
                organization: formData.organization.trim(),
                subRole: formData.subRole.trim(),
                workType: formData.workType
            }

            console.log('Registering employee:', employeeData)
            const response = await authAPI.signup(employeeData)
            console.log('Employee registered successfully:', response.data)

            // Show success message and redirect
            alert('✅ Employee registration successful!')
            navigate("/login")

        } catch (err) {
            console.error('Registration error:', err)
            setError(err.response?.data?.error || 'Registration failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Employee Registration</CardTitle>
                <CardDescription>Create your employee account</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="grid gap-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                            {error}
                        </div>
                    )}
                    
                    {/* Name */}
                    <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                            id="name" 
                            name="name" 
                            value={formData.name}
                            onChange={handleChange}
                            required 
                        />
                    </div>

                    {/* Organization Name */}
                    <div className="grid gap-2">
                        <Label htmlFor="organization">Organization Name</Label>
                        <Input 
                            id="organization" 
                            name="organization" 
                            value={formData.organization}
                            onChange={handleChange}
                            required 
                        />
                    </div>

                    {/* Work Email */}
                    <div className="grid gap-2">
                        <Label htmlFor="email">Work Email</Label>
                        <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            value={formData.email}
                            onChange={handleChange}
                            required 
                        />
                    </div>

                    {/* Password */}
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input 
                            id="password" 
                            name="password" 
                            type="password" 
                            value={formData.password}
                            onChange={handleChange}
                            required 
                        />
                    </div>

                    {/* Sub Role */}
                    <div className="grid gap-2">
                        <Label htmlFor="subRole">Job Title/Role</Label>
                        <Input 
                            id="subRole" 
                            name="subRole" 
                            placeholder="e.g., Software Developer, Manager"
                            value={formData.subRole}
                            onChange={handleChange}
                            required 
                        />
                    </div>

                    {/* Work Type Dropdown */}
                    <div className="grid gap-2">
                        <Label htmlFor="workType">Work Type</Label>
                        <select
                            id="workType"
                            name="workType"
                            className="border rounded-md px-3 py-2"
                            value={formData.workType}
                            onChange={handleChange}
                            required
                        >
                            <option value="office">Office</option>
                            <option value="hybrid">Hybrid</option>
                        </select>
                    </div>

                    {/* Submit */}
                    <Button 
                        type="submit" 
                        className="bg-blue-700 hover:bg-blue-800"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating account...' : 'Create account'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
