import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/lib/error-boundary";
import { setupGlobalErrorHandling } from "@/lib/global-error-handler";
import { setupPromiseInterceptor } from "@/lib/promise-interceptor";
import { useMobile } from "@/hooks/use-mobile";

// Setup global error handling and promise interception on app initialization
setupGlobalErrorHandling();
setupPromiseInterceptor();

// ✅ TODAS AS PÁGINAS - Carregamento imediato (SEM LAZY LOADING)
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Splash from "@/pages/splash";
import Discover from "@/pages/discover";
import Profile from "@/pages/profile";
import Matches from "@/pages/matches";
import Messages from "@/pages/messages";
import Chat from "@/pages/chat";
import Location from "@/pages/location";
import OnboardingFlow from "@/pages/onboarding-flow";
import Welcome1 from "@/pages/welcome-1";
import Welcome2 from "@/pages/welcome-2";
import Welcome3 from "@/pages/welcome-3";
import Welcome4 from "@/pages/welcome-4";
import Welcome5 from "@/pages/welcome-5";
import Welcome6 from "@/pages/welcome-6";
import Terms from "@/pages/terms";
import CreateProfile from "@/pages/create-profile";
import UploadPhotos from "@/pages/upload-photos";
import Premium from "@/pages/premium";
import LikesReceived from "@/pages/likes-received";
import SuperLikes from "@/pages/super-likes";
import BoostProfile from "@/pages/boost-profile";
import NearbyUsers from "@/pages/nearby-users";
import Notifications from "@/pages/notifications";
import PaymentSuccess from "@/pages/payment-success";
import Subscribe from "@/pages/subscribe";
import SubscriptionManagement from "@/pages/subscription-management";
import SubscriptionPlans from "@/pages/subscription-plans";
import MatchesGrid from "@/pages/matches-grid";
import ProfileDetail from "@/pages/profile-detail";
import ForgotPassword from "@/pages/forgot-password";
import PhoneAuth from "@/pages/phone-auth";
import ResetPassword from "@/pages/reset-password";
import Help from "@/pages/help";
import Likes from "@/pages/likes";
import Views from "@/pages/views";
import Subscription from "@/pages/subscription";
import Plans from "@/pages/plans";
import EditProfile from "@/pages/edit-profile";
import EditProfileNew from "@/pages/edit-profile-new";
import Settings from "@/pages/settings";
import Verification from "@/pages/verification";
import VerificationStatus from "@/pages/verification-status";
import SessionDebug from "@/pages/session-debug";
import SeuMix from "@/pages/seu-mix";
import NotFound from "@/pages/not-found";
import Games from "@/pages/games";
import Favorites from "@/pages/favorites";
import SafetyTools from "@/pages/safety-tools";
import Security from "@/pages/security";
import Support from "@/pages/support";
import Download from "@/pages/download";
import Product from "@/pages/product";
import Checkout from "@/pages/checkout";
import PremiumSettings from "@/pages/premium-settings";
import Swipe from "@/pages/Swipe";
import Payment from "@/pages/payment";
import SwipeLimit from "@/pages/swipe-limit";
import MatchProfile from "@/pages/match-profile";
import MatchCelebration from "@/pages/match-celebration";

// Admin pages
import AdminLogin from "@/pages/admin/admin-login";
import AdminDashboard from "@/pages/admin/admin-dashboard";
import AdminUsersNew from "@/pages/admin/admin-users-new";
import AdminUserEdit from "@/pages/admin/admin-user-edit";
import AdminMatchesNew from "@/pages/admin/admin-matches-new";
import AdminMatchEdit from "@/pages/admin/admin-match-edit";
import AdminMessagesNew from "@/pages/admin/admin-messages-new";
import AdminMessageEdit from "@/pages/admin/admin-message-edit";
import AdminSubscriptionsNew from "@/pages/admin/admin-subscriptions-new";
import AdminSubscriptionPlans from "@/pages/admin/admin-subscription-plans";
import AdminPayments from "@/pages/admin/admin-payments";
import AdminReportsNew from "@/pages/admin/admin-reports-new";
import AdminVerifications from "@/pages/admin/admin-verifications";
import AdminNotifications from "@/pages/admin/admin-notifications";
import AdminAnalytics from "@/pages/admin/admin-analytics";
import AdminSettingsNew from "@/pages/admin/admin-settings-new";
import AdminAppConfig from "@/pages/admin/admin-app-config";
import OAuthConfig from "@/pages/admin/oauth-config";

