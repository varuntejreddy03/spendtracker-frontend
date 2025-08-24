import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import IncomeOverview from '../../components/Income/IncomeOverview';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import Modal from '../../components/Modal';
import AddIncomeForm from '../../components/Income/AddIncomeForm';
import toast from 'react-hot-toast';
import IncomeList from '../../components/Income/IncomeList';
import DeleteAlert from '../../components/DeleteAlert';
import { useUserAuth } from '../../hooks/useUserAuth';

const Income = () => {
    useUserAuth();

    const [incomeData, setIncomeData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });
    const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);

    // Fetch Income Data
    const fetchIncomeDetails = async () => {
        if (loading) return;
        setLoading(true);
        try {
            // THE FIX: Removed the "₹" symbol from the API path
            const response = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME);

            if (response.data) {
                setIncomeData(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch income data:", error);
            toast.error("Could not load income data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Handle Add Income
    const handleAddIncome = async (income) => {
        const { source, amount, date, icon } = income;

        // Validation Checks
        if (!source.trim() || !amount || isNaN(amount) || Number(amount) <= 0 || !date) {
            toast.error("Please fill all fields correctly.");
            return;
        }

        try {
            const response = await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
                source,
                amount: Number(amount),
                date,
                icon,
            });
            setIncomeData([response.data, ...incomeData]); // Add new income to the top of the list
            setOpenAddIncomeModal(false);
            toast.success("Income added successfully");
        } catch (error) {
            console.error("Error while adding income:", error);
            toast.error(error.response?.data?.message || "Failed to add income.");
        }
    };

    // Handle Delete Income
    const deleteIncome = async (id) => {
        try {
            await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
            setIncomeData(incomeData.filter(item => item._id !== id)); // Remove income from the list
            setOpenDeleteAlert({ show: false, data: null });
            toast.success("Income deleted successfully");
        } catch (error) {
            console.error("Error while deleting income:", error);
            toast.error(error.response?.data?.message || "Failed to delete income.");
        }
    };

    // Handle Download Excel
    const handleDownloadIncomeDetails = async () => {
        try {
            const response = await axiosInstance.get(
                API_PATHS.INCOME.DOWNLOAD_INCOME,
                { responseType: "blob" }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "income_details.xlsx");
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error while downloading income details:", error);
            toast.error("Failed to download income details");
        }
    };

    useEffect(() => {
        fetchIncomeDetails();
    }, []);

    return (
        <DashboardLayout activeMenu="Income">
            <div className="my-5 mx-auto">
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <IncomeOverview
                            transactions={incomeData}
                            onAddIncome={() => setOpenAddIncomeModal(true)}
                        />
                    </div>

                    <IncomeList
                        transactions={incomeData}
                        onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
                        onDownload={handleDownloadIncomeDetails}
                        loading={loading}
                    />
                </div>

                <Modal
                    isOpen={openAddIncomeModal}
                    onClose={() => setOpenAddIncomeModal(false)}
                    title="Add Income"
                >
                    <AddIncomeForm onAddIncome={handleAddIncome} />
                </Modal>

                <Modal
                    isOpen={openDeleteAlert.show}
                    onClose={() => setOpenDeleteAlert({ show: false, data: null })}
                    title="Delete Income"
                >
                    <DeleteAlert
                        content="Are you sure you want to delete this income?"
                        onDelete={() => deleteIncome(openDeleteAlert.data)}
                        onClose={() => setOpenDeleteAlert({ show: false, data: null })}
                    />
                </Modal>
            </div>
        </DashboardLayout>
    );
};

export default Income;
