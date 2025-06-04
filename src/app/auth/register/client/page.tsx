import ClientRegisterForm from './client-form';

export default function ClientRegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6" style={{ background: '#23272f' }}>
      <div className="w-full max-w-lg p-8 bg-card rounded-lg shadow">
        <ClientRegisterForm />
      </div>
    </main>
  );
}
