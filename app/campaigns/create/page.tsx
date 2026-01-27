"use client"

import { useState, useEffect, Suspense } from "react"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Image as ImageIcon, X, Loader2, Plus, CheckCircle2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useCampaigns } from "@/contexts/campaigns-context"
import { LoadingOverlay } from "@/components/ui/spinner"
import { notifications } from "@/utils/toast"
import type { Campaign } from "@/types"
import { createCampaign, uploadImage, updateCampaign as updateCampaignAction } from "@/actions/campaigns"
import { PoolSelector } from "@/components/campaigns/pool-selector"
import { mockCampaigns } from "@/data/mock-data"
import { FarcasterIcon } from "@/components/icons/farcaster-icon"
import { LensIcon } from "@/components/icons/lens-icon"
import { MindsIcon } from "@/components/icons/minds-icon"

const web3Socials = [
    {
        name: "Farcaster",
        value: "farcaster",
        icon: <FarcasterIcon className="w-24 h-24 fill-[#855DCD]" />,
        url: "https://farcaster.xyz",
    },
    {
        name: "Lens Protocol",
        value: "lens",
        icon: <LensIcon className="w-24 h-24 fill-[#05B044]" />,
        url: "https://lens.xyz",
    },
    {
        name: "Minds",
        value: "minds",
        icon: <MindsIcon className="w-24 h-24 fill-[#FED12F]" />,
        url: "https://minds.com",
    }
]

