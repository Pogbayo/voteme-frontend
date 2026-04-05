import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useOrganizationMember } from '../../hooks/useOrganizationMember';
import { useOrganization } from '../../hooks/useOrganization';
import { useAuth } from '../../hooks/useAuth';

const MembershipGuard = () => {
  const navigate = useNavigate();

  const { memberShip, getOrganizationMembership, isLoading } = useOrganizationMember();
  const { currentOrganization, userOrganizations } = useOrganization();
  const { user } = useAuth();

  // ✅ Fetch membership when org/user changes
  useEffect(() => {
    if (currentOrganization?.id && user?.userId) {
      getOrganizationMembership(currentOrganization.id, user.userId);
    }
  }, [currentOrganization?.id, user?.userId, getOrganizationMembership]);

  // ✅ Loading OR not yet fetched
  if (isLoading || memberShip === undefined) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-[var(--accent)] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p style={{ color: 'var(--text2)' }}>Checking membership...</p>
        </div>
      </div>
    );
  }

  // ✅ PENDING ONLY
  if (memberShip?.status === 0) {
    const hasOtherOrgs = userOrganizations.length > 1;

    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-6">
        <div 
          className="max-w-md w-full rounded-3xl p-10 text-center border"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <div 
            className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
            style={{ background: 'var(--warning-bg)' }}
          >
            <span className="text-4xl">⏳</span>
          </div>

          <h2 className="text-2xl font-semibold mb-3" style={{ color: 'var(--text)' }}>
            Waiting for Approval
          </h2>
          
          <p className="text-[15px] leading-relaxed mb-8" style={{ color: 'var(--text2)' }}>
            Your request to join{' '}
            <span className="font-medium" style={{ color: 'var(--text)' }}>
              {currentOrganization?.name || 'the organization'}
            </span>{' '}
            is still pending approval by the admin.
          </p>

          <p className="text-sm mb-6" style={{ color: 'var(--text2)' }}>
            You will gain full access once approved.
          </p>

          <button
            onClick={() => {
              if (hasOtherOrgs) {
                navigate('/dashboard');
              } else {
                navigate('/organization/create-organization');
              }
            }}
            className="w-full py-3 rounded-xl font-medium transition-all"
            style={{
              background: 'var(--accent)',
              color: 'white',
            }}
          >
            {hasOtherOrgs ? 'Back to Dashboard' : 'Create Organization'}
          </button>
        </div>
      </div>
    );
  }

  // ✅ APPROVED
  if (memberShip?.status === 1) {
    return <Outlet />;
  }

  // ✅ REMOVED / REJECTED (optional but recommended)
  if (memberShip?.status === 2 || memberShip?.status === 3) {
    navigate('/organization');
    return null;
  }

  // fallback (just in case)
  return null;
};

export default MembershipGuard;