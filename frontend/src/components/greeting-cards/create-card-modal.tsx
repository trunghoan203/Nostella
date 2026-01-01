"use client"

import { useState, useRef } from "react"
import { Upload, Loader2, Mail, Check, Calendar as CalendarIcon} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "sonner"
import { useGreetingCardsStore } from "@/lib/greeting-store"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"
import Image from "next/image"


interface CreateCardModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateCardModal({ isOpen, onClose }: CreateCardModalProps) {
  const [step, setStep] = useState<"receiver" | "details">("receiver")
  
  // Receiver State
  const [receiverEmail, setReceiverEmail] = useState("")
  const [receiverName, setReceiverName] = useState("")
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [emailChecked, setEmailChecked] = useState(false)

  // Card Details State
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(new Date())
  const [isUploading, setIsUploading] = useState(false)

  const { checkReceiverEmail, createCard, isSending } = useGreetingCardsStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClose = () => {
    setStep("receiver")
    setReceiverEmail("")
    setReceiverName("")
    setTitle("")
    setMessage("")
    setImageUrl("")
    setUploadedFile(null)
    setScheduledDate(new Date())
    setEmailError("")
    setEmailChecked(false)
    onClose()
  }

  const handleCheckEmail = async () => {
    if (!receiverEmail.trim()) {
      setEmailError("Email is required")
      return
    }

    setIsCheckingEmail(true)
    setEmailError("")
    setEmailChecked(false)

    try {
      const user = await checkReceiverEmail(receiverEmail.trim())
      
      if (user) {
        setReceiverName(user.fullName || "User")
        setEmailChecked(true)
      } else {
        setEmailError("User not found with this email")
        setEmailChecked(false)
      }
    } catch {
      setEmailError("Error checking email or User not found")
      setEmailChecked(false)
    } finally {
      setIsCheckingEmail(false)
    }
  }

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file)
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      // Không cần caption nữa vì API mới không dùng

      // 1. SỬA: Gọi API mới 'upload-public'
      const response = await api.post<{ url: string }>("/photos/upload-public", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      if (response.data?.url) {
        setImageUrl(response.data.url)
        toast.success("Image uploaded successfully")
      } else {
        throw new Error("Invalid response")
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to upload image")
      setUploadedFile(null)
    } finally {
      setIsUploading(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleCreateCard = async () => {
    if (!title.trim() || !message.trim() || !imageUrl || !scheduledDate) {
      toast.error("Please fill all fields and upload an image")
      return
    }

    const success = await createCard({
      receiverEmail: receiverEmail.trim(),
      title: title.trim(),
      message: message.trim(),
      imageUrl,
      scheduledAt: scheduledDate.toISOString(),
    })

    if (success) {
      toast.success("Greeting card sent successfully!")
      handleClose()
    } else {
      toast.error("Failed to send card")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl rounded-3xl p-0 overflow-hidden bg-card border-border">
        <DialogHeader className="px-6 py-4 border-b border-border bg-muted/20">
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle className="font-serif text-2xl">Create Greeting Card</DialogTitle>
              <DialogDescription>
                {step === "receiver" ? "Who do you want to send this card to?" : "Design your beautiful greeting card"}
              </DialogDescription>
            </div>
            <button onClick={handleClose} className="text-muted-foreground hover:text-foreground">
            </button>
          </div>
        </DialogHeader>

        <div className="p-6">
          {step === "receiver" ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="receiver-email" className="text-sm font-medium">
                  Recipient Email
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="receiver-email"
                    type="email"
                    value={receiverEmail}
                    onChange={(e) => {
                      setReceiverEmail(e.target.value)
                      setEmailError("")
                      setEmailChecked(false)
                    }}
                    placeholder="Enter recipient email"
                    className="rounded-xl h-11"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCheckEmail()
                    }}
                  />
                  <Button
                    onClick={handleCheckEmail}
                    disabled={isCheckingEmail || !receiverEmail.trim()}
                    className="rounded-xl h-11 bg-secondary hover:bg-secondary/90 text-secondary-foreground min-w-12"
                    type="button"
                  >
                    {isCheckingEmail ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : emailChecked ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Mail className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {emailError && <p className="text-sm text-destructive">{emailError}</p>}
              </div>

              {emailChecked && (
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400">
                  <p className="text-sm">
                    Send to: <span className="font-semibold">{receiverName}</span>
                  </p>
                  <p className="text-xs mt-1">✓ User verified</p>
                </div>
              )}

              <Button
                onClick={() => setStep("details")}
                disabled={!emailChecked}
                className="w-full rounded-xl h-11 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              >
                Continue
              </Button>
            </div>
          ) : (
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pl-2 pr-2 custom-scrollbar">
              {/* Image Upload Zone */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Card Image</Label>
                <div 
                  onClick={triggerFileInput} 
                  className={cn(
                    "border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-muted/30 transition-colors relative overflow-hidden w-full",
                    imageUrl ? "h-64 border-solid p-0" : "p-6 min-h-[200px]"
                  )}
                >
                  {imageUrl ? (
                    <>
                      <div className="absolute inset-0">
                        <Image 
                            src={imageUrl} 
                            alt="Blur Background" 
                            fill
                            className="object-cover blur-xl opacity-50 scale-110" 
                            unoptimized
                          />
                      </div>

                      <div className="absolute inset-0">
                        <Image 
                            src={imageUrl} 
                            alt="Preview" 
                            fill
                            className="object-contain drop-shadow-md" 
                            unoptimized
                          />
                      </div>

                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-10">
                        <p className="text-white font-medium flex items-center gap-2">
                          <Upload className="w-4 h-4" /> Change Image
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      {isUploading ? (
                        <Loader2 className="w-8 h-8 text-secondary animate-spin" />
                      ) : (
                        <Upload className="w-8 h-8 text-muted-foreground" />
                      )}
                      <div className="text-center">
                        <p className="text-sm font-medium">
                          {isUploading ? "Uploading..." : (uploadedFile ? uploadedFile.name : "Click to upload image")}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">JPG, PNG, GIF</p>
                      </div>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileUpload(e.target.files[0])
                      }
                    }}
                    disabled={isUploading}
                  />
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">Card Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Happy Birthday!"
                  className="rounded-xl h-11"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-medium">Your Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your heartfelt message..."
                  className="min-h-[100px] rounded-xl resize-none font-serif text-base"
                />
              </div>

              {/* Scheduled Date */}
              <div className="space-y-2 flex flex-col">
                <Label className="text-sm font-medium">Delivery Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-11 rounded-xl bg-background border-border hover:bg-muted",
                        !scheduledDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-secondary" />
                      {scheduledDate ? format(scheduledDate, "PPP") : "Select delivery date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-xl border-border" align="start">
                    <Calendar
                      mode="single"
                      selected={scheduledDate}
                      onSelect={setScheduledDate}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                      className="rounded-xl"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setStep("receiver")} className="flex-1 rounded-xl h-11">
                  Back
                </Button>
                <Button
                  onClick={handleCreateCard}
                  disabled={isSending || isUploading || !imageUrl || !title.trim() || !message.trim() || !scheduledDate}
                  className="flex-1 rounded-xl h-11 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                >
                  {isSending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Send Card
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}