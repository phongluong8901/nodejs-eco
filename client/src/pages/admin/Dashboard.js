import React, { useEffect, useState } from 'react'
import { apiGetOrders, apiGetUsers } from '../../apis'
import { formatMoney } from '../../ultils/helpers'
import { AiOutlineUsergroupAdd, AiOutlineShoppingCart, AiOutlineDollarCircle, AiOutlineArrowUp } from 'react-icons/ai'
import { Bar } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler)

const Dashboard = () => {
    const [counts, setCounts] = useState({ users: 0, orders: 0, revenue: 0 })

    const fetchData = async () => {
        const [responseOrder, responseUser] = await Promise.all([
            apiGetOrders({ limit: 999 }),
            apiGetUsers({ limit: 999 })
        ])
        if (responseOrder.success && responseUser.success) {
            const totalRevenue = responseOrder.orders?.reduce((sum, el) => sum + el.total, 0)
            setCounts({
                users: responseUser.counts,
                orders: responseOrder.counts,
                revenue: totalRevenue
            })
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Revenue (VND)',
                data: [15, 22, 18, 35, 42, 38, 50, 62, 55, 75, 80, 95].map(v => v * 1000000), // Demo data
                backgroundColor: 'rgba(238, 49, 49, 0.8)',
                hoverBackgroundColor: '#ee3131',
                borderRadius: 6,
                borderSkipped: false,
            },
        ],
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1f2937',
                padding: 12,
                cornerRadius: 8,
                titleFont: { size: 14 },
                bodyFont: { size: 13 },
                callbacks: {
                    label: (context) => ` ${formatMoney(context.raw)} VND`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { drawBorder: false, color: '#f3f4f6' },
                ticks: { font: { size: 11 }, color: '#9ca3af' }
            },
            x: {
                grid: { display: false },
                ticks: { font: { size: 11 }, color: '#9ca3af' }
            }
        }
    }

    return (
        <div className='w-full min-h-screen bg-gray-50 p-6 flex flex-col gap-8 font-sans'>
            {/* Header hiện đại */}
            <div className='flex justify-between items-center'>
                <div>
                    <h1 className='text-3xl font-extrabold text-gray-800 tracking-tight'>Dashboard</h1>
                    <p className='text-sm text-gray-500 mt-1'>Chào mừng trở lại, đây là tình hình kinh doanh hôm nay.</p>
                </div>
                <button 
                    onClick={() => fetchData()}
                    className='px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-all text-sm font-medium'
                >
                    Làm mới dữ liệu
                </button>
            </div>

            {/* Thẻ thống kê (Cards Container) */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                {/* Card 1 */}
                <div className='group bg-white p-1 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300'>
                    <div className='bg-white p-6 rounded-2xl border border-gray-100 flex flex-col gap-4'>
                        <div className='flex justify-between items-start'>
                            <div className='p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:scale-110 transition-transform'>
                                <AiOutlineUsergroupAdd size={28} />
                            </div>
                            <span className='flex items-center gap-1 text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-full'>
                                <AiOutlineArrowUp /> 12%
                            </span>
                        </div>
                        <div>
                            <p className='text-sm font-medium text-gray-500'>Tổng khách hàng</p>
                            <h3 className='text-3xl font-bold text-gray-800 mt-1'>{counts.users.toLocaleString()}</h3>
                        </div>
                    </div>
                </div>

                {/* Card 2 */}
                <div className='group bg-white p-1 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300'>
                    <div className='bg-white p-6 rounded-2xl border border-gray-100 flex flex-col gap-4'>
                        <div className='flex justify-between items-start'>
                            <div className='p-3 bg-green-50 rounded-xl text-green-600 group-hover:scale-110 transition-transform'>
                                <AiOutlineShoppingCart size={28} />
                            </div>
                            <span className='flex items-center gap-1 text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-full'>
                                <AiOutlineArrowUp /> 8.5%
                            </span>
                        </div>
                        <div>
                            <p className='text-sm font-medium text-gray-500'>Đơn hàng hoàn tất</p>
                            <h3 className='text-3xl font-bold text-gray-800 mt-1'>{counts.orders.toLocaleString()}</h3>
                        </div>
                    </div>
                </div>

                {/* Card 3 */}
                <div className='group bg-main p-1 rounded-2xl shadow-lg hover:shadow-main/30 transition-all duration-300'>
                    <div className='bg-white p-6 rounded-2xl flex flex-col gap-4 h-full'>
                        <div className='flex justify-between items-start'>
                            <div className='p-3 bg-red-50 rounded-xl text-main group-hover:scale-110 transition-transform'>
                                <AiOutlineDollarCircle size={28} />
                            </div>
                            <div className='h-2 w-16 bg-main/10 rounded-full overflow-hidden'>
                                <div className='h-full bg-main w-[70%]'></div>
                            </div>
                        </div>
                        <div>
                            <p className='text-sm font-medium text-gray-500'>Tổng doanh thu</p>
                            <h3 className='text-3xl font-bold text-main mt-1'>{formatMoney(counts.revenue)} <span className='text-sm font-normal text-gray-400'>VND</span></h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8'>
                {/* Main Revenue Chart */}
                <div className='lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm'>
                    <div className='flex justify-between items-center mb-8'>
                        <h3 className='text-lg font-bold text-gray-800 uppercase tracking-wider'>Thống kê tăng trưởng</h3>
                        <select className='text-sm border-none bg-gray-100 rounded-md p-1 outline-none'>
                            <option>Năm 2026</option>
                            <option>Năm 2025</option>
                        </select>
                    </div>
                    <div className='h-[350px] w-full'>
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                </div>

                {/* Side Info / Quick Tasks */}
                <div className='bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6'>
                    <h3 className='text-lg font-bold text-gray-800 uppercase tracking-wider'>Báo cáo nhanh</h3>
                    <div className='flex flex-col gap-4'>
                        {[
                            { label: 'Tỉ lệ chuyển đổi', value: '64%', color: 'bg-blue-500' },
                            { label: 'Tỉ lệ hủy đơn', value: '2.4%', color: 'bg-red-500' },
                            { label: 'Khách quay lại', value: '45%', color: 'bg-green-500' }
                        ].map((item, idx) => (
                            <div key={idx} className='flex flex-col gap-2'>
                                <div className='flex justify-between text-sm font-medium'>
                                    <span>{item.label}</span>
                                    <span>{item.value}</span>
                                </div>
                                <div className='w-full bg-gray-100 h-2 rounded-full'>
                                    <div className={`${item.color} h-full rounded-full`} style={{ width: item.value }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='mt-auto p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300'>
                        <p className='text-xs text-gray-500 text-center uppercase font-bold tracking-tighter'>Mục tiêu tháng này</p>
                        <p className='text-xl text-center font-black text-gray-700 mt-1 italic'>1.5 Tỷ VND</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard