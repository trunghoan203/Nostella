"use client"

import { useState, useRef  } from "react"
import { useRouter } from "next/navigation"
import { User, Mail, LogOut, Camera, Shield, Bell, Palette, Loader2, Check, X, Globe } from "lucide-react"
import { useAuthStore } from "@/lib/auth-store"
import { useLanguageStore } from "@/lib/language-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

export function SettingsView() {
  const router = useRouter()
  const { user, logout, updateProfile, updateAvatar, isUpdatingProfile } = useAuthStore()
  const { language, t, setLanguage } = useLanguageStore()

  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState(user?.name || "")

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLogout = () => {
    logout()
    toast.success("Logged out successfully")
    router.push("/")
  }

  const handleSaveName = async () => {
    if (!editedName.trim()) {
      toast.error("Name cannot be empty")
      return
    }
    try {
      await updateProfile(editedName.trim())
      toast.success("Profile updated successfully")
      setIsEditingName(false)
    } catch (error) {
      toast.error("Failed to update profile")
    }
  }

  const handleCancelEdit = () => {
    setEditedName(user?.name || "")
    setIsEditingName(false)
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file")
      return
    }

    setIsUploadingAvatar(true)
    try {
      await updateAvatar(file)
      toast.success("Avatar updated successfully")
    } catch (error) {
      console.error(error)
      toast.error("Failed to update avatar")
    } finally {
      setIsUploadingAvatar(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }


  const handleLanguageChange = (lang: "en" | "vi") => {
    setLanguage(lang)
    toast.success(
      lang === "en"
        ? "Language changed to English"
        : "Đã chuyển sang Tiếng Việt"
    )
  }

  const getCurrentLanguageLabel = () => {
    return language === "en" 
      ? t.settings.preferences.language.english 
      : t.settings.preferences.language.vietnamese
  }

  return (
    <div className="p-4 md:p-8 w-full">
      {/* Header */}
      <header className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-2 text-balance">Settings</h1>
        <p className="text-muted-foreground text-base md:text-lg">Manage your account and preferences</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Information (2/3 width on desktop) */}
        <div className="lg:col-span-2">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm h-full">
            <CardHeader>
              <CardTitle className="font-serif text-xl flex items-center gap-2">
                <User className="w-5 h-5 text-secondary" />
                Profile Information
              </CardTitle>
              <CardDescription>Your personal details and account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="relative group">
                  {/* Avatar Circle */}
                  <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-secondary to-accent flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-secondary/50 transition-all">
                    {isUploadingAvatar ? (
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    ) : user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-serif font-semibold text-secondary-foreground">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    )}
                  </div>

                  {/* Camera Button Trigger */}
                  <button 
                    onClick={handleAvatarClick}
                    disabled={isUploadingAvatar}
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    <Camera className="w-4 h-4" />
                  </button>

                  {/* Hidden File Input */}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </div>

                <div>
                  <h3 className="font-medium text-foreground text-lg">{user?.name || "User"}</h3>
                  <p className="text-sm text-muted-foreground">Change profile photo</p>
                </div>
              </div>

              <Separator />

              {/* User Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      {isEditingName ? (
                        <Input
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="mt-1 h-9 bg-background"
                          placeholder="Enter your name"
                          autoFocus
                        />
                      ) : (
                        <p className="font-medium text-foreground truncate">{user?.name || "Not set"}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    {isEditingName ? (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={handleSaveName}
                          disabled={isUpdatingProfile}
                          className="gap-1.5"
                        >
                          {isUpdatingProfile ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                          Save
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCancelEdit}
                          disabled={isUpdatingProfile}
                          className="gap-1.5"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditingName(true)}
                        className="text-secondary hover:text-secondary"
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                </div>

                {/* Email - Read only */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground">Email Address</p>
                      <p className="font-medium text-foreground truncate">{user?.email || "Not set"}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-muted-foreground ml-3" disabled>
                    Verified
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Preferences & Account Actions (1/3 width on desktop) */}
        <div className="space-y-6">
          {/* Preferences Card */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-serif text-xl flex items-center gap-2">
                <Palette className="w-5 h-5 text-secondary" />
                Preferences
              </CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">Notifications</p>
                    <p className="text-xs text-muted-foreground">Memory reminders</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>

              {/* Language Selection */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-foreground">{t.settings.preferences.language.title}</p>
                    <p className="text-muted-foreground">{getCurrentLanguageLabel()}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      {t.settings.preferences.language.button}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-2">
                    <DropdownMenuItem
                      onClick={() => handleLanguageChange("en")}
                      className="cursor-pointer px-4 py-3 rounded-lg hover:bg-secondary/10 focus:bg-secondary/10"
                    >
                      <div className="flex items-center justify-between w-full gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">🇺🇸</span>
                          <span className="text-foreground">{t.settings.preferences.language.english}</span>
                        </div>
                        {language === "en" && <Check className="w-4 h-4 text-secondary shrink-0" />}
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleLanguageChange("vi")}
                      className="cursor-pointer px-4 py-3 rounded-lg hover:bg-secondary/10 focus:bg-secondary/10"
                    >
                      <div className="flex items-center justify-between w-full gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">🇻🇳</span>
                          <span className="text-foreground">{t.settings.preferences.language.vietnamese}</span>
                        </div>
                        {language === "vi" && <Check className="w-4 h-4 text-secondary shrink-0" />}
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone / Account Actions */}
          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="font-serif text-xl text-destructive flex items-center gap-2">
                <LogOut className="w-5 h-5" />
                Account Actions
              </CardTitle>
              <CardDescription>Logout or manage your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/50">
                <div>
                  <p className="font-medium text-foreground text-sm">Sign Out</p>
                  <p className="text-xs text-muted-foreground">Log out of Nostella</p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="gap-2">
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-card border-border">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-serif text-xl">
                        Are you sure you want to log out?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        You will need to sign in again to access your memories. Any unsaved changes will be lost.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleLogout}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Log Out
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
