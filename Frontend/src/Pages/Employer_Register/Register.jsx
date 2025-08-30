import React from 'react';

import { useNavigate } from "react-router-dom"
import { Button } from "../../Components/Login_ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../Components/Login_ui/card"
import { Input } from "../../Components/Login_ui/input"
import { Label } from "../../Components/Login_ui/label"

export function EmployerRegistered() {
    const navigate = useNavigate()

    const onSubmit = (e) => {
        e.preventDefault();
        // perform your login logic here
        navigate("/login"); // replaces router.push()
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Employer Registration</CardTitle>
                <CardDescription>Create your employer account</CardDescription>
            </CardHeader>
            <CardContent>
                {/* <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="company">Company Name</Label>
            <Input id="company" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Work Email</Label>
            <Input id="email" type="email" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
          <Button type="submit" className="bg-blue-700 hover:bg-blue-800">
            Create account
          </Button> 
        </form> */}

                <form onSubmit={onSubmit} className="grid gap-4">
                    {/* Organization Name */}
                    <div className="grid gap-2">
                        <Label htmlFor="organization">Organization Name</Label>
                        <Input id="organization" name="organization" required />
                    </div>

                    {/* Work Email */}
                    <div className="grid gap-2">
                        <Label htmlFor="email">Work Email</Label>
                        <Input id="email" name="email" type="email" required />
                    </div>

                    {/* Password */}
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" required />
                    </div>

                    {/* Role (Hidden) */}
                    <input type="hidden" id="role" name="role" value="employee" />

                    {/* Work Type Dropdown */}
                    <div className="grid gap-2">
                        <Label htmlFor="workType">Work Type</Label>
                        <select
                            id="workType"
                            name="workType"
                            className="border rounded-md px-3 py-2"
                            required
                        >
                            <option value="office">Office</option>
                            <option value="hybrid">Hybrid</option>
                        </select>
                    </div>

                    {/* Work Category */}
                    <div className="grid gap-2">
                        <Label htmlFor="workCategory">Work Category</Label>
                        <Input id="workCategory" name="workCategory" required />
                    </div>

                    {/* Submit */}
                    <Button type="submit" className="bg-blue-700 hover:bg-blue-800">
                        Create account
                    </Button>
                </form>

            </CardContent>
        </Card>
    )
}
