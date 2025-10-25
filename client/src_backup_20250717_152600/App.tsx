import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

import { useMobile } from "@/hooks/use-mobile";
import Welcome from "@/pages/welcome";
import Terms from "@/pages/terms";
import UserTypeSelection from "@/pages/user-type-selection";
import Login from "@/pages/login";
import Register from "@/pages/register";
import CadastreSe from "@/pages/cadastre-se";
import CreateProfile from "@/pages/create-profile";
import Location from "@/pages/location";
import Landing from "@/pages/landing";
import Discover from "@/pages/discover";
import Matches from "@/pages/matches";
import MatchesGrid from "@/pages/matches-grid";
import Messages from "@/pages/messages";
import Chat from "@/pages/chat";
import Profile from "@/pages/profile";
import ProfileDetail from "@/pages/profile-detail";
import ForgotPassword from "@/pages/forgot-password";
import ResetPassword from "@/pages/reset-password";
import Help from "@/pages/help";
import Likes from "@/pages/likes";
import Views from "@/pages/views";
import Subscription from "@/pages/subscription";
import Plans from "@/pages/plans";
import EditProfile from "@/pages/edit-profile";
import SeuMix from "@/pages/seu-mix";
import NotFound from "@/pages/not-found";

function Router() {
  const isMobile = useMobile();

  return (
    <Switch>
      <Route path="/" component={() => isMobile ? <Welcome /> : <Landing />} />
      <Route path="/welcome" component={Welcome} />
      <Route path="/terms" component={Terms} />
      <Route path="/user-type" component={UserTypeSelection} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/cadastre-se" component={CadastreSe} />
      <Route path="/create-profile" component={CreateProfile} />
      <Route path="/location" component={Location} />
      <Route path="/discover" component={Discover} />
      <Route path="/matches" component={Matches} />
      <Route path="/matches-grid" component={MatchesGrid} />
      <Route path="/messages" component={Messages} />
      <Route path="/chat/:matchId" component={Chat} />
      <Route path="/profile" component={Profile} />
      <Route path="/profile/:profileId" component={ProfileDetail} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/help" component={Help} />
      <Route path="/likes" component={Likes} />
      <Route path="/views" component={Views} />
      <Route path="/subscription" component={Subscription} />
      <Route path="/plans" component={Plans} />
      <Route path="/edit-profile" component={EditProfile} />
      <Route path="/seu-mix" component={SeuMix} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router />
    </QueryClientProvider>
  );
}

export default App;
