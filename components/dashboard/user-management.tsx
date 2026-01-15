"use client"

import { memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Shield, Ban, ArrowRight } from "lucide-react"
import Link from "next/link"

export const UserManagement = memo(function UserManagement({ users }: { users: any }) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">User Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-cyan" />
            </div>
            <div>
              <p className="font-medium">Total Users</p>
              <p className="text-sm text-muted-foreground">{`${users?.total.toLocaleString()} promoters`} </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-lime/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-lime" />
            </div>
            <div>
              <p className="font-medium">Active Users</p>
              <p className="text-sm text-muted-foreground">{`${users?.active.toLocaleString()} active`}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <Ban className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="font-medium">Banned Users</p>
              <p className="text-sm text-muted-foreground">{`${users?.banned.toLocaleString()} banned`}</p>
            </div>
          </div>
        </div>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/oversight">
            Manage Users <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
})