// Admin Detail Pages
import AdminUserDetail from "@/pages/admin/admin-user-detail";
import AdminMatchDetail from "@/pages/admin/admin-match-detail";
import AdminMessageDetail from "@/pages/admin/admin-message-detail";
import AdminSubscriptionDetail from "@/pages/admin/admin-subscription-detail";
import AdminPaymentDetail from "@/pages/admin/admin-payment-detail";
import AdminVerificationDetail from "@/pages/admin/admin-verification-detail";
import AdminNotificationDetail from "@/pages/admin/admin-notification-detail";
import AdminReportDetail from "@/pages/admin/admin-report-detail";

import AuthStatus from "@/pages/auth-status";
import OAuthDebug from "@/pages/oauth-debug";

// Onboarding pages (OLD - will be removed)
import WelcomeRules from "@/pages/onboarding/welcome-rules";
import OnboardingName from "@/pages/onboarding/name";
import OnboardingBirthday from "@/pages/onboarding/birthday";
import OnboardingGender from "@/pages/onboarding/gender";
import OnboardingOrientation from "@/pages/onboarding/orientation";
import OnboardingShowMe from "@/pages/onboarding/show-me";
import OnboardingLookingFor from "@/pages/onboarding/looking-for";
import OnboardingDistance from "@/pages/onboarding/distance";
import OnboardingPersonality from "@/pages/onboarding/personality";
import OnboardingInterests from "@/pages/onboarding/interests";
import OnboardingPhotos from "@/pages/onboarding/photos";
import OnboardingSuccess from "@/pages/onboarding/success";
import Tutorial from "@/pages/tutorial";

