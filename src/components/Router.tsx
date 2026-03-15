import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import { MemberProtectedRoute } from '@/components/ui/member-protected-route';
import HomePage from '@/components/pages/HomePage';
import PetsPage from '@/components/pages/PetsPage';
import PetDetailPage from '@/components/pages/PetDetailPage';
import ContactPage from '@/components/pages/ContactPage';
import ProfilePage from '@/components/pages/ProfilePage';
import AuctionsPage from '@/components/pages/AuctionsPage';
import AuctionDetailPage from '@/components/pages/AuctionDetailPage';
import VerificationPage from '@/components/pages/VerificationPage';

// Layout component that includes ScrollToTop
function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
        routeMetadata: {
          pageIdentifier: 'home',
        },
      },
      {
        path: "pets",
        element: <PetsPage />,
        routeMetadata: {
          pageIdentifier: 'pets',
        },
      },
      {
        path: "pets/:id",
        element: <PetDetailPage />,
        routeMetadata: {
          pageIdentifier: 'pet-detail',
        },
      },
      {
        path: "contact",
        element: <ContactPage />,
        routeMetadata: {
          pageIdentifier: 'contact',
        },
      },
      {
        path: "profile",
        element: (
          <MemberProtectedRoute>
            <ProfilePage />
          </MemberProtectedRoute>
        ),
        routeMetadata: {
          pageIdentifier: 'profile',
        },
      },
      {
        path: "auctions",
        element: <AuctionsPage />,
        routeMetadata: {
          pageIdentifier: 'auctions',
        },
      },
      {
        path: "auctions/:id",
        element: <AuctionDetailPage />,
        routeMetadata: {
          pageIdentifier: 'auction-detail',
        },
      },
      {
        path: "verify",
        element: (
          <MemberProtectedRoute>
            <VerificationPage />
          </MemberProtectedRoute>
        ),
        routeMetadata: {
          pageIdentifier: 'verification',
        },
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
