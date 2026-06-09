import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { EventPlanningProvider } from "@/lib/eventPlanning";
import Index from "./pages/Index.tsx";
import ProposalBuilder from "./pages/ProposalBuilder.tsx";
import Integrations from "./pages/Integrations.tsx";
import Landing from "./pages/Landing.tsx";
import NobuCorporate from "./pages/NobuCorporate.tsx";
import PlanWithAllie from "./pages/PlanWithAllie.tsx";
import EventPlanning from "./pages/EventPlanning.tsx";
import SocialOverview from "./pages/planning/SocialOverview.tsx";
import Guests from "./pages/planning/Guests.tsx";
import RoomAllocation from "./pages/planning/RoomAllocation.tsx";
import FoodBeverage from "./pages/planning/FoodBeverage.tsx";
import Spaces from "./pages/planning/Spaces.tsx";
import Vendors from "./pages/planning/Vendors.tsx";
import Itinerary from "./pages/planning/Itinerary.tsx";
import Payments from "./pages/planning/Payments.tsx";
import Login from "./pages/Login.tsx";
import Account from "./pages/Account.tsx";
import RfpRequest from "./pages/RfpRequest.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/book" element={<NobuCorporate />} />
          <Route path="/plan" element={<PlanWithAllie />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
          <Route path="/account/rfp/:id" element={<RfpRequest />} />
          <Route path="/inbox" element={<Index />} />
          <Route path="/event-planning" element={<EventPlanning />} />
          <Route
            path="/servicing/:id"
            element={
              <EventPlanningProvider>
                <Outlet />
              </EventPlanningProvider>
            }
          >
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<SocialOverview />} />
            <Route path="guests" element={<Guests />} />
            <Route path="rooms" element={<RoomAllocation />} />
            <Route path="fnb" element={<FoodBeverage />} />
            <Route path="spaces" element={<Spaces />} />
            <Route path="vendors" element={<Vendors />} />
            <Route path="itinerary" element={<Itinerary />} />
            <Route path="payments" element={<Payments />} />
            {/* Legacy paths → nearest social step */}
            <Route path="attendees" element={<Navigate to="../guests" replace />} />
            <Route path="decor" element={<Navigate to="../vendors" replace />} />
            <Route path="agenda" element={<Navigate to="../itinerary" replace />} />
            <Route path="billing/*" element={<Navigate to="../payments" replace />} />
          </Route>
          <Route path="/rfp/:id" element={<ProposalBuilder />} />
          <Route path="/integrations" element={<Integrations />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
