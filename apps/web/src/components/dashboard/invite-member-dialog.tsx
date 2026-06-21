'use client';

import { useState } from 'react';

import { Button } from '@punch-it/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@punch-it/ui/components/dialog';
import { Input } from '@punch-it/ui/components/input';
import { Label } from '@punch-it/ui/components/label';

type InviteMemberDialogProps = {
  trigger?: React.ReactNode;
};

export function InviteMemberDialog({ trigger }: InviteMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? <Button>Invite Member</Button>}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite team member</DialogTitle>
          <DialogDescription>Send an invitation to join your team on PUNCH.IT.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="colleague@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              className="border-input bg-background flex h-9 w-full rounded-xl border px-3 text-sm"
              defaultValue="developer"
            >
              <option value="developer">Developer</option>
              <option value="viewer">Viewer</option>
              <option value="owner">Owner</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Send Invitation</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
