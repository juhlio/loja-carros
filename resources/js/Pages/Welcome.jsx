import Layout from '../Layouts/Layout';

export default function Welcome() {
    return (
        <Layout>
            <div className="max-w-7xl mx-auto py-12 px-4">
                <h1 className="text-3xl font-bold mb-4">Bem-vindo à Loja de Carros</h1>
                <p className="text-gray-600">Inertia + React + Tailwind funcionando!</p>
            </div>
        </Layout>
    );
}
