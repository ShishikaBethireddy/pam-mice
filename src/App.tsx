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
import AttendeeList from "./pages/planning/AttendeeList.tsx";
import RoomBooking from "./pages/planning/RoomBooking.tsx";
import FoodBeverage from "./pages/planning/FoodBeverage.tsx";
import Spaces from "./pages/planning/Spaces.tsx";
import Decor from "./pages/planning/Decor.tsx";
import Agenda from "./pages/planning/Agenda.tsx";
import BillingOverview from "./pages/planning/BillingOverview.tsx";
import BillingDocuments from "./pages/planning/BillingDocuments.tsx";
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
            <Route index element={<Navigate to="attendees" replace />} />
            <Route path="attendees" element={<AttendeeList />} />
            <Route path="rooms" element={<RoomBooking />} />
            <Route path="fnb" element={<FoodBeverage />} />
            <Route path="spaces" element={<Spaces />} />
            <Route path="decor" element={<Decor />} />
            <Route path="agenda" element={<Agenda />} />
            <Route path="billing">
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<BillingOverview />} />
              <Route path="documents" element={<BillingDocuments />} />
            </Route>
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
