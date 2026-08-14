import AuthLayout from "../../components/auth/AuthLayout";
import { AlertTriangle, Mail } from "lucide-react";

const Suspended = ({ switchMode, onClose }) => {
  return (
    <AuthLayout>
      <div className="p-8 pb-6 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle size={32} />
        </div>

        <h1 className="text-text-primary text-2xl font-bold tracking-tight mb-2">
          Account Suspended
        </h1>
        <p className="text-text-secondary/70 text-sm mb-6 leading-relaxed">
          Your account has been suspended due to a violation of our terms of service or suspicious activity. You cannot login at this time.
        </p>

        <div className="bg-app border border-border-color rounded-2xl p-5 w-full text-left mb-8">
          <h3 className="text-sm font-semibold text-text-primary mb-2">
            What can you do?
          </h3>
          <p className="text-xs text-text-secondary/70 mb-4">
            If you believe this is a mistake or you need more information, please contact our support team.
          </p>
          <a
            href="mailto:rentit.buis@gmail.com"
            className="flex items-center gap-2 text-sm font-medium text-bright hover:underline"
          >
            <Mail size={16} />
            rentit.buis@gmail.com
          </a>
        </div>

        <button
          onClick={() => switchMode("login")}
          className="w-full bg-surface hover:bg-surface/80 text-text-primary font-bold py-3.5 rounded-2xl transition-all shadow-sm active:scale-[0.98]"
        >
          Back to Login
        </button>
      </div>
    </AuthLayout>
  );
};

export default Suspended;
