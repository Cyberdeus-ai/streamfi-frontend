"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, Image as ImageIcon } from "lucide-react"

export interface FileUploadProps {
  accept?: string
  multiple?: boolean
  maxSize?: number
  maxFiles?: number
  onUpload: (files: File[]) => void
  onRemove?: (index: number) => void
  previews?: string[]
  className?: string
}

export function FileUpload({
  accept = "image/*",
  multiple = false,
  maxSize = 2 * 1024 * 1024,
  maxFiles = 5,
  onUpload,
  onRemove,
  previews = [],
  className = "",
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File size must be less than ${(maxSize / 1024 / 1024).toFixed(0)}MB`
    }
    return null
  }

  const handleFiles = (files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files)
    const validFiles: File[] = []
    const errors: string[] = []

    fileArray.forEach((file) => {
      const error = validateFile(file)
      if (error) {
        errors.push(`${file.name}: ${error}`)
      } else {
        validFiles.push(file)
      }
    })

    if (errors.length > 0) {
      setError(errors.join(", "))
    } else {
      setError("")
    }

    if (validFiles.length > 0) {
      const remainingSlots = maxFiles - previews.length
      const filesToAdd = validFiles.slice(0, remainingSlots)
      onUpload(filesToAdd)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }

  return (
    <div className={className}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging ? "border-cyan bg-cyan/5" : "border-border bg-secondary/50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
        />
        <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-2">
          Drag and drop files here, or click to browse
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          Max size: {(maxSize / 1024 / 1024).toFixed(0)}MB {multiple && `• Max files: ${maxFiles}`}
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={previews.length >= maxFiles}
        >
          <Upload className="w-4 h-4 mr-2" />
          Select Files
        </Button>
        {error && <p className="text-xs text-destructive mt-2">{error}</p>}
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-border"
              />
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="absolute top-2 right-2 p-1 bg-destructive rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4 text-background" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

