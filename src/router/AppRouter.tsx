import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MembershipGuard from '../components/guards/MembershipGuard';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import ManageCandidatesPage from '../pages/admin/ManageCandidatesPage';
import ManageCategoriesPage from '../pages/admin/ManageCategoriesPage';
import ManageElectionsPage from '../pages/admin/ManageElectionsPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import ElectionDetailPage from '../pages/elections/ElectionDetailPage';
import ElectionResultsPage from '../pages/elections/ElectionResultsPage';
import ElectionsPage from '../pages/elections/ElectionsPage';
import CreateOrganizationPage from '../pages/organization/CreateOrganizationPage';
import MembersPage from '../pages/organization/MembersPage';
import OrganizationPage from '../pages/organization/OrganizationPage';
import VotingPage from '../pages/voting/VotingPage';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />

        {/* Redirect root to dashboard */}
        <Route path='/' element={<Navigate to='/dashboard' replace />} />

        {/* Protected routes - must be logged in */}
        <Route element={<ProtectedRoute />}>
          <Route path='/organization/create-organization' element={<CreateOrganizationPage />} />

          <Route element={<DashboardLayout />}>
            <Route element={<MembershipGuard />}>
              {/* Dashboard */}
              <Route path='/dashboard' element={<DashboardPage />} />

              {/* Elections */}
              <Route path='/elections' element={<ElectionsPage />} />
              <Route path='/elections/:electionId' element={<ElectionDetailPage />} />
              <Route path='/elections/:electionId/results' element={<ElectionResultsPage />} />

              {/* Voting */}
              <Route path='/elections/:electionId/vote' element={<VotingPage />} />

              {/* Organization */}
              <Route path='/organization/:organizationId' element={<OrganizationPage />} />
              <Route element={<ProtectedRoute requiredRoles={[1, 2]} />}>
                <Route path='/organization/members' element={<MembersPage />} />
              </Route>

              {/* Admin only routes */}
              <Route element={<ProtectedRoute requiredRoles={[1, 2]} />}>
                <Route path='/admin/elections' element={<ManageElectionsPage />} />
                <Route
                  path='/admin/elections/:electionId/categories'
                  element={<ManageCategoriesPage />}
                />
                <Route
                  path='/admin/elections/:electionId/categories/:categoryId/candidates'
                  element={<ManageCandidatesPage />}
                />
              </Route>
            </Route>
          </Route>
        </Route>

        {/* Catch all - redirect to dashboard */}
        <Route path='*' element={<Navigate to='/dashboard' replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
