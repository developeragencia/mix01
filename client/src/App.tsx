import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/lib/error-boundary";
import { setupGlobalErrorHandling } from "@/lib/global-error-handler";
import { setupPromiseInterceptor } from "@/lib/promise-interceptor";
import { lazy, Suspense } from "react";

// Setup global error handling and promise interception on app initialization
setupGlobalErrorHandling();
setupPromiseInterceptor();

// Remove unhandled rejection handler to prevent console errors in production
import { useMobile } from "@/hooks/use-mobile";

// ⚡ PÁGINAS CRÍTICAS (carregamento imediato) - Sem lazy loading
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

// ⚡ LAZY LOADING - Páginas carregadas sob demanda
const Welcome1 = lazy(() => import("@/pages/welcome-1"));
const Welcome2 = lazy(() => import("@/pages/welcome-2"));
const Welcome3 = lazy(() => import("@/pages/welcome-3"));
const Welcome4 = lazy(() => import("@/pages/welcome-4"));
const Welcome5 = lazy(() => import("@/pages/welcome-5"));
const Welcome6 = lazy(() => import("@/pages/welcome-6"));
const Terms = lazy(() => import("@/pages/terms"));
const CreateProfile = lazy(() => import("@/pages/create-profile"));
const UploadPhotos = lazy(() => import("@/pages/upload-photos"));
const Premium = lazy(() => import("@/pages/premium"));
const LikesReceived = lazy(() => import("@/pages/likes-received"));
const SuperLikes = lazy(() => import("@/pages/super-likes"));
const BoostProfile = lazy(() => import("@/pages/boost-profile"));
const NearbyUsers = lazy(() => import("@/pages/nearby-users"));
const Notifications = lazy(() => import("@/pages/notifications"));
const PaymentSuccess = lazy(() => import("@/pages/payment-success"));
const Subscribe = lazy(() => import("@/pages/subscribe"));
const SubscriptionManagement = lazy(() => import("@/pages/subscription-management"));
const SubscriptionPlans = lazy(() => import("@/pages/subscription-plans"));
const MatchesGrid = lazy(() => import("@/pages/matches-grid"));
const ProfileDetail = lazy(() => import("@/pages/profile-detail"));
const ForgotPassword = lazy(() => import("@/pages/forgot-password"));
const PhoneAuth = lazy(() => import("@/pages/phone-auth"));
const ResetPassword = lazy(() => import("@/pages/reset-password"));
const Help = lazy(() => import("@/pages/help"));
const Likes = lazy(() => import("@/pages/likes"));
const Views = lazy(() => import("@/pages/views"));
const Subscription = lazy(() => import("@/pages/subscription"));
const Plans = lazy(() => import("@/pages/plans"));
const EditProfile = lazy(() => import("@/pages/edit-profile"));
const EditProfileNew = lazy(() => import("@/pages/edit-profile-new"));
const Settings = lazy(() => import("@/pages/settings"));
const Verification = lazy(() => import("@/pages/verification"));
const VerificationStatus = lazy(() => import("@/pages/verification-status"));
const SessionDebug = lazy(() => import("@/pages/session-debug"));
const SeuMix = lazy(() => import("@/pages/seu-mix"));
const NotFound = lazy(() => import("@/pages/not-found"));
const Games = lazy(() => import("@/pages/games"));
const Favorites = lazy(() => import("@/pages/favorites"));
const SafetyTools = lazy(() => import("@/pages/safety-tools"));
const Security = lazy(() => import("@/pages/security"));
const Support = lazy(() => import("@/pages/support"));
const Download = lazy(() => import("@/pages/download"));
const Product = lazy(() => import("@/pages/product"));
const Checkout = lazy(() => import("@/pages/checkout"));
const PremiumSettings = lazy(() => import("@/pages/premium-settings"));
const Swipe = lazy(() => import("@/pages/Swipe"));
const Payment = lazy(() => import("@/pages/payment"));
const SwipeLimit = lazy(() => import("@/pages/swipe-limit"));
const MatchProfile = lazy(() => import("@/pages/match-profile"));
const MatchCelebration = lazy(() => import("@/pages/match-celebration"));

