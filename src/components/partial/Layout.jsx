import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import PasswordChangeModal from "../modal/PasswordChangeModal";
import ErrorModal from "../modal/ErrorModal";
import { COLORS } from "@/constants/colors";


export default function Layout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleErrorSubmit = (data) => {
        setErrorMessage(data)
        setShowErrorModal(true)
    }

    return (
        <div className="min-h-screen bg-gray-950">
            <Sidebar isOpen={isSidebarOpen} />
            <Header 
                onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}/>
            
            <main 
                className="transition-all duration-300 pt-20 px-4 sm:px-6 lg:px-4 py-8"
                style={{ marginLeft: isSidebarOpen ? '16rem' : '0' , backgroundColor:COLORS.bg}}
            >
                <Outlet context={{handleErrorSubmit}}/> {/* 여기에 자식 페이지가 렌더링됨 */}
            </main>

            {/* 모달들 */}
            <ErrorModal
                isOpen={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                errorMessage={errorMessage}
            />
        </div>
    )
}