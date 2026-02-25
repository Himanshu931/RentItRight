const WelcomeSection = ({ user }) => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-text-primary mb-3">
        Welcome back, {user?.name || "Owner"}
      </h1>

      <p className="text-text-secondary">
        Here's how your listed items are performing today
      </p>
    </div>
  );
};

export default WelcomeSection;