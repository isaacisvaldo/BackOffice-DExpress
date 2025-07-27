export default function DashboardPage() {
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    window.location.href = '/';
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>
      <p>Bem-vindo! Você está logado.</p>
      <button onClick={handleLogout}>Sair</button>
    </div>
  );
}
