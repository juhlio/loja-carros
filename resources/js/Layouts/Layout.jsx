export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="py-4 text-xl font-bold">Loja de Carros</h1>
                </div>
            </nav>
            <main>
                {children}
            </main>
        </div>
    );
}
