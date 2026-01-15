"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Save, User, Bell, Shield, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import Image from "next/image"
import { updateProfile } from "@/actions/profile"
import { notifications } from "@/utils/toast"
import { LoadingOverlay } from "@/components/ui/spinner"
import { FileUpload } from "@/components/ui/file-upload"
import { PageHeader } from "@/components/page-header"

export default function SettingsPage() {
  const { user, login } = useAuth()
  const isAdmin = user?.account_type === "Admin"
  const [username, setUsername] = useState(user?.username || "")
  const [email, setEmail] = useState(user?.email || "")
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!username.trim()) {
      newErrors.username = "Username is required"
    }
    if (username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters"
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFileUpload = async (files: File[]) => {
    try {
      const uploadPromises = files.map(async (file) => {
        const reader = new FileReader()
        return new Promise<string>((resolve) => {
          reader.onloadend = () => {
            resolve(reader.result as string)
          }
          reader.readAsDataURL(file)
        })
      })
      const previews = await Promise.all(uploadPromises)
      setUploadedFiles([...uploadedFiles, ...previews])
    } catch (error) {
      notifications.error("Failed to upload image")
    }
  }

  const handleSave = async () => {
    if (!validateForm()) {
      notifications.error("Please fix the errors in the form")
      return
    }

    setIsSaving(true)
    try {
      const avatar = uploadedFiles.length > 0 ? uploadedFiles[0] : user?.avatar
      const data = await updateProfile({
        username: username.trim(),
        email: email.trim() || undefined,
        avatar: avatar,
      })
      if (data?.user) {
        login(data.user, data.token || "")
        notifications.success("Profile updated successfully")
      }
    } catch (error: any) {
      notifications.error(error.response?.data?.message || "Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }


  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="pl-0 lg:pl-64">
          <PageHeader
            title="Settings"
            description="Manage your account settings and preferences"
          />
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              <>
              <Card className="bg-card border-border">
                <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <User className="w-5 h-5" />
                    Profile
                  </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">Update your profile information</CardDescription>
                </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Profile Picture</label>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-4">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-secondary flex items-center justify-center overflow-hidden shrink-0">
                      <Image
                        src={uploadedFiles[0] || user?.avatar || "/avatar.jpg"}
                        alt={user?.username || "user"}
                        width={80}
                        height={80}
                        className="rounded-full"
                      />
                    </div>
                          <div className="flex-1 w-full sm:w-auto">
                      <FileUpload
                        accept="image/*"
                        multiple={false}
                        maxSize={2 * 1024 * 1024}
                        maxFiles={1}
                        onUpload={handleFileUpload}
                        onRemove={(index) => setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))}
                        previews={uploadedFiles}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Username</label>
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={`bg-secondary border-border ${errors.username ? "border-destructive" : ""}`}
                    />
                    {errors.username && <p className="text-xs text-destructive mt-1">{errors.username}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`bg-secondary border-border ${errors.email ? "border-destructive" : ""}`}
                    />
                    {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                  </div>
                </div>

                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                        className="bg-lime hover:bg-lime/90 text-background font-semibold w-full sm:w-auto"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <LoadingOverlay isLoading={isSaving} message="Saving changes..." />
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">Manage your notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex-1">
                          <p className="font-medium text-sm sm:text-base">Push Notifications</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">Receive notifications in your browser</p>
                  </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={notificationsEnabled}
                      onChange={(e) => setNotificationsEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lime"></div>
                  </label>
                </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex-1">
                          <p className="font-medium text-sm sm:text-base">Email Notifications</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lime"></div>
                  </label>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Shield className="w-5 h-5" />
                  Security
                </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Wallet Address</label>
                  <Input
                    value={user?.address || ""}
                    readOnly
                    className="bg-secondary border-border"
                  />
                  <p className="text-xs text-muted-foreground mt-2">Your connected wallet address</p>
                </div>
              </CardContent>
            </Card>
            </>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}

