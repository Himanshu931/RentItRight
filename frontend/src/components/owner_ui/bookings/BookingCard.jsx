import React from 'react';
import { Calendar, User, CheckCircle, XCircle } from 'lucide-react';

const BookingCard = ({ booking, onApprove, onReject, onCancel }) => {
  const { item, renter, date, status, id } = booking;
  
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase();
    let bgColor = 'bg-yellow-500/10 text-yellow-500';
    if (statusLower === 'confirmed' || statusLower === 'ongoing' || statusLower === 'completed') bgColor = 'bg-green-500/10 text-green-500';
    if (statusLower === 'rejected' || statusLower === 'cancelled') bgColor = 'bg-red-500/10 text-red-500';
    
    return (
      <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider ${bgColor}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="bg-card border border-divider/20 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-6 hover:border-divider/50 transition-all">
      {/* Item Image */}
      <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
        <img 
          src={item?.image || 'https://via.placeholder.com/200x120?text=No+Image'} 
          alt={item?.title} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Booking Info */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-3">
          {getStatusBadge(status)}
        </div>
        <h3 className="text-xl font-bold text-text-primary tracking-tight">
          {item?.title || 'Unknown Item'}
        </h3>
        
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center gap-2 text-text-secondary">
            <User size={14} className="text-bright" />
            <span>Renter: <span className="text-text-primary font-medium">{booking?.renterInfo?.name || 'Unknown Renter'}</span></span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <Calendar size={14} className="text-bright" />
            <span>Dates: <span className="text-text-primary font-medium">{formatDate(booking?.startDate)} - {formatDate(booking?.endDate)}</span></span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex md:flex-col gap-3 w-full md:w-auto">
        {status?.toLowerCase() === 'pending' && (
          <>
            <button 
              onClick={() => onApprove(id)}
              className="flex-1 md:w-32 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 rounded-xl text-sm transition-all active:scale-95 cursor-pointer"
            >
              <CheckCircle size={16} />
              Approve
            </button>
            <button 
              onClick={() => onReject(id)}
              className="flex-1 md:w-32 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl text-sm transition-all active:scale-95 cursor-pointer"
            >
              <XCircle size={16} />
              Reject
            </button>
          </>
        )}
        {(status?.toLowerCase() === 'confirmed' || status?.toLowerCase() === 'ongoing') && (
           <div className="text-green-500 flex items-center gap-1 font-bold text-sm px-4">
              <CheckCircle size={16} /> Confirmed
           </div>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
