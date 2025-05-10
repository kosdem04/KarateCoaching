import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import MainPage from "./components/MainPage/MainPage.jsx";
import LoginForm from "./components/LoginForm/LoginForm.jsx";
import SignUp from "./components/SignUp/SignUp.jsx";
import MySportsmenPage from "./components/MySportsmenPage/MySportsmenPage.jsx";
import ProtectedAuthRoute from "./components/ProtectedAuthRoute.jsx";
import SportsmanInfo from "./components/SportsmanInfo/SportsmanInfo.jsx";
import TournamentsList from "./components/TournamentsList/TournamentsList.jsx";
import TournamentAddForm from "./components/TournamentAddForm/TournamentAddForm.jsx";
import AddResultForm from "./components/AddResultForm/AddResultForm.jsx";
import AddSportsmanForm from "./components/AddSportsmanForm/AddSportsmanForm.jsx";
import EditSportsmanForm from "./components/EditSportsmanForm/EditSportsmanForm.jsx";
import ResultList from "./components/ResultList/ResultList.jsx";
import EditResultForm from "./components/EditResultForm/EditResultForm.jsx";
import EditTournamentForm from "./components/EditTournamentForm/EditTournamentForm.jsx";

function App() {
    return (
        <Router>
            <div className="page-container">
                <Header />
                <main className="content">
                    <Routes>
                        <Route path="/" element={<MainPage />} />
                        <Route path="/login/" element={<LoginForm />} />
                        <Route path="/sign_up/" element={<SignUp />} />
                        <Route
                            path="/my_sportsmen/"
                            element={
                                <ProtectedAuthRoute>
                                    <MySportsmenPage />
                                </ProtectedAuthRoute>
                            }
                        />
                        <Route
                            path="/my_sportsmen/:id"
                            element={
                                <ProtectedAuthRoute>
                                    <SportsmanInfo />
                                </ProtectedAuthRoute>
                            }
                        />
                        <Route
                            path="/my_sportsmen/:id/edit"
                            element={
                                <ProtectedAuthRoute>
                                    <EditSportsmanForm />
                                </ProtectedAuthRoute>
                            }
                        />
                        <Route
                            path="/my_sportsmen/add"
                            element={
                                <ProtectedAuthRoute>
                                    <AddSportsmanForm />
                                </ProtectedAuthRoute>
                            }
                        />
                        <Route
                            path="/my_tournaments/"
                            element={
                                <ProtectedAuthRoute>
                                    <TournamentsList />
                                </ProtectedAuthRoute>
                            }
                        />
                        <Route
                            path="/my_tournaments/:id/edit"
                            element={
                                <ProtectedAuthRoute>
                                    <EditTournamentForm />
                                </ProtectedAuthRoute>
                            }
                        />
                        <Route
                            path="/my_tournaments/add"
                            element={
                                <ProtectedAuthRoute>
                                    <TournamentAddForm />
                                </ProtectedAuthRoute>
                            }
                        />
                        <Route
                            path="/my_results/add"
                            element={
                                <ProtectedAuthRoute>
                                    <AddResultForm />
                                </ProtectedAuthRoute>
                            }
                        />
                        <Route
                            path="/my_results/"
                            element={
                                <ProtectedAuthRoute>
                                    <ResultList />
                                </ProtectedAuthRoute>
                            }
                        />
                        <Route
                            path="/my_results/:id/edit"
                            element={
                                <ProtectedAuthRoute>
                                    <EditResultForm />
                                </ProtectedAuthRoute>
                            }
                        />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