function CreateCampaignContent({ }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { loading, user } = useAuth()
    const {
        getCampaignById: getCampaignFromContext,
        updateCampaign: updateCampaignInContext,
        addCampaign: addCampaignInContext } = useCampaigns()
    const editId = searchParams.get("edit")
    const isEditMode = editId !== null
    const [isLoadingCampaign, setIsLoadingCampaign] = useState(isEditMode)
    const [campaign, setCampaign] = useState<Partial<Campaign>>({})
    const [tags, setTags] = useState<{
        guidelines?: string,
        hashtags?: string,
        tickers?: string,
        templates?: {
            type?: string,
            title?: string,
            preview?: string
        },
        big_accounts?: string
    }>({
        guidelines: "",
        hashtags: "",
        tickers: "",
        templates: {
            type: "Thread",
            title: "",
            preview: ""
        },
        big_accounts: ""
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isUploadingLogo, setIsUploadingLogo] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        setCampaign((prev) => ({
            ...prev,
            twitter: user?.username || ""
        }))
    }, [user?.username])

    useEffect(() => {
        if (isEditMode) {
            setIsLoadingCampaign(true)
            const campaignId = Number(editId)
            const contextCampaign = getCampaignFromContext(campaignId)

            if (contextCampaign) {
                setCampaign(contextCampaign)
                setIsLoadingCampaign(false)
            } else {
                setCampaign(mockCampaigns[0])
                setIsLoadingCampaign(false)
            }
        }
    }, [isEditMode, editId, getCampaignFromContext])

    const onInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setCampaign(prev => ({ ...prev, [name]: value.startsWith("{") ? JSON.parse(value) : value }))
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[name]
                return newErrors
            })
        }
    }

    const onTagInputChanged = (type: string, value: any) => {
        setCampaign(prev => ({ ...prev, [type]: value }))
    }

    const addTag = (type: "templates" | "guidelines" | "hashtags" | "tickers" | "big_accounts") => {
        if ((tags?.[type] && Object.keys(tags?.[type]).length > 0 &&
            Object.entries(tags?.[type]).every(([key, value]) => value.trim() !== "")) ||
            (tags?.[type] && (tags?.[type] as string).trim())) {
            const current = campaign?.[type] || []
            onTagInputChanged(type, [...current, tags?.[type]])
            setTags(prev => ({ ...prev, [type]: "" }))
            if (errors[type]) {
                setErrors(prev => {
                    const newErrors = { ...prev }
                    delete newErrors[type]
                    return newErrors
                })
            }
        }
    }

    const removeTag = (type: "hashtags" | "tickers" | "guidelines" | "templates" | "big_accounts", index: number) => {
        const current = campaign?.[type] || []
        onTagInputChanged(type, current.filter((_, i) => i !== index))
    }

    const handleSubmit = async () => {
        const newErrors: Record<string, string> = {}

        if (!campaign.name?.trim()) {
            newErrors.name = "Campaign name is required"
        }

        if (!campaign.description?.trim()) {
            newErrors.description = "Campaign description is required"
        }

        if (!campaign.web3_social?.trim()) {
            newErrors.web3_social = "Campaign website is required"
        }

        if (!campaign.twitter?.trim()) {
            newErrors.twitter = "Campaign twitter is required"
        }

        if (!campaign.about?.trim()) {
            newErrors.about = "Campaign about is required"
        }

        if (!campaign.guidelines || campaign.guidelines.length === 0) {
            newErrors.guidelines = "Campaign guidelines are required"
        }

        if (!campaign.templates || campaign.templates.length === 0) {
            newErrors.templates = "Campaign templates are required"
        }

        if (!campaign.start_date) {
            newErrors.start_date = "Start date is required"
        }

        if (!campaign.end_date) {
            newErrors.end_date = "End date is required"
        }

        if (campaign.start_date && campaign.end_date) {
            const start = new Date(campaign.start_date)
            const end = new Date(campaign.end_date)
            if (end <= start) {
                newErrors.end_date = "End date must be after start date"
            }
        }

        if (!campaign.hashtags || campaign.hashtags.length === 0) {
            newErrors.hashtags = "At least one hashtag is required"
        }

        if (!campaign.tickers || campaign.tickers.length === 0) {
            newErrors.tickers = "At least one ticker is required"
        }

        if (!campaign.big_accounts || campaign.big_accounts.length === 0) {
            newErrors.big_accounts = "Campaign big accounts are required"
        }

        if (!campaign.pool || !campaign.pool.id) {
            newErrors.pool = "Pool selection is required"
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            setIsSubmitting(false)
            return
        }

        setErrors({})
        setIsSubmitting(true)
        try {
            if (isEditMode) {
                const data = await updateCampaignAction(Number(editId), campaign as Partial<Campaign>)
                if (data.result) {
                    updateCampaignInContext(Number(editId), data.campaign)
                    notifications.success("Campaign updated successfully")
                    router.push(`/campaigns/${editId}`)
                }
            } else {
                campaign.user = { id: user?.id || 0 }
                const data = await createCampaign(campaign as Partial<Campaign>)
                if (data.result) {
                    addCampaignInContext(data.campaign)
                    notifications.success("Campaign created successfully")
                    router.push("/campaigns")
                }
            }
        } catch (error: any) {
            console.log(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <AuthGuard>
            <div className="min-h-screen bg-background">
                <Sidebar />
                <LoadingOverlay isLoading={isSubmitting || isLoadingCampaign} message={isLoadingCampaign ? "Loading campaign..." : "Creating campaign..."} />
                <main className="pl-0 lg:pl-64">
                    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
                        <Link
                            href="/campaigns"
                            className="px-4 sm:px-20 pt-4 pb-2 pl-16 lg:pl-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">Back to Campaigns</span>
                            <span className="sm:hidden">Back</span>
                        </Link>
                        <div className="px-4 sm:px-20 pt-2 pb-4 pl-16 lg:pl-4">
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold">{isEditMode ? "Edit Campaign" : "Create Campaign"}</h1>
                                <p className="text-xs sm:text-sm text-muted-foreground">{isEditMode ? "Update campaign details and content" : "Create a new campaign and share content to earn points"}</p>
                            </div>
                        </div>
                    </header>
                    <div className="p-4 sm:p-6">
                        <div className="max-w-4xl mx-auto">
                            <div className="space-y-6">
                                <Card className="bg-card border-border">
                                    <CardHeader>
                                        <CardTitle>Campaign Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div>
                                            <label className={`text-sm font-medium mb-2 block ${errors.name ? "text-destructive" : ""}`}>
                                                Campaign Name
                                            </label>
                                            <Input
                                                name="name"
                                                value={campaign?.name || ""}
                                                onChange={onInputChanged}
                                                className={`bg-secondary ${errors.name ? "border-destructive" : "border-border"}`}
                                                placeholder="Enter campaign name"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium mb-2 block">Logo</label>
                                            <div className="flex items-center gap-4">
                                                {campaign?.logo && (
                                                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-secondary border border-border">
                                                        <img src={campaign.logo} alt="Campaign logo" className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                                <label className="cursor-pointer">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={async (e) => {
                                                            const file = e.target.files?.[0]
                                                            if (file) {
                                                                setIsUploadingLogo(true)
                                                                try {
                                                                    const imageUrl = await uploadImage(file)
                                                                    onInputChanged({ target: { name: "logo", value: imageUrl } } as React.ChangeEvent<HTMLInputElement>)
                                                                    notifications.success("Logo uploaded successfully")
                                                                } catch (error: any) {
                                                                    notifications.error(error?.response?.data?.message || "Failed to upload logo")
                                                                } finally {
                                                                    setIsUploadingLogo(false)
                                                                }
                                                            }
                                                        }}
                                                        className="hidden"
                                                        disabled={isUploadingLogo}
                                                    />
                                                    <Button type="button" variant="outline" asChild disabled={isUploadingLogo}>
                                                        <span>
                                                            {isUploadingLogo ? (
                                                                <>
                                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                                    Uploading...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <ImageIcon className="w-4 h-4 mr-2" />
                                                                    {campaign?.logo ? "Change Logo" : "Upload Logo"}
                                                                </>
                                                            )}
                                                        </span>
                                                    </Button>
                                                </label>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium mb-2 block">Description</label>
                                            <textarea
                                                value={campaign?.description || ""}
                                                onChange={(e) => onInputChanged({ target: { name: "description", value: e.target.value } } as React.ChangeEvent<HTMLInputElement>)}
                                                rows={4}
                                                className="w-full rounded-md border bg-secondary px-3 py-2 text-sm border-border"
                                                placeholder="Brief description of the campaign"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">Web3 Socials</label>
                                                <Select
                                                    value={campaign?.web3_social || ""}
                                                    onValueChange={(value) => setCampaign((prev) => ({
                                                        ...prev,
                                                        web3_social: value,
                                                        website: web3Socials.find((social) => social.value === value)?.url || ""
                                                    }))}
                                                >
                                                    <SelectTrigger className="bg-background border-border">
                                                        {campaign?.web3_social ? (
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-4 h-4 flex items-center justify-center">{web3Socials.find((s) => s.value === campaign?.web3_social)?.icon}</span>
                                                                <SelectValue>{web3Socials.find((s) => s.value === campaign?.web3_social)?.name}</SelectValue>
                                                            </div>
                                                        ) : (
                                                            <SelectValue placeholder="Select a Web3 social" />
                                                        )}
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {web3Socials.map((social) => (
                                                            <SelectItem key={social.name} value={social.value}>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="w-4 h-4 flex items-center justify-center">{social.icon}</span>
                                                                    <span>{social.name}</span>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">Twitter Handle</label>
                                                <Input
                                                    value={`@${isEditMode ? campaign?.twitter || "" : user?.username || ""}`}
                                                    className="bg-secondary border-border"
                                                    placeholder="@username"
                                                    readOnly
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium mb-2 block">About This Campaign</label>
                                            <textarea
                                                value={campaign?.about || ""}
                                                onChange={(e) => onInputChanged({ target: { name: "about", value: e.target.value } } as React.ChangeEvent<HTMLInputElement>)}
                                                rows={6}
                                                className="w-full rounded-md border bg-secondary px-3 py-2 text-sm border-border"
                                                placeholder="Detailed information about the campaign, key talking points, etc."
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium mb-2 block">Content Guidelines</label>
                                            <div className="flex gap-2 mb-2">
                                                <Input
                                                    name="guidelines"
                                                    value={tags.guidelines}
                                                    onChange={(e) => setTags((prev) => ({
                                                        ...prev, guidelines: e.target.value
                                                    }))}
                                                    onKeyPress={(e) => {
                                                        if (e.key === "Enter") {
                                                            e.preventDefault()
                                                            addTag("guidelines")
                                                        }
                                                    }}
                                                    placeholder="Add guideline"
                                                    className="bg-secondary border-border"
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={() => addTag("guidelines")}
                                                    variant="outline"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <div className="space-y-4">
                                                {campaign?.guidelines?.map((guideline, i) => (
                                                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50 border border-border">
                                                        <div className="rounded-lg bg-amethyst flex items-center justify-center text-2xl">
                                                            <CheckCircle2 className="w-5 h-5 text-lime shrink-0 mt-0.5" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-md text-muted-foreground">{guideline}</p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeTag("guidelines", i)}
                                                            className="hover:text-destructive"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">Content Templates</label>
                                            <div className="space-y-2 p-3 sm:p-4 bg-secondary/50 rounded-lg border border-border">
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                                    <select
                                                        name="templateType"
                                                        value={tags?.templates?.type || "Thread"}
                                                        onChange={(e) => setTags((prev) => ({
                                                            ...prev,
                                                            templates: {
                                                                ...prev?.templates,
                                                                type: e.target.value
                                                            }
                                                        }))}
                                                        className="px-3 py-2 rounded-md bg-background border border-border text-foreground text-sm"
                                                    >
                                                        <option>Thread</option>
                                                        <option>Meme</option>
                                                        <option>Infographic</option>
                                                    </select>
                                                    <Input
                                                        name="templateTitle"
                                                        value={tags?.templates?.title || ""}
                                                        onChange={(e) => setTags((prev) => ({
                                                            ...prev,
                                                            templates: {
                                                                ...prev?.templates,
                                                                title: e.target.value
                                                            }
                                                        }))}
                                                        placeholder="Template title"
                                                        className="bg-background border-border text-sm"
                                                    />
                                                    <Button
                                                        type="button"
                                                        onClick={() => addTag("templates")}
                                                        variant="outline"
                                                        className="text-sm"
                                                    >
                                                        Add Template
                                                    </Button>
                                                </div>
                                                <Input
                                                    name="templatePreview"
                                                    value={tags?.templates?.preview || ""}
                                                    onChange={(e) => setTags((prev) => ({
                                                        ...prev,
                                                        templates: {
                                                            ...prev?.templates,
                                                            preview: e.target.value
                                                        }
                                                    }))}
                                                    placeholder="Template preview text"
                                                    className="bg-background border-border text-sm"
                                                />
                                            </div>
                                            <div className="space-y-4 mt-4">
                                                {campaign?.templates?.map((template, i) => (
                                                    <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 border border-border">
                                                        <div className="w-12 h-12 rounded-lg bg-amethyst flex items-center justify-center text-2xl">
                                                            {template.type === "Thread" ? "🧵" : template.type === "Meme" ? "😂" : "📊"}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-xs px-2 py-1 rounded bg-cyan/10 text-cyan">{template.type}</span>
                                                                <span className="font-medium">{template.title}</span>
                                                            </div>
                                                            <p className="text-sm text-muted-foreground">{template.preview}</p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeTag("templates", i)}
                                                            className="hover:text-destructive"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium mb-2 block">Points Breakdown</label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs text-muted-foreground mb-1 block">Quote Weight</label>
                                                    <Input
                                                        name="quote"
                                                        type="text"
                                                        value={campaign?.quote || ""}
                                                        onChange={onInputChanged}
                                                        className="bg-secondary border-border"
                                                        placeholder="6"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-muted-foreground mb-1 block">Comment Weight</label>
                                                    <Input
                                                        name="comment"
                                                        type="text"
                                                        value={campaign?.comment || ""}
                                                        onChange={onInputChanged}
                                                        className="bg-secondary border-border"
                                                        placeholder="5"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-muted-foreground mb-1 block">Repost Weight</label>
                                                    <Input
                                                        name="repost"
                                                        type="text"
                                                        value={campaign?.repost || ""}
                                                        onChange={onInputChanged}
                                                        className="bg-secondary border-border"
                                                        placeholder="4"
                                                    />
                                                </div>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-2">Points = Engagement Weight × Human Score (0-1)</p>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className={`text-sm font-medium mb-2 block ${errors.start_date ? "text-destructive" : ""}`}>
                                                    Start Date
                                                </label>
                                                <div className="relative">
                                                    <Input
                                                        name="start_date"
                                                        type="date"
                                                        value={campaign?.start_date ? (typeof campaign.start_date === 'string' ? campaign.start_date.split('T')[0] : new Date(campaign.start_date).toISOString().split('T')[0]) : ""}
                                                        onChange={onInputChanged}
                                                        className={`bg-secondary pr-10 ${errors.start_date ? "border-destructive" : "border-border"} [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-2 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:invert`}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className={`text-sm font-medium mb-2 block ${errors.end_date ? "text-destructive" : ""}`}>
                                                    End Date
                                                </label>
                                                <div className="relative">
                                                    <Input
                                                        name="end_date"
                                                        type="date"
                                                        value={campaign?.end_date ? (typeof campaign.end_date === 'string' ? campaign.end_date.split('T')[0] : new Date(campaign.end_date).toISOString().split('T')[0]) : ""}
                                                        onChange={onInputChanged}
                                                        className={`bg-secondary pr-10 ${errors.end_date ? "border-destructive" : "border-border"} [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-2 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:invert`}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className={`text-sm font-medium mb-2 block ${errors.hashtags ? "text-destructive" : ""}`}>
                                                Hashtags
                                            </label>
                                            <div className="flex gap-2 mb-2">
                                                <Input
                                                    name="hashtags"
                                                    value={tags?.hashtags || ""}
                                                    onChange={(e) => setTags((prev) => ({
                                                        ...prev,
                                                        hashtags: e.target.value
                                                    }))}
                                                    onKeyPress={(e) => {
                                                        if (e.key === "Enter") {
                                                            e.preventDefault()
                                                            addTag("hashtags")
                                                        }
                                                    }}
                                                    placeholder="Add hashtag"
                                                    className={`bg-secondary ${errors.hashtags ? "border-destructive" : "border-border"}`}
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={() => addTag("hashtags")}
                                                    variant="outline">
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {campaign?.hashtags?.map((tag, i) => (
                                                    <span
                                                        key={i}
                                                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyan/10 text-cyan border border-cyan/20 text-sm"
                                                    >
                                                        #{tag}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeTag("hashtags", i)}
                                                            className="hover:text-destructive"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className={`text-sm font-medium mb-2 block ${errors.tickers ? "text-destructive" : ""}`}>
                                                Tickers
                                            </label>
                                            <div className="flex gap-2 mb-2">
                                                <Input
                                                    name="tickers"
                                                    value={tags?.tickers || ""}
                                                    onChange={(e) => setTags((prev) => ({
                                                        ...prev,
                                                        tickers: e.target.value
                                                    }))}
                                                    onKeyPress={(e) => {
                                                        if (e.key === "Enter") {
                                                            e.preventDefault()
                                                            addTag("tickers")
                                                        }
                                                    }}
                                                    placeholder="Add ticker"
                                                    className={`bg-secondary ${errors.tickers ? "border-destructive" : "border-border"}`}
                                                />
                                                <Button type="button" onClick={() => addTag("tickers")} variant="outline">
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {campaign?.tickers?.map((ticker, i) => (
                                                    <span
                                                        key={i}
                                                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyan/10 text-cyan border border-cyan/20 text-sm"
                                                    >
                                                        {ticker}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeTag("tickers", i)}
                                                            className="hover:text-destructive"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className={`text-sm font-medium mb-2 block ${errors.tickers ? "text-destructive" : ""}`}>
                                                Big Accounts
                                            </label>
                                            <div className="flex gap-2 mb-2">
                                                <Input
                                                    name="big_accounts"
                                                    value={tags?.big_accounts || ""}
                                                    onChange={(e) => setTags((prev) => ({
                                                        ...prev,
                                                        big_accounts: e.target.value
                                                    }))}
                                                    onKeyPress={(e) => {
                                                        if (e.key === "Enter") {
                                                            e.preventDefault()
                                                            addTag("big_accounts")
                                                        }
                                                    }}
                                                    placeholder="Add big account"
                                                    className={`bg-secondary ${errors.big_accounts ? "border-destructive" : "border-border"}`}
                                                />
                                                <Button type="button" onClick={() => addTag("big_accounts")} variant="outline">
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {campaign?.big_accounts?.map((big_account, i) => (
                                                    <span
                                                        key={i}
                                                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyan/10 text-cyan border border-cyan/20 text-sm"
                                                    >
                                                        {big_account}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeTag("big_accounts", i)}
                                                            className="hover:text-destructive"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className={`text-sm font-medium mb-2 block ${errors.pool ? "text-destructive" : ""}`}>
                                                Pool
                                            </label>
                                            <PoolSelector
                                                onPoolSelect={(poolId) => {
                                                    onInputChanged({ target: { name: "pool", value: JSON.stringify({ id: poolId }) } } as React.ChangeEvent<HTMLInputElement>)
                                                    if (errors.pool) {
                                                        setErrors(prev => {
                                                            const newErrors = { ...prev }
                                                            delete newErrors.pool
                                                            return newErrors
                                                        })
                                                    }
                                                }}
                                            />
                                            {errors.pool && (
                                                <p className="text-sm text-destructive mt-1">{errors.pool}</p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                                    <Button variant="outline" onClick={() => router.back()} className="w-full sm:w-auto">
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting || loading}
                                        className="bg-gradient-to-r from-cyan to-lime text-background font-semibold w-full sm:w-auto"
                                    >
                                        {isSubmitting || loading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                {isEditMode ? "Updating..." : "Creating..."}
                                            </>
                                        ) : (
                                            isEditMode ? "Update" : "Create"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </AuthGuard>
    )
}

export default function CreateCampaignPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CreateCampaignContent />
        </Suspense>
    )
}


