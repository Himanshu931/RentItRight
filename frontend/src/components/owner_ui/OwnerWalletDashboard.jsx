import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

// Helper to fetch CSRF token — same pattern used throughout the app
const getCsrfToken = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/csrf-token`, {
        method: "GET",
        credentials: "include"
    });
    const data = await res.json();
    return data.csrfToken;
};

const OwnerWalletDashboard = () => {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchWalletData();
    }, []);

    const fetchWalletData = async () => {
        try {
            const csrfToken = await getCsrfToken();

            const [balanceRes, txRes] = await Promise.all([
                fetch(`${import.meta.env.VITE_BACKEND_URL}/wallet/balance`, {
                    method: "GET",
                    headers: { "X-CSRF-Token": csrfToken },
                    credentials: "include"
                }),
                fetch(`${import.meta.env.VITE_BACKEND_URL}/wallet/transactions`, {
                    method: "GET",
                    headers: { "X-CSRF-Token": csrfToken },
                    credentials: "include"
                })
            ]);

            const balanceData = await balanceRes.json();
            const txData = await txRes.json();

            setBalance(balanceData.balance || 0);
            setTransactions(txData.data || []);
        } catch (error) {
            console.error("Error fetching wallet data:", error);
            toast.error("Failed to load wallet data");
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async (e) => {
        e.preventDefault();
        const amount = Number(withdrawAmount);
        if (!withdrawAmount || isNaN(amount) || amount <= 0) {
            toast.error("Enter a valid amount");
            return;
        }

        if (amount > balance) {
            toast.error("Insufficient wallet balance");
            return;
        }

        setIsSubmitting(true);
        try {
            const csrfToken = await getCsrfToken();
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/wallet/withdraw`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-Token": csrfToken
                },
                body: JSON.stringify({ amount }),
                credentials: "include"
            });
            const data = await res.json();

            if (data.success) {
                toast.success(`Successfully withdrew ₹${amount}!`);
                setWithdrawAmount('');
                fetchWalletData();
            } else {
                toast.error(data.message || "Withdrawal failed");
            }
        } catch (error) {
            toast.error("Network error. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-bright border-t-transparent"></div>
            </div>
        );
    }

    // Compute quick stats from transactions
    const totalEarnings = transactions
        .filter(tx => tx.amount > 0)
        .reduce((sum, tx) => sum + tx.amount, 0);

    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-extrabold text-text-primary mb-8 tracking-tight">My Earnings</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Side: Balance & Stats */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Balance Card */}
                    <div className="bg-gradient-to-br from-bright to-accent rounded-3xl p-8 text-background-dark shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10"></div>
                        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-black opacity-10"></div>
                        
                        <div className="relative z-10">
                            <p className="text-sm font-semibold opacity-90 mb-2 tracking-wide uppercase">Available Balance</p>
                            <h3 className="text-5xl font-black mb-1">₹{balance.toLocaleString()}</h3>
                            <p className="text-xs opacity-75 mt-2">Earnings from rentals are deposited here automatically.</p>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-surface border border-divider rounded-3xl p-6 shadow-sm space-y-4">
                        <h4 className="text-lg font-bold text-text-primary">Quick Stats</h4>
                        <div className="flex justify-between items-center py-2 border-b border-divider/50">
                            <span className="text-sm text-text-secondary">Total Earnings</span>
                            <span className="font-bold text-emerald-400">₹{totalEarnings.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-text-secondary">Transactions</span>
                            <span className="font-bold text-text-primary">{transactions.length}</span>
                        </div>
                    </div>

                    {/* Withdraw Funds */}
                    <div className="bg-surface border border-divider rounded-3xl p-6 shadow-sm">
                        <h4 className="text-lg font-bold text-text-primary mb-4">Withdraw Earnings</h4>
                        <form onSubmit={handleWithdraw} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-text-secondary mb-1">Amount (₹)</label>
                                <input 
                                    type="number" 
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                    placeholder="e.g. 1000" 
                                    className="w-full bg-app border border-divider rounded-xl px-4 py-3 text-text-primary outline-none focus:border-bright transition-colors"
                                    min="1"
                                    required
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={isSubmitting || balance <= 0}
                                className={`w-full py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all ${isSubmitting || balance <= 0 ? 'bg-divider text-text-secondary cursor-not-allowed' : 'bg-bright text-background-dark hover:shadow-[0_0_20px_rgba(var(--color-bright),0.4)] hover:scale-[1.02]'}`}
                            >
                                {isSubmitting ? 'Processing...' : 'Withdraw to Bank'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Side: Transactions History */}
                <div className="lg:col-span-2">
                    <div className="bg-surface border border-divider rounded-3xl p-6 md:p-8 h-full shadow-sm">
                        <div className="flex justify-between items-center mb-6 border-b border-divider pb-4">
                            <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                                <span className="material-symbols-outlined text-bright">history</span>
                                Transaction History
                            </h3>
                        </div>
                        
                        {transactions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-text-secondary">
                                <span className="material-symbols-outlined text-6xl opacity-20 mb-4">receipt_long</span>
                                <p className="font-medium">No earnings yet.</p>
                                <p className="text-sm opacity-60">When renters pay for your listings, earnings will show up here.</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                {transactions.map(tx => {
                                    const isPositive = tx.amount > 0;
                                    const icon = tx.type === 'withdrawal' ? 'money_off' : isPositive ? 'trending_up' : 'trending_down';
                                    
                                    return (
                                        <div key={tx._id} className="flex justify-between items-center p-4 bg-app/50 border border-divider/50 rounded-2xl hover:border-bright/30 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                                    <span className="material-symbols-outlined">{icon}</span>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-text-primary text-sm md:text-base">{tx.description}</p>
                                                    <p className="text-xs text-text-secondary mt-0.5">
                                                        {new Date(tx.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} • {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`font-black text-lg ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                {isPositive ? '+' : '-'}₹{Math.abs(tx.amount).toLocaleString()}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default OwnerWalletDashboard;
