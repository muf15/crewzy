import React, { useState, useEffect } from 'react';
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
        workType: 'office',
        skills: []
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [location, setLocation] = useState({ lat: null, lon: null })
    const [locationError, setLocationError] = useState(null)
    const [skillInput, setSkillInput] = useState('')

    // Get user location
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    });
                },
                (err) => {
                    setLocationError(err.message);
                }
            );
        } else {
            setLocationError("Geolocation is not supported by this browser.");
        }
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        // Clear error when user starts typing
        if (error) setError('')
    }

    const handleSkillAdd = () => {
        if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
            setFormData({
                ...formData,
                skills: [...formData.skills, skillInput.trim()]
            })
            setSkillInput('')
        }
    }

    const handleSkillRemove = (skillToRemove) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter(skill => skill !== skillToRemove)
        })
    }

    const handleSkillKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleSkillAdd()
        }
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
                role: 'employee', // Fixed to match backend enum - always employee
                organization: formData.organization.trim(),
                subRole: formData.subRole.trim(),
                workType: formData.workType,
                skills: formData.skills
            }

            // Add location if available and workType requires it
            if (location.lat && location.lon) {
                employeeData.location = {
                    type: "Point",
                    coordinates: [location.lon, location.lat] // [longitude, latitude] as per MongoDB convention
                }
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
                            <option value="office">🏢 Office</option>
                            <option value="hybrid">🏠💼 Hybrid</option>
                        </select>
                        <p className="text-xs text-gray-500">
                            • <strong>Office:</strong> Work from company premises only<br/>
                            • <strong>Hybrid:</strong> Work from both office and home
                        </p>
                    </div>

                    {/* Location Information */}
                    <div className="grid gap-2">
                        <Label>Location Status</Label>
                        <div className="p-3 bg-gray-50 rounded-md text-sm">
                            {locationError && (
                                <p className="text-red-500">📍 Location Error: {locationError}</p>
                            )}
                            {location.lat && location.lon ? (
                                <p className="text-green-600">
                                    📍 Location captured: {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
                                </p>
                            ) : (
                                <p className="text-blue-500">📍 Fetching your location...</p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                                Location is used for attendance tracking and proximity-based features
                            </p>
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="grid gap-2">
                        <Label htmlFor="skills">Skills</Label>
                        <div className="flex gap-2">
                            <Input 
                                id="skills" 
                                name="skills" 
                                placeholder="e.g., JavaScript, Project Management"
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyPress={handleSkillKeyPress}
                            />
                            <Button 
                                type="button" 
                                onClick={handleSkillAdd}
                                className="px-3 py-2 bg-green-600 hover:bg-green-700"
                            >
                                Add
                            </Button>
                        </div>
                        {formData.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.skills.map((skill, index) => (
                                    <span 
                                        key={index}
                                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center gap-1"
                                    >
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => handleSkillRemove(skill)}
                                            className="ml-1 text-blue-600 hover:text-blue-800"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
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