// ⚡ LAZY LOADING - Admin pages
const AdminLogin = lazy(() => import("@/pages/admin/admin-login"));
const AdminDashboard = lazy(() => import("@/pages/admin/admin-dashboard"));
const AdminUsersNew = lazy(() => import("@/pages/admin/admin-users-new"));
const AdminUserEdit = lazy(() => import("@/pages/admin/admin-user-edit"));
const AdminMatchesNew = lazy(() => import("@/pages/admin/admin-matches-new"));
const AdminMatchEdit = lazy(() => import("@/pages/admin/admin-match-edit"));
const AdminMessagesNew = lazy(() => import("@/pages/admin/admin-messages-new"));
const AdminMessageEdit = lazy(() => import("@/pages/admin/admin-message-edit"));
const AdminSubscriptionsNew = lazy(() => import("@/pages/admin/admin-subscriptions-new"));
const AdminSubscriptionPlans = lazy(() => import("@/pages/admin/admin-subscription-plans"));
const AdminPayments = lazy(() => import("@/pages/admin/admin-payments"));
const AdminReportsNew = lazy(() => import("@/pages/admin/admin-reports-new"));
const AdminVerifications = lazy(() => import("@/pages/admin/admin-verifications"));
const AdminNotifications = lazy(() => import("@/pages/admin/admin-notifications"));
const AdminAnalytics = lazy(() => import("@/pages/admin/admin-analytics"));
const AdminSettingsNew = lazy(() => import("@/pages/admin/admin-settings-new"));
const AdminAppConfig = lazy(() => import("@/pages/admin/admin-app-config"));
const OAuthConfig = lazy(() => import("@/pages/admin/oauth-config"));

// ⚡ LAZY LOADING - Admin Detail Pages
const AdminUserDetail = lazy(() => import("@/pages/admin/admin-user-detail"));
const AdminMatchDetail = lazy(() => import("@/pages/admin/admin-match-detail"));
const AdminMessageDetail = lazy(() => import("@/pages/admin/admin-message-detail"));
const AdminSubscriptionDetail = lazy(() => import("@/pages/admin/admin-subscription-detail"));
const AdminPaymentDetail = lazy(() => import("@/pages/admin/admin-payment-detail"));
const AdminVerificationDetail = lazy(() => import("@/pages/admin/admin-verification-detail"));
const AdminNotificationDetail = lazy(() => import("@/pages/admin/admin-notification-detail"));
const AdminReportDetail = lazy(() => import("@/pages/admin/admin-report-detail"));

const AuthStatus = lazy(() => import("@/pages/auth-status"));
const OAuthDebug = lazy(() => import("@/pages/oauth-debug"));

// Onboarding Flow já importado acima (sem lazy)

// Onboarding pages (OLD - will be removed) - LAZY LOADED
const WelcomeRules = lazy(() => import("@/pages/onboarding/welcome-rules"));
const OnboardingName = lazy(() => import("@/pages/onboarding/name"));
const OnboardingBirthday = lazy(() => import("@/pages/onboarding/birthday"));
const OnboardingGender = lazy(() => import("@/pages/onboarding/gender"));
const OnboardingOrientation = lazy(() => import("@/pages/onboarding/orientation"));
const OnboardingShowMe = lazy(() => import("@/pages/onboarding/show-me"));
const OnboardingLookingFor = lazy(() => import("@/pages/onboarding/looking-for"));
const OnboardingDistance = lazy(() => import("@/pages/onboarding/distance"));
const OnboardingPersonality = lazy(() => import("@/pages/onboarding/personality"));
const OnboardingInterests = lazy(() => import("@/pages/onboarding/interests"));
const OnboardingPhotos = lazy(() => import("@/pages/onboarding/photos"));
const OnboardingSuccess = lazy(() => import("@/pages/onboarding/success"));
const Tutorial = lazy(() => import("@/pages/tutorial"));

// ⚡ Loading component - Minimalista e rápido
const PageLoader = () => (
  <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center z-50">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
      <span className="text-white/80 text-sm">Carregando...</span>
    </div>
  </div>
);

function Router() {
  const isMobile = useMobile();

  return (
    <Suspense fallback={<PageLoader />}>
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
    </Suspense>
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