import React from "react";

export function PageHeader({ title, description, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-text-primary">
          {title}
        </h1>
        {description && (
          <p className="text-text-secondary text-sm mt-1">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

export function Button({
  children,
  icon,
  primary = false,
  danger = false,
  warning = false,
  ...props
}) {
  const base =
    "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer";

  let variant = "bg-white/5 border border-divider text-text-secondary hover:text-text-primary hover:bg-white/10";
  if (primary) variant = "bg-bright text-app hover:bg-bright/90";
  if (danger) variant = "bg-error/10 text-error border border-error/20 hover:bg-error/20";
  if (warning) variant = "bg-warning/10 text-warning border border-warning/20 hover:bg-warning/20";

  return (
    <button className={`${base} ${variant}`} {...props}>
      {icon && (
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
      )}
      {children}
    </button>
  );
}

export function StatCard({ label, value, note, noteType = "muted", icon }) {
  const noteColors = {
    muted: "text-text-muted",
    success: "text-success",
    danger: "text-error",
    warning: "text-warning",
  };

  return (
    <div className="bg-surface border border-divider rounded-2xl p-6 hover:border-bright/40 transition-all group">
      <p className="text-text-secondary text-xs tracking-wider uppercase font-medium mb-2">
        {label}
      </p>
      <div className="flex items-center justify-between">
        <strong className="text-3xl font-black text-text-primary">
          {value}
        </strong>
        {icon && (
          <span className="material-symbols-outlined text-text-muted text-2xl group-hover:text-bright transition-colors">
            {icon}
          </span>
        )}
      </div>
      {note && (
        <p className={`text-xs mt-2 font-medium ${noteColors[noteType] || noteColors.muted}`}>
          {note}
        </p>
      )}
    </div>
  );
}

export function SectionTitle({ children }) {
  return (
    <h2 className="text-xl font-bold text-text-primary mb-5">{children}</h2>
  );
}

export function Tabs({ items, active, onChange }) {
  return (
    <div className="flex items-center gap-1 bg-surface/50 border border-divider rounded-2xl p-1.5 mb-6 w-fit">
      {items.map((item) => (
        <button
          key={item}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
            active === item
              ? "bg-bright text-app"
              : "text-text-secondary hover:text-text-primary hover:bg-white/5"
          }`}
          onClick={() => onChange?.(item)}
        >
          {item}
          {item === "Reported" && (
            <span className="ml-1.5 inline-flex items-center justify-center px-1.5 py-0.5 rounded-md bg-error/20 text-error text-[10px] font-bold">
              12
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export function Status({ value }) {
  const styles = {
    active: "bg-success/10 text-success border-success/20",
    pending: "bg-warning/10 text-warning border-warning/20",
    suspended: "bg-error/10 text-error border-error/20",
    paused: "bg-warning/10 text-warning border-warning/20",
    reported: "bg-error/10 text-error border-error/20",
    removed: "bg-white/5 text-text-muted border-white/10",
  };

  const dotColors = {
    active: "bg-success",
    pending: "bg-warning",
    suspended: "bg-error",
    paused: "bg-warning",
    reported: "bg-error",
    removed: "bg-text-muted",
  };

  const cls = value.toLowerCase();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
        styles[cls] || styles.active
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${dotColors[cls] || dotColors.active}`}
      />
      {value}
    </span>
  );
}

export function Pagination({ currentPage = 1, totalPages = 1, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-colors ${
          currentPage === 1
            ? "bg-white/5 border-divider text-text-muted cursor-not-allowed opacity-50"
            : "bg-white/5 border-divider text-text-secondary hover:bg-white/10"
        }`}
      >
        <span className="material-symbols-outlined text-[18px]">
          chevron_left
        </span>
      </button>

      {[...Array(totalPages)].map((_, i) => {
        const page = i + 1;
        if (
          page === 1 ||
          page === totalPages ||
          (page >= currentPage - 1 && page <= currentPage + 1)
        ) {
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold transition-colors ${
                currentPage === page
                  ? "bg-bright text-app border-transparent"
                  : "bg-white/5 border border-divider text-text-secondary hover:bg-white/10"
              }`}
            >
              {page}
            </button>
          );
        } else if (page === currentPage - 2 || page === currentPage + 2) {
          return (
            <span key={page} className="text-text-muted text-sm px-1">
              ...
            </span>
          );
        }
        return null;
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-colors ${
          currentPage === totalPages
            ? "bg-white/5 border-divider text-text-muted cursor-not-allowed opacity-50"
            : "bg-white/5 border-divider text-text-secondary hover:bg-white/10"
        }`}
      >
        <span className="material-symbols-outlined text-[18px]">
          chevron_right
        </span>
      </button>
    </div>
  );
}