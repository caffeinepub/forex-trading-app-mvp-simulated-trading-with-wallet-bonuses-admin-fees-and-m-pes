import { useState } from 'react';
import { useGetAllDepositRequests, useApproveDeposit, useRejectDeposit } from '../../hooks/useWallet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Check, X } from 'lucide-react';

export default function DepositRequestsReview() {
  const { data: requests = [] } = useGetAllDepositRequests();
  const approveMutation = useApproveDeposit();
  const rejectMutation = useRejectDeposit();
  
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [adminNote, setAdminNote] = useState('');

  const pendingRequests = requests.filter(r => Object.keys(r.status)[0] === 'pending');

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1000000).toLocaleString();
  };

  const parseMpesaDetails = (mpesaRef: string | undefined) => {
    if (!mpesaRef) return null;
    try {
      return JSON.parse(mpesaRef);
    } catch {
      return { reference: mpesaRef };
    }
  };

  const handleApprove = () => {
    if (selectedRequest) {
      approveMutation.mutate(
        { requestId: selectedRequest.requestId, adminNote: adminNote || null },
        { onSuccess: () => setSelectedRequest(null) }
      );
    }
  };

  const handleReject = () => {
    if (selectedRequest) {
      rejectMutation.mutate(
        { requestId: selectedRequest.requestId, adminNote: adminNote || null },
        { onSuccess: () => setSelectedRequest(null) }
      );
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Pending Deposit Requests</CardTitle>
          <CardDescription>Review and approve or reject deposit requests</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No pending deposit requests.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>M-Pesa Details</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingRequests.map((request) => {
                  const mpesaDetails = parseMpesaDetails(request.mpesaReference);
                  return (
                    <TableRow key={request.requestId.toString()}>
                      <TableCell className="font-mono text-xs">
                        {request.user.toString().slice(0, 8)}...
                      </TableCell>
                      <TableCell className="font-medium">${request.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        {mpesaDetails ? (
                          <div className="text-sm">
                            <div>Phone: {mpesaDetails.phone || 'N/A'}</div>
                            <div className="text-muted-foreground">Ref: {mpesaDetails.reference || 'N/A'}</div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(request.timestamp)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => {
                              setSelectedRequest(request);
                              setAdminNote('');
                            }}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setSelectedRequest(request);
                              setAdminNote('');
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Deposit Request</DialogTitle>
            <DialogDescription>
              Amount: ${selectedRequest?.amount.toFixed(2)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-note">Admin Note (Optional)</Label>
              <Input
                id="admin-note"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Add a note..."
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleApprove}
                disabled={approveMutation.isPending}
                className="flex-1"
              >
                Approve
              </Button>
              <Button
                onClick={handleReject}
                disabled={rejectMutation.isPending}
                variant="destructive"
                className="flex-1"
              >
                Reject
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
