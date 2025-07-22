'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { ConfirmationDialog } from './ui/ConfirmationDialog';
import { SkeletonText } from './ui/Skeleton';
import { SettingsIcon, TrashIcon } from './ui/Icons';
import { ApiService, CleanupStatus, CleanupResult } from '@/lib/api';
import { useToast } from './ui/ToastProvider';

interface AdminPanelProps {
  userUuid: string;
}

export const AdminPanel = ({ userUuid }: AdminPanelProps) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [status, setStatus] = useState<CleanupStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [showRunDialog, setShowRunDialog] = useState(false);
  const { showError, showSuccess } = useToast();

  const checkAdminStatus = async () => {
    try {
      const response = await ApiService.verifyAdmin(userUuid);
      setIsAdmin(response.is_admin);
      return response.is_admin;
    } catch (error) {
      setIsAdmin(false);
      return false;
    }
  };

  const fetchStatus = async () => {
    if (!isAdmin) return;
    
    try {
      setLoading(true);
      const response = await ApiService.getCleanupStatus(userUuid);
      setStatus(response);
    } catch (error) {
      showError('Status Load Failed', 'Unable to load admin status.');
    } finally {
      setLoading(false);
    }
  };

  const runCleanup = async () => {
    try {
      setRunning(true);
      setShowRunDialog(false);
      const result: CleanupResult = await ApiService.runCleanup(userUuid);
      
      if (result.users_deleted > 0) {
        showSuccess(
          'Cleanup Complete', 
          `${result.users_deleted} inactive users have been deleted.`
        );
      } else {
        showSuccess('Cleanup Complete', 'No inactive users to delete.');
      }
      
      await fetchStatus();
    } catch (error) {
      showError('Cleanup Failed', 'Unable to run user cleanup.');
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    const initAdmin = async () => {
      const adminStatus = await checkAdminStatus();
      if (adminStatus) {
        fetchStatus();
      } else {
        setLoading(false);
      }
    };
    
    if (userUuid) {
      initAdmin();
    }
  }, [userUuid]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'None';
    return new Date(dateString).toLocaleString('en-US');
  };

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <Card className="animate-native-fade-in">
        <CardHeader>
          <div className="flex items-center gap-2">
            <SettingsIcon size="lg" color="var(--color-system-orange)" />
            <h2 className="text-lg font-semibold" style={{ color: 'var(--color-label-primary)' }}>
              Admin Panel
            </h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <SkeletonText lines={4} />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!status) {
    return null;
  }

  return (
    <>
      <Card className="animate-native-fade-in">
        <CardHeader>
          <div className="flex items-center gap-2">
            <SettingsIcon size="lg" color="var(--color-system-orange)" />
            <h2 className="text-lg font-semibold" style={{ color: 'var(--color-label-primary)' }}>
              Admin Panel
            </h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span style={{ color: 'var(--color-label-secondary)' }}>Total Users:</span>
                <span className="ml-2 font-medium" style={{ color: 'var(--color-label-primary)' }}>
                  {status.total_users.toLocaleString()}
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--color-label-secondary)' }}>Eligible for Cleanup:</span>
                <span className="ml-2 font-medium" style={{ color: 'var(--color-label-primary)' }}>
                  {status.users_eligible_for_cleanup.toLocaleString()}
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--color-label-secondary)' }}>Inactive Threshold:</span>
                <span className="ml-2 font-medium" style={{ color: 'var(--color-label-primary)' }}>
                  {status.inactive_threshold_days} days
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--color-label-secondary)' }}>Last Cleanup:</span>
                <span className="ml-2 font-medium" style={{ color: 'var(--color-label-primary)' }}>
                  {formatDate(status.last_cleanup_at)}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t" style={{ borderColor: 'var(--color-separator)' }}>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowRunDialog(true)}
                loading={running}
                disabled={running || status.users_eligible_for_cleanup === 0}
                interactive={true}
                className="w-full"
              >
                {!running && <TrashIcon size="sm" />}
                {running ? 'Running Cleanup...' : 'Run Inactive User Cleanup'}
              </Button>
              
              {status.users_eligible_for_cleanup === 0 && (
                <p className="text-xs mt-2 text-center" style={{ color: 'var(--color-label-tertiary)' }}>
                  No inactive users to clean up
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={showRunDialog}
        onClose={() => setShowRunDialog(false)}
        onConfirm={runCleanup}
        title="Run Inactive User Cleanup"
        message={`This will delete ${status.users_eligible_for_cleanup} inactive users and all their related data. This action cannot be undone.`}
        confirmText="Run Cleanup"
        cancelText="Cancel"
        dangerous={true}
        loading={running}
      />
    </>
  );
};