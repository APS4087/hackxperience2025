export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/40 bg-card/50 px-4 py-3">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="font-bold text-xl">Admin Dashboard</h1>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="px-4 py-2 rounded-md text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              Sign Out
            </button>
          </form>
        </div>
      </nav>
      <main className="container mx-auto py-8 px-4">
        {children}
      </main>
    </div>
  );
} 