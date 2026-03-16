import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import { MemberProtectedRoute } from '@/components/ui/member-protected-route';
import { VerificationGate } from '@/components/ui/verification-gate';
import { PaymentGate } from '@/components/ui/payment-gate';
import HomePage from '@/components/pages/HomePage';
import PetsPage from '@/components/pages/PetsPage';
import PetDetailPage from '@/components/pages/PetDetailPage';
import ContactPage from '@/components/pages/ContactPage';
import ProfilePage from '@/components/pages/ProfilePage';
import AuctionsPage from '@/components/pages/AuctionsPage';
import AuctionDetailPage from '@/components/pages/AuctionDetailPage';
import VerificationPage from '@/components/pages/VerificationPage';
import PaymentDetailsPage from '@/components/pages/PaymentDetailsPage';
import AddPetForAuctionPage from '@/components/pages/AddPetForAuctionPage';

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
        element: (
          <MemberProtectedRoute>
            <VerificationGate messageToVerify="You must complete document verification to browse pets">
              <PaymentGate messageToAddPayment="You must add payment details to browse pets">
                <PetsPage />
              </PaymentGate>
            </VerificationGate>
          </MemberProtectedRoute>
        ),
        routeMetadata: {
          pageIdentifier: 'pets',
        },
      },
      {
        path: "pets/:id",
        element: (
          <MemberProtectedRoute>
            <VerificationGate messageToVerify="You must complete document verification to view pet details">
              <PaymentGate messageToAddPayment="You must add payment details to view pet details">
                <PetDetailPage />
              </PaymentGate>
            </VerificationGate>
          </MemberProtectedRoute>
        ),
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
        element: (
          <MemberProtectedRoute>
            <VerificationGate messageToVerify="You must complete document verification to view auctions">
              <PaymentGate messageToAddPayment="You must add payment details to view auctions">
                <AuctionsPage />
              </PaymentGate>
            </VerificationGate>
          </MemberProtectedRoute>
        ),
        routeMetadata: {
          pageIdentifier: 'auctions',
        },
      },
      {
        path: "auctions/:id",
        element: (
          <MemberProtectedRoute>
            <VerificationGate messageToVerify="You must complete document verification to view auction details">
              <PaymentGate messageToAddPayment="You must add payment details to view auction details">
                <AuctionDetailPage />
              </PaymentGate>
            </VerificationGate>
          </MemberProtectedRoute>
        ),
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
        path: "payment",
        element: (
          <MemberProtectedRoute>
            <VerificationGate messageToVerify="You must complete document verification before adding payment details">
              <PaymentDetailsPage />
            </VerificationGate>
          </MemberProtectedRoute>
        ),
        routeMetadata: {
          pageIdentifier: 'payment',
        },
      },
      {
        path: "add-pet",
        element: (
          <MemberProtectedRoute>
            <VerificationGate messageToVerify="You must complete document verification to add a pet for auction">
              <PaymentGate messageToAddPayment="You must add payment details to add a pet for auction">
                <AddPetForAuctionPage />
              </PaymentGate>
            </VerificationGate>
          </MemberProtectedRoute>
        ),
        routeMetadata: {
          pageIdentifier: 'add-pet',
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
