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

const WalletDashboard = () => {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [topupAmount, setTopupAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchWalletData();
        // Dynamically load Razorpay script
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
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

    const handleTopup = async (e) => {
        e.preventDefault();
        const amount = Number(topupAmount);
        if (!topupAmount || isNaN(amount) || amount <= 0) {
            toast.error("Enter a valid amount");
            return;
        }

        if (amount > 100000) {
            toast.error("Maximum top-up is ₹1,00,000");
            return;
        }

        if (!window.Razorpay) {
            toast.error("Razorpay SDK failed to load. Are you online?");
            return;
        }

        setIsSubmitting(true);
        try {
            const csrfToken = await getCsrfToken();

            // 1. Create order on backend
            const orderRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/wallet/create-razorpay-order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-Token": csrfToken
                },
                body: JSON.stringify({ amount }),
                credentials: "include"
            });
            const orderData = await orderRes.json();

            if (!orderData.success) {
                throw new Error(orderData.message || "Failed to create order");
            }

            // 2. Initialize Razorpay Checkout
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || "placeholder", // Enter the Key ID generated from the Dashboard
                amount: orderData.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                currency: "INR",
                name: "RentItRight",
                description: "Wallet Top-up",
                order_id: orderData.orderId, // This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                handler: async function (response) {
                    try {
                        toast.loading("Verifying payment...", { id: "verify-toast" });
                        
                        // 3. Verify payment on backend
                        const verifyRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/wallet/verify-razorpay-payment`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "X-CSRF-Token": csrfToken
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                amount: amount
                            }),
                            credentials: "include"
                        });
                        
                        const verifyData = await verifyRes.json();

                        if (verifyData.success) {
                            toast.success(`Successfully added ₹${amount} to your wallet!`, { id: "verify-toast" });
                            setTopupAmount('');
                            fetchWalletData();
                        } else {
                            toast.error(verifyData.message || "Payment verification failed", { id: "verify-toast" });
                        }
                    } catch (err) {
                        toast.error("Error verifying payment", { id: "verify-toast" });
                    }
                },
                theme: {
                    color: "#FACC15" // rentitright bright color
                }
            };
            
            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response){
                toast.error(response.error.description || "Payment failed");
            });
            rzp1.open();
            
        } catch (error) {
            toast.error(error.message || "Network error. Please try again.");
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

    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-extrabold text-text-primary mb-8 tracking-tight">My Wallet</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Side: Balance & Topup */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gradient-to-br from-bright to-accent rounded-3xl p-8 text-background-dark shadow-2xl relative overflow-hidden">
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10"></div>
                        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-black opacity-10"></div>
                        
                        <div className="relative z-10">
                            <p className="text-sm font-semibold opacity-90 mb-2 tracking-wide uppercase">Available Balance</p>
                            <h3 className="text-5xl font-black mb-1">₹{balance.toLocaleString()}</h3>
                            <p className="text-xs opacity-75 mt-2">Use your wallet for instant, fee-free checkouts.</p>
                        </div>
                    </div>

                    <div className="bg-surface border border-divider rounded-3xl p-6 shadow-sm">
                        <h4 className="text-lg font-bold text-text-primary mb-4">Add Funds</h4>
                        <form onSubmit={handleTopup} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-text-secondary mb-1">Amount (₹)</label>
                                <input 
                                    type="number" 
                                    value={topupAmount}
                                    onChange={(e) => setTopupAmount(e.target.value)}
                                    placeholder="e.g. 5000" 
                                    className="w-full bg-app border border-divider rounded-xl px-4 py-3 text-text-primary outline-none focus:border-bright transition-colors"
                                    min="1"
                                    max="100000"
                                    required
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className={`w-full py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all ${isSubmitting ? 'bg-divider text-text-secondary cursor-not-allowed' : 'bg-bright text-background-dark hover:shadow-[0_0_20px_rgba(var(--color-bright),0.4)] hover:scale-[1.02]'}`}
                            >
                                {isSubmitting ? 'Processing...' : 'Top Up Wallet'}
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
                                Recent Transactions
                            </h3>
                        </div>
                        
                        {transactions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-text-secondary">
                                <span className="material-symbols-outlined text-6xl opacity-20 mb-4">receipt_long</span>
                                <p className="font-medium">No transactions found.</p>
                                <p className="text-sm opacity-60">Your wallet history will appear here.</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                {transactions.map(tx => {
                                    const isPositive = tx.amount > 0;
                                    const icon = tx.type === 'topup' ? 'account_balance_wallet' : tx.type === 'refund' ? 'undo' : 'shopping_bag';
                                    
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

export default WalletDashboard;
