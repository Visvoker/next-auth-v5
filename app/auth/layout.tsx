const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-from),var(--tw-gradient-to))] from-sky-400 to-blue-800">
      {children}
    </div>
  );
};

export default AuthLayout;
