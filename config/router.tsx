import { createBrowserRouter } from "react-router-dom";
import React, { lazy } from "react";
import App from "../App";

const Home = lazy(() => import("@/pages/Home"));
const Login = lazy(() => import("@/pages/(auth)/Login"));
const Register = lazy(() => import("@/pages/(auth)/Register"));
const About = lazy(() => import("@/pages/(marketing)/about"));
const Features = lazy(() => import("@/pages/(marketing)/features"));
const Reports = lazy(() => import("@/pages/(marketing)/reports"));
const Dashboard = lazy(() => import("@/pages/(dashboard)/dashboard"));
const ForgotPassword = lazy(() => import("@/pages/(auth)/ForgotPassword"));
const NotFound = lazy(() => import("../pages/error"));
const Transactions = lazy(() => import("../pages/(dashboard)/(transactions)/transactions"));
const TransactionDetails = lazy(() => import("../pages/(dashboard)/(transactions)/transactionsDetails"));
const TransactionCreate = lazy(() => import("../pages/(dashboard)/(transactions)/transactionsCreate"));
const TransactionEdit = lazy(() => import("../pages/(dashboard)/(transactions)/transactionEdit"));
const Faq = lazy(() => import("../pages/(marketing)/faq"));
const Contact = lazy(() => import("../pages/(marketing)/contact"));
const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            // dashboard pages 
            {
                path: "dashboard",
                element: <Dashboard />,
            },
            {
                path: "transactions",
                element: <Transactions />,
            },
            {
                path: "transactions/new",
                element: <TransactionCreate />,
            },
            {
                path: "transactions/:id",
                element: <TransactionDetails />,
            },
            {
                path: "transactions/:id/edit",
                element: <TransactionEdit />,
            },
            // Auth routes
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "register",
                element: <Register />,
            },
            {
                path: "forgot-password",
                element: <ForgotPassword />,
            },
            // marketing pages 
            {
                path: "about",
                element: <About />
            },
            {
                path: 'features',
                element: <Features />
            },
            {
                path: 'reports',
                element: <Reports />,
            },
            {
                path: 'faq',
                element: <Faq />
            },
            {
                path: 'contact',
                element: <Contact />
            },
            { // error pages
                path: 'error',
                element: <NotFound  />,
            },
            { // 404 (Not Found)
                path: "*",
                element: <NotFound stateProps={404} />,
            },
        ],
    }
]);

export default router;
