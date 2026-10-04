import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#031008]">
      <div className="flex min-h-screen">

        {/* Admin Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-[#D9DED9] bg-[#031008] text-[#F8F5EF] lg:block">
          <div className="sticky top-0 flex h-screen flex-col">

            {/* Logo / Brand */}
            <div className="flex h-20 items-center border-b border-[#33473B] px-6">
              <div>
                <h1 className="text-xl font-semibold tracking-wide">
                  Fernwood
                </h1>

                <p className="mt-1 text-xs text-[#B9C2BB]">
                  Administration
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-6">
              <div className="space-y-1">

                <AdminNavLink
                  to="/admin"
                  label="Dashboard"
                />

                <AdminNavLink
                  to="/admin/products"
                  label="Products"
                />

                <AdminNavLink
                  to="/admin/categories"
                  label="Categories"
                />

                <AdminNavLink
                  to="/admin/orders"
                  label="Orders"
                />

                <AdminNavLink
                  to="/admin/customers"
                  label="Customers"
                />

                <AdminNavLink
                  to="/admin/inventory"
                  label="Inventory"
                />

                <AdminNavLink
                  to="/admin/reviews"
                  label="Reviews"
                />

                <AdminNavLink
                  to="/admin/3d-models"
                  label="3D Models"
                />

              </div>
            </nav>

            {/* Sidebar Footer */}
            <div className="border-t border-[#33473B] p-4">
              <p className="text-xs text-[#B9C2BB]">
                Fernwood Furniture
              </p>

              <p className="mt-1 text-xs text-[#7F8C83]">
                Admin Panel
              </p>
            </div>
          </div>
        </aside>

        {/* Admin Content Area */}
        <div className="flex min-w-0 flex-1 flex-col">

          {/* Admin Header */}
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#D9DED9] bg-[#F8F5EF]/95 px-4 backdrop-blur sm:px-6 lg:px-8">
            <div>
              <h2 className="text-lg font-semibold">
                Admin Panel
              </h2>

              <p className="hidden text-sm text-[#66736B] sm:block">
                Manage your Fernwood Furniture store
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-[#66736B] sm:inline">
                Administrator
              </span>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#33473B] text-sm font-medium text-white">
                A
              </div>
            </div>
          </header>

          {/* Current Admin Page */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>

        </div>
      </div>
    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Admin Navigation Link
|--------------------------------------------------------------------------
*/

const AdminNavLink = ({ to, label }) => {
  return (
    <a
      href={to}
      className="flex items-center rounded-lg px-4 py-3 text-sm font-medium text-[#DCE3DE] transition-colors hover:bg-[#33473B] hover:text-white"
    >
      {label}
    </a>
  );
};

export default AdminLayout;