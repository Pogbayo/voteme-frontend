import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useOrganizationMember } from '../../hooks/useOrganizationMember';
import { useOrganization } from '../../hooks/useOrganization';
import { useAuth } from '../../hooks/useAuth';

const MembershipGuard = () => {
  const navigate = useNavigate();
  const { memberShip, getOrganizationMembership, isLoading, error, clearError } = useOrganizationMember();
  const { currentOrganization, userOrganizations } = useOrganization();
  const { user } = useAuth();

  useEffect(() => {
    if (!currentOrganization?.id || !user?.userId) {
      return;
    }

    getOrganizationMembership(currentOrganization.id, user.userId).catch(() => {});
  }, [currentOrganization?.id, user?.userId, getOrganizationMembership]);

  if (!currentOrganization) {
    return (
      <div className='rounded-[16px] border p-6' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <h2 className='text-[18px] font-medium mb-2' style={{ color: 'var(--text)' }}>
          No organization selected
        </h2>
        <p className='text-[13px]' style={{ color: 'var(--text2)' }}>
          Pick an organization from the sidebar to continue.
        </p>
      </div>
    );
  }

  if (isLoading && !memberShip) {
    return (
      <div className='rounded-[16px] border p-8 flex items-center justify-center' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className='text-center'>
          <div className='animate-spin w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full mx-auto mb-4'></div>
          <p style={{ color: 'var(--text2)' }}>Checking membership...</p>
        </div>
      </div>
    );
  }

  if (error && !memberShip) {
    return (
      <div className='rounded-[16px] border p-6' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <h2 className='text-[18px] font-medium mb-2' style={{ color: 'var(--text)' }}>
          We could not verify your membership yet
        </h2>
        <p className='text-[13px] mb-4' style={{ color: 'var(--text2)' }}>
          {error}
        </p>
        <button
          onClick={() => {
            clearError();
            if (currentOrganization?.id && user?.userId) {
              getOrganizationMembership(currentOrganization.id, user.userId).catch(() => {});
            }
          }}
          className='px-4 py-2 rounded-[8px] text-[13px] font-medium text-white'
          style={{ background: 'var(--accent)' }}
        >
          Try again
        </button>
      </div>
    );
  }

  if (memberShip?.status === 1) {
    return <Outlet />;
  }

  const hasOtherOrgs = userOrganizations.length > 1;
  const isPending = memberShip?.status === 0;
  const isRemovedOrRejected = memberShip?.status === 2 || memberShip?.status === 3;

  if (isPending || isRemovedOrRejected) {
    return (
      <div className='rounded-[16px] border p-6 md:p-8' style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div
          className='w-14 h-14 rounded-[14px] flex items-center justify-center mb-5'
          style={{ background: isPending ? 'var(--warning-bg)' : 'var(--danger-bg)' }}
        >
          <span className='text-[28px]'>{isPending ? '...' : '!'}</span>
        </div>

        <h2 className='text-[20px] font-medium mb-2' style={{ color: 'var(--text)' }}>
          {isPending ? 'Waiting for approval' : 'Access unavailable'}
        </h2>

        <p className='text-[14px] leading-relaxed mb-5' style={{ color: 'var(--text2)' }}>
          {isPending
            ? `Your membership in ${currentOrganization.name} is still pending admin approval.`
            : `Your membership in ${currentOrganization.name} is no longer approved, so dashboard content is hidden for this organization.`}
        </p>

        <div className='flex flex-wrap gap-3'>
          {hasOtherOrgs && (
            <button
              onClick={() => navigate('/dashboard')}
              className='px-4 py-2 rounded-[8px] text-[13px] font-medium border'
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              Switch organization in sidebar
            </button>
          )}

          {!hasOtherOrgs && (
            <button
              onClick={() => navigate('/organization/create-organization')}
              className='px-4 py-2 rounded-[8px] text-[13px] font-medium text-white'
              style={{ background: 'var(--accent)' }}
            >
              Create organization
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default MembershipGuard;
