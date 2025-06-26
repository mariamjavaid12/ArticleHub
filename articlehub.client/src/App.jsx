import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
import PrivateRoute from './auth/PrivateRoute';
import AuthorDashboard from './Pages/Author/AuthorDashboard';
import EditorDashboard from './Pages/Editor/EditorDashboard';
import DashboardLayout from './layout/DashboardLayout';
import { SnackbarProvider } from './Context/SnackbarContext ';

import CreateArticle from './Pages/Author/CreateArticle';
import MyArticles from './Pages/Author/MyArticles';
import ViewVersions from './Pages/Author/ViewVersions';
import ViewArticle from './Pages/Author/ViewArticle';
import EditArticle from './Pages/Author/EditArticle';

import AllArticles from './Pages/Editor/AllArticles';
import PendingReview from './Pages/Editor/PendingReview ';
import ReviewArticle from './Pages/Editor/ReviewArticle';
import ReviewedByMe from './Pages/Editor/ReviewedByMe';
import { useTranslation } from 'react-i18next';

const App = () => {
    const { i18n } = useTranslation();
    useEffect(() => {
        document.body.setAttribute('dir', i18n.language === 'ur' ? 'rtl' : 'ltr');
    }, [i18n.language]);
    return (
        <SnackbarProvider>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
                path="/author"
                element={
                    <PrivateRoute roles={['Author']}>
                        <DashboardLayout>
                            <AuthorDashboard />
                        </DashboardLayout>
                    </PrivateRoute>
                }
            />
            <Route
            path="/author/new-article"
            element={
                <PrivateRoute roles={['Author']}>
                    <DashboardLayout>
                        <CreateArticle />
                    </DashboardLayout>
                </PrivateRoute>
            }
                />
            <Route
                path="/author/articles"
                element={
                    <PrivateRoute roles={['Author']}>
                        <DashboardLayout>
                            <MyArticles />
                        </DashboardLayout>
                    </PrivateRoute>
                }
                />
                <Route
                    path="/articles/:articleId/versions"
                    element={
                        <PrivateRoute roles={['Author', 'Editor']}>
                            <DashboardLayout>
                                <ViewVersions />
                            </DashboardLayout>
                        </PrivateRoute>
                    }
                />
               
                <Route
                    path="/articles/:articleId/version/:language/:versionNumber"
                    element={
                        <PrivateRoute roles={['Author', 'Editor']}>
                            <DashboardLayout>
                                <ViewArticle />
                            </DashboardLayout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/author/articles/:id/edit"
                    element={
                        <PrivateRoute roles={['Author']}>
                            <DashboardLayout>
                                <EditArticle />
                            </DashboardLayout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/editor"
                    element={
                        <PrivateRoute roles={['Editor']}>
                            <DashboardLayout>
                                <EditorDashboard />
                            </DashboardLayout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/editor/articles"
                    element={
                        <PrivateRoute roles={['Editor']}>
                            <DashboardLayout>
                                <AllArticles />
                            </DashboardLayout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/editor/pending"
                    element={
                        <PrivateRoute roles={['Editor']}>
                            <DashboardLayout>
                                <PendingReview />
                            </DashboardLayout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/editor/review/article/:articleId/version/:versionNumber"
                    element={
                        <PrivateRoute roles={['Editor']}>
                            <DashboardLayout>
                                <ReviewArticle />
                            </DashboardLayout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/editor/reviewed-by-me"
                    element={
                        <PrivateRoute roles={['Editor']}>
                            <DashboardLayout>
                                <ReviewedByMe />
                            </DashboardLayout>
                        </PrivateRoute>
                    }
                />
            <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
        </SnackbarProvider>
    );
};

export default App;