function Router() {
  const isMobile = useMobile();

  return (
    <Switch>
      <Route path="/" component={Splash} />
      
      {/* Mobile-only routes - apenas rotas específicas para mobile */}
      {isMobile && (
        <>
          <Route path="/upload-photos" component={CreateProfile} />
          <Route path="/premium" component={Premium} />
          <Route path="/likes-received" component={LikesReceived} />
          <Route path="/super-likes" component={SuperLikes} />
          <Route path="/boost-profile" component={BoostProfile} />
          <Route path="/nearby" component={NearbyUsers} />
          <Route path="/swipe-limit" component={SwipeLimit} />
          <Route path="/payment" component={Payment} />
          <Route path="/subscribe" component={Subscribe} />
          <Route path="/subscription-management" component={SubscriptionManagement} />
          <Route path="/subscription-plans" component={SubscriptionPlans} />
          <Route path="/games" component={Games} />
          <Route path="/favorites" component={Favorites} />
          <Route path="/safety-tools" component={SafetyTools} />
          <Route path="/support" component={Support} />
          <Route path="/download" component={Download} />
          <Route path="/product" component={Product} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/premium-settings" component={PremiumSettings} />
        </>
      )}
      
      {/* Universal routes - disponíveis para mobile e desktop */}
      <Route path="/welcome-1" component={Welcome1} />
      <Route path="/welcome-2" component={Welcome2} />
      <Route path="/welcome-3" component={Welcome3} />
      <Route path="/welcome-4" component={Welcome4} />
      <Route path="/welcome-5" component={Welcome5} />
      <Route path="/welcome-6" component={Welcome6} />
      <Route path="/terms" component={Terms} />
      {/* <Route path="/user-type" component={UserTypeSelection} /> */}
      <Route path="/phone-auth" component={PhoneAuth} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/auth-status" component={AuthStatus} />
      <Route path="/oauth-debug" component={OAuthDebug} />
      
      {/* Onboarding Flow - Universal */}
      <Route path="/onboarding-flow" component={OnboardingFlow} />
      <Route path="/onboarding/welcome" component={WelcomeRules} />
      <Route path="/onboarding/name" component={OnboardingName} />
      <Route path="/onboarding/birthday" component={OnboardingBirthday} />
      <Route path="/onboarding/gender" component={OnboardingGender} />
      <Route path="/onboarding/orientation" component={OnboardingOrientation} />
      <Route path="/onboarding/show-me" component={OnboardingShowMe} />
      <Route path="/onboarding/looking-for" component={OnboardingLookingFor} />
      <Route path="/onboarding/distance" component={OnboardingDistance} />
      <Route path="/onboarding/personality" component={OnboardingPersonality} />
      <Route path="/onboarding/interests" component={OnboardingInterests} />
      <Route path="/onboarding/photos" component={OnboardingPhotos} />
      <Route path="/onboarding/success" component={OnboardingSuccess} />
      <Route path="/tutorial" component={Tutorial} />
      
      <Route path="/create-profile" component={CreateProfile} />
      <Route path="/location" component={Location} />
      <Route path="/discover" component={Discover} />
      <Route path="/swipe" component={Swipe} />
      <Route path="/matches" component={Matches} />
      <Route path="/match-profile/:id" component={MatchProfile} />
      <Route path="/match-celebration/:matchId" component={MatchCelebration} />
      <Route path="/messages" component={Messages} />
      <Route path="/profile" component={Profile} />
      <Route path="/profile/:profileId" component={ProfileDetail} />
      <Route path="/settings" component={Settings} />
      <Route path="/subscription" component={Subscription} />
      <Route path="/verification" component={Verification} />
      <Route path="/verification-status" component={VerificationStatus} />
      <Route path="/session-debug" component={SessionDebug} />
      <Route path="/notifications" component={Notifications} />
      <Route path="/security" component={Security} />
      <Route path="/help" component={Help} />
      <Route path="/chat/:matchId" component={Chat} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/seu-mix" component={SeuMix} />
      <Route path="/edit-profile" component={EditProfile} />
      <Route path="/edit-profile-new" component={EditProfileNew} />
      <Route path="/likes" component={Likes} />
      <Route path="/views" component={Views} />
      <Route path="/plans" component={Plans} />
      <Route path="/payment-success" component={PaymentSuccess} />
      <Route path="/message/:matchId" component={Chat} />
      
      {/* Admin routes - disponíveis universalmente */}
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/users" component={AdminUsersNew} />
      <Route path="/admin/matches" component={AdminMatchesNew} />
      <Route path="/admin/messages" component={AdminMessagesNew} />
      <Route path="/admin/subscriptions" component={AdminSubscriptionsNew} />
      <Route path="/admin/subscription-plans" component={AdminSubscriptionPlans} />
      <Route path="/admin/reports" component={AdminReportsNew} />
      <Route path="/admin/analytics" component={AdminAnalytics} />
      <Route path="/admin/settings" component={AdminSettingsNew} />
      <Route path="/admin/app-config" component={AdminAppConfig} />
      <Route path="/admin/oauth-config" component={OAuthConfig} />
      <Route path="/admin/payments" component={AdminPayments} />
      <Route path="/admin/verifications" component={AdminVerifications} />
      <Route path="/admin/notifications" component={AdminNotifications} />
      
      {/* Admin Detail Pages */}
      <Route path="/admin/user-details/:id" component={AdminUserDetail} />
      <Route path="/admin/users/:id" component={AdminUserDetail} />
      <Route path="/admin/users/:id/edit" component={AdminUserEdit} />
      <Route path="/admin/user-edit/:id" component={AdminUserEdit} />
      <Route path="/admin/matches/:id" component={AdminMatchDetail} />
      <Route path="/admin/matches/:id/edit" component={AdminMatchEdit} />
      <Route path="/admin/messages/:id" component={AdminMessageDetail} />
      <Route path="/admin/messages/:id/edit" component={AdminMessageEdit} />
      <Route path="/admin/subscription-details/:id" component={AdminSubscriptionDetail} />
      <Route path="/admin/subscriptions/:id" component={AdminSubscriptionDetail} />
      <Route path="/admin/payments/:id" component={AdminPaymentDetail} />
      <Route path="/admin/verifications/:id" component={AdminVerificationDetail} />
      <Route path="/admin/notifications/:id" component={AdminNotificationDetail} />
      <Route path="/admin/reports/:id" component={AdminReportDetail} />
      
      {/* Development Status - Removed */}
      
      {/* Redirect /user-type to /login */}
      <Route path="/user-type">
        {() => {
          window.location.href = '/login';
          return null;
        }}
      </Route>
      
      {/* Desktop routes - páginas extras para desktop */}
      {!isMobile && (
        <>
          <Route path="/premium" component={Premium} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/swipe-limit" component={SwipeLimit} />
        </>
      )}
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <Router />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;