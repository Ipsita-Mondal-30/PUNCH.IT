'use client';

import { CreditCard, Key, Shield, Settings as SettingsIcon } from 'lucide-react';

import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@punch-it/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@punch-it/ui/components/card';
import { Input } from '@punch-it/ui/components/input';
import { Label } from '@punch-it/ui/components/label';
import { Separator } from '@punch-it/ui/components/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@punch-it/ui/components/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@punch-it/ui/components/table';
import { mockEnvVariables } from '@/lib/mock-data';

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your account, environment, and billing preferences."
      />

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="glass border-border/50 w-full justify-start overflow-x-auto">
          <TabsTrigger value="general" className="gap-2">
            <SettingsIcon className="h-3.5 w-3.5" />
            General
          </TabsTrigger>
          <TabsTrigger value="env" className="gap-2">
            <Key className="h-3.5 w-3.5" />
            Environment Variables
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <CreditCard className="h-3.5 w-3.5" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-3.5 w-3.5" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="text-base">General Settings</CardTitle>
              <CardDescription>Update your team and project defaults.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="team-name">Team Name</Label>
                  <Input id="team-name" defaultValue="Acme Corp" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default-region">Default Region</Label>
                  <select
                    id="default-region"
                    className="border-input bg-background flex h-9 w-full rounded-xl border px-3 text-sm"
                    defaultValue="us-east-1"
                  >
                    <option value="us-east-1">US East (N. Virginia)</option>
                    <option value="eu-west-1">EU West (Ireland)</option>
                    <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
                  </select>
                </div>
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="env">
          <Card className="glass border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Environment Variables</CardTitle>
                <CardDescription>Manage secrets across all projects.</CardDescription>
              </div>
              <Button size="sm" variant="neon">
                Add Variable
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Environment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockEnvVariables.map((env) => (
                    <TableRow key={env.id}>
                      <TableCell className="font-mono text-xs">{env.key}</TableCell>
                      <TableCell className="font-mono text-xs">{env.value}</TableCell>
                      <TableCell className="text-xs capitalize">{env.environment}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Billing</CardTitle>
              <CardDescription>Manage your subscription and payment methods.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-primary/30 bg-primary/5 flex items-center justify-between rounded-xl border p-4">
                <div>
                  <p className="font-medium">Pro Plan</p>
                  <p className="text-muted-foreground text-sm">$20/month · Renews Jul 21, 2026</p>
                </div>
                <Button variant="outline" size="sm">
                  Manage Plan
                </Button>
              </div>
              <Separator />
              <div>
                <h4 className="mb-3 text-sm font-medium">Payment Method</h4>
                <div className="border-border/50 flex items-center justify-between rounded-xl border p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted flex h-8 w-12 items-center justify-center rounded-lg text-xs font-bold">
                      VISA
                    </div>
                    <span className="text-sm">•••• •••• •••• 4242</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    Update
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Security</CardTitle>
              <CardDescription>Protect your account and deployments.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Two-Factor Authentication</p>
                  <p className="text-muted-foreground text-xs">Add an extra layer of security</p>
                </div>
                <Button variant="outline" size="sm">
                  Enable 2FA
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">API Keys</p>
                  <p className="text-muted-foreground text-xs">Manage programmatic access tokens</p>
                </div>
                <Button variant="outline" size="sm">
                  Manage Keys
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Audit Log</p>
                  <p className="text-muted-foreground text-xs">View recent account activity</p>
                </div>
                <Button variant="outline" size="sm">
                  View Log
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